(function(){

  var tenthPattern = new RegExp('^[XF0-9\-]{1}[XF0-9\-\/]?[XF0-9\-\/]?$','i'),
      basicPattern = new RegExp('^[XF0-9\-]{1}[F0-9\-\/]?$', 'i'),
      zeroEquiv = new RegExp('[F\-]', 'g');

  function validateFrame (frame, isTenthFrame) {
    if(frame.length == 0){
      throw new Error('frame must not be empty: '+frame);
    }else if(frame.length > 3) {
      throw new Error('frame must be less than 4 chars: '+frame);
    }else if(frame.length === 3 && !isTenthFrame) {
      throw new Error('frame length too long for frames 1-9: '+frame);
    }else if(isTenthFrame && !tenthPattern.test(frame)){
      throw new Error('failed tenth frame validation'+frame);
    }else if(!isTenthFrame && !basicPattern.test(frame)){
      throw new Error('failed normal frame validation'+frame);
    }
  }

  function parseFrame (result) {
    if(typeof result !== 'string') result = result + '';

    result = result.replace(/0/g,'-');
    result = result.toUpperCase();
    return result;
  }

  function isStrike(frame) { return frame === 'X'; }

  function isSpare(frame) {
    return frame.length === 2 && frame.match(/\//);
  }

  function scoreFrame (frame) {
    var score;

    if(isStrike(frame) || isSpare(frame)){
      score = null;
    }else{
      var addable = frame.replace(zeroEquiv,'0');
      score = 0;
      for(var c=0; c<addable.length; c++){
        score += parseInt(addable[c], 10);
        if(score > 9) throw new Error('invalid frame score: '+frame+ ' = '+score);
      }
    }
    return score;
  }

  function getRollScores(frames) {
    if(frames === undefined) frames = [];

    var rollScores = [],
        rolls = frames.join('').replace(zeroEquiv, '0');

    for(var t=0; t<rolls.length; t++) {
      var score;

      if(rolls[t] === 'X'){
        score = 10;
      }else if (rolls[t] === '/'){
        score = 10-parseInt(rolls[t-1],10);
      }else{
        score = parseInt(rolls[t],10);
      }

      rollScores.push(score);
    }

    return rollScores;
  }

  function updateCumulatives(scoresheet) {
    var cumulative = 0;
    for(var f=0; f<scoresheet.length; f++){
      if(scoresheet[f].score === null) break;

      cumulative += scoresheet[f].score;
      scoresheet[f].cumulative = cumulative;
    }
    return scoresheet;
  }

  function scoreTenthFrame(frame) {
    var score = 0,
        isFinal = false;

    if(frame.length === 3){
      isFinal = true;
    }else if(frame.length === 2 && frame[1] !== 'X' && frame[1] !== '/' ){
      isFinal = true;
    }

    if(!isFinal) return null;

    while(frame.length > 0) {
      if(isStrike(frame[0])){
        score += 10;
        frame = frame.slice(1);
      }else if(isSpare(frame.substr(0,2))){
        score += 10;
        frame = frame.slice(2);
      }else{
        score += scoreFrame(frame[0]);
        frame = frame.slice(1);
      }
    }
    return score;

  }

  function attemptFrameFinalize(frame, leadingFrames) {
    var prevIsPending = frame.score === null,
        nextScores = getRollScores(leadingFrames),
        bonus = 0;

    if(prevIsPending){
      if(isStrike(frame.outcome)){
        if(nextScores.length >= 2){
          bonus += nextScores[0];
          bonus += nextScores[1];
          frame.score = 10 + bonus;
        }
      }else if(isSpare(frame.outcome)){
        if(nextScores.length >= 1){
          bonus += nextScores[0];
          frame.score = 10 + bonus;
        }
      }
    }
  }

  module.exports = function parseGame (game) {
    var scoresheet = [],
        totalScore = 0;

    if(game.length > 10) throw new Error('too many frames');

    for(var i=0; i<game.length; i++ ) {
      var isTenthFrame = i===9,
          notFirstFrame = i>0,
          notFirstTwoFrames = i>1,
          cleanOutcome = parseFrame(game[i], isTenthFrame);

      validateFrame(cleanOutcome, isTenthFrame);

      scoresheet[i] = {
        outcome: cleanOutcome,
        cumulative: null,
        score: scoreFrame(cleanOutcome)
      };

      if(notFirstFrame){
        var prevFrame = scoresheet[i-1],
            leadingFrames = [scoresheet[i].outcome];

        attemptFrameFinalize(prevFrame, leadingFrames);
      }

      if(notFirstTwoFrames) {
        var prevFrame = scoresheet[i-2],
            leadingFrames = [scoresheet[i-1].outcome, scoresheet[i].outcome];

        attemptFrameFinalize(prevFrame, leadingFrames);
      }

      if(isTenthFrame){
        scoresheet[i].score = scoreTenthFrame(scoresheet[i].outcome);
      }
    }

    scoresheet = updateCumulatives(scoresheet);

    return scoresheet;
  }

})(this);

var tenthPattern = new RegExp('^[X0-9\-]{1}[X0-9\-\/]?[X0-9\-\/]?$','i');
var basicPattern = new RegExp('^[X0-9\-]{1}[0-9\-\/]?$', 'i');

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

function normalizeFrame (result) {
  result = result.replace(/0/,'-');
  result = result.toUpperCase();
  return result;
}

function parseFrame (result, isTenthFrame) {
  if(isTenthFrame === undefined) isTenthFrame = false;
  if(typeof result !== 'string') result = result + '';

  validateFrame(result, isTenthFrame);
  result = normalizeFrame(result);
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
    var addable = frame.replace(/\-/,'0');
    score = 0;
    for(var c=0; c<addable.length; c++){
      score += parseInt(addable[c], 10);
      if(score > 9) throw new Error('invalid frame score: '+frame+ ' = '+score);
    }
  }
  return score;
}

function getNextScores(f1, f2) {
  if(f1 === undefined) f1 = '';
  if(f2 === undefined) f2 = '';

  var nextScores = [];
  nextThrows = f1+f2+'';
  for(var t=0; t<nextThrows.length; t++) {
    var score, thw, prevThw;

    thw = nextThrows[t].replace(/\-/g, '0');

    if(thw === 'X'){
      score = 10;
    }else if (thw === '/'){
      prevThw = nextThrows[t-1].replace(/\-/g, '0');
      score = 10-parseInt(prevThw,10);
    }else{
      score = parseInt(thw,10);
    }

    nextScores.push(score);
  }

  return nextScores;
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
  score = 0

  if(isStrike(frame[0])){
    score += 10;
    if(isStrike(frame[1])){
      score += 10;
      if(isStrike(frame[2])){
        score += 10;
      }else{
        score += scoreFrame(frame[2]);
      }
    }else{
      if(isSpare(frame.substr(1,2))){
        score += 10;
      }else{
        score += scoreFrame(frame.substr(1,2));
      }
    }
  }else if(isSpare(frame.substr(0,2))){
    score += 10;
    score += scoreFrame(frame[2]);
  }else{
    score += scoreFrame(frame);
  }

  return score;

}

module.exports = function parseGame (game) {
  var scoresheet = [],
      totalScore = 0;

  if(game.length > 10) throw new Error('too many frames');

  for(var i=0; i<game.length; i++ ) {
    var frame = game[i],
        pFrame1, pFrame2,
        isTenthFrame = i===9;

    frame = parseFrame(frame, isTenthFrame);

    scoresheet[i] = {
      outcome: frame,
      cumulative: null,
      score: scoreFrame(frame)
    };

    // attempt to close prev frame

    if(i > 0) {
      pFrame1 = scoresheet[i-1];
      if(pFrame1.score === null){
        var bonus = 0, nextScores;
        if(isStrike(pFrame1.outcome)) {
          nextScores = getNextScores(scoresheet[i].outcome);

          if(nextScores.length >= 2){
            bonus += nextScores[0];
            bonus += nextScores[1];
            pFrame1.score = 10+bonus;
          }
        }else if (isSpare(pFrame1.outcome)) {
          nextScores = getNextScores(scoresheet[i].outcome);
          if(nextScores.length >= 1){
            bonus += nextScores[0];
            pFrame1.score = 10+bonus;
          }
        }
      }
    }

    // attempt to close frame before last

    if(i > 1) {

      pFrame2 = scoresheet[i-2];
      if(pFrame2.score === null){
        var bonus = 0, nextScores;

        if(isStrike(pFrame2.outcome)) {
          nextScores = getNextScores(scoresheet[i-1].outcome, scoresheet[i].outcome);
          if(nextScores.length >= 2){
            bonus += nextScores[0];
            bonus += nextScores[1];
            pFrame2.score = 10+bonus;
          }
        }else if (isSpare(pFrame2.outcome)) {
          nextScores = getNextScores(scoresheet[i-1].outcome, scoresheet[i].outcome);
          if(nextScores.length >= 1){
            bonus += nextScores[0];
            pFrame2.score = 10+bonus;
          }
        }
      }
    }

    if(isTenthFrame){
      scoresheet[i].score = scoreTenthFrame(scoresheet[i].outcome);
    }
  }

  scoresheet = updateCumulatives(scoresheet);

  return scoresheet;
}

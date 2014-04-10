// split frame functions to own file, w/ unit tests
// replace for loops with something better looking
// browserling test badge
// support fouls, 'f', 'F' == '0', '-'

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
  result = result.replace(/0/g,'-');
  result = result.toUpperCase();
  return result;
}

// don't call validateFrame from inside here
function parseFrame (result, isTenthFrame) {
  if(isTenthFrame === undefined) isTenthFrame = false;
  if(typeof result !== 'string') result = result + '';

  result = normalizeFrame(result);
  validateFrame(result, isTenthFrame);
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
    var addable = frame.replace(/\-/g,'0');
    score = 0;
    for(var c=0; c<addable.length; c++){
      score += parseInt(addable[c], 10);
      if(score > 9) throw new Error('invalid frame score: '+frame+ ' = '+score);
    }
  }
  return score;
}

// should accept array of leading frame outcomes
// return array of throw scores
// change name of fn
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

// this should not credit a strike/spare until sufficient subsequent shots completed
// add test: X to begin 10th frame. should settle prior frames, but 10th is pending
function scoreTenthFrame(frame) {
  score = 0

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

module.exports = function parseGame (game) {
  var scoresheet = [],
      totalScore = 0;

  // validate game fn
  if(game.length > 10) throw new Error('too many frames');

  for(var i=0; i<game.length; i++ ) {

    // all of this in a processFrame fn
    var pFrame2,
        isTenthFrame = i===9,
        notFirstFrame = i>0,
        notFirstTwoFrames = i>1,
        cleanOutcome = parseFrame(game[i], isTenthFrame);

    scoresheet[i] = {
      outcome: cleanOutcome,
      cumulative: null,
      score: scoreFrame(cleanOutcome)
    };

    if(notFirstFrame){

      // should be own fn
      var prevFrame = scoresheet[i-1],
          prevIsPending = prevFrame.score === null,
          nextScores = getNextScores(scoresheet[i].outcome),
          bonus = 0;

      if(prevIsPending){
        if(isStrike(prevFrame.outcome)){
          if(nextScores.length >= 2){
            bonus += nextScores[0];
            bonus += nextScores[1];
            prevFrame.score = 10 + bonus;
          }
        }else if(isSpare(prevFrame.outcome)){
          if(nextScores.length >= 1){
            bonus += nextScores[0];
            prevFrame.score = 10 + bonus;
          }
        }
      }
    }

    // attempt to close frame before last
    if(notFirstTwoFrames) {
      var prevFrame = scoresheet[i-2],
          prevIsPending = prevFrame.score === null,
          nextScores = nextScores = getNextScores(scoresheet[i-1].outcome, scoresheet[i].outcome)
          bonus = 0;

      // should be own fn
      if(prevIsPending){

        if(isStrike(prevFrame.outcome)) {

          if(nextScores.length >= 2){
            bonus += nextScores[0];
            bonus += nextScores[1];
            prevFrame.score = 10+bonus;
          }
        }else if (isSpare(prevFrame.outcome)) {
          if(nextScores.length >= 1){
            bonus += nextScores[0];
            prevFrame.score = 10+bonus;
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

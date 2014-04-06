function validateFrame (result, isTenthFrame) {
  if(result.length == 0){
    throw new Error('frame must not be empty: '+result);
  }
  if(result.length > 3) {
    throw new Error('frame must be less than 4 chars: '+result);
  }
  if(result.length === 3 && !isTenthFrame) {
    throw new Error('frame length too long for frames 1-9: '+result);
  }
}

function normalizeResult (result) {
  result = result.replace(/0/,'-');
  result = result.toUpperCase();
  return result;
}

function parseFrame (result, isTenthFrame) {
  if(isTenthFrame === undefined) isTenthFrame = false;
  if(typeof result !== 'string') result = result + '';

  validateFrame(result, isTenthFrame);
  result = normalizeResult(result);
  return result;

}

function isStrike(frame) {
  if(frame === 'X'){
    return true;
  }else{
    return false;
  }
}

function isSpare(frame) {
  if(frame.length === 2 && frame.match(/\//)){
    return true;
  }else{
    return false;
  }
}

function scoreFrame (frame) {
  var score;

  if(frame === 'X'){
    score = null;
  }else if(frame.match(/\//)){
    score =  null;
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

module.exports = function parseGame (game) {
  var scoresheet = [],
      totalScore = 0;

  for(var i=0; i<game.length; i++ ) {
    var frame = game[i],
        pFrame1, pFrame2;

    frame = parseFrame(frame, i===9);

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
  }

  scoresheet = updateCumulatives(scoresheet);

  return scoresheet;
}

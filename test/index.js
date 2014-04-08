var test = require('tape'),
    lib = require('..');

test('a complete game', function(t){
  var gm1 = ['81','9-','9/','71','9-','X','90','70','x','7-'];
  var result = lib(gm1);
  var expected = [
    {outcome: '81', cumulative: 9, score: 9},
    {outcome: '9-', cumulative: 18, score: 9},
    {outcome: '9/', cumulative: 35, score: 17},
    {outcome: '71', cumulative: 43, score: 8},
    {outcome: '9-', cumulative: 52, score: 9},
    {outcome: 'X', cumulative: 71, score: 19},
    {outcome: '9-', cumulative: 80, score: 9},
    {outcome: '7-', cumulative: 87, score: 7},
    {outcome: 'X', cumulative: 104, score: 17},
    {outcome: '7-', cumulative: 111, score: 7}
  ];
  t.deepEqual(result, expected);
  t.end();
});

test('too many frames should throw', function(t){
  t.throws(function(){
    lib(['81','9-','9/','71','9-','X','90','70','x','7-','x']);

  }, Error);

  t.end();
});

test('invalid frame should throw', function(t){
  t.throws(function(){
    lib(['78']);
  }, Error);

  t.throws(function(){
    lib(['787']);
  }, Error);

  t.throws(function(){
    lib(['']);
  }, Error);

  t.throws(function(){
    lib(['/9']);
  }, Error);

  t.end();
});


test('second complete game', function(t){
  var result = lib(['80','x','1/','7/','90','6-','x','43','62','8/6']);
  var expected = [
    {outcome: '8-', cumulative: 8, score: 8},
    {outcome: 'X', cumulative: 28, score: 20},
    {outcome: '1/', cumulative: 45, score: 17},
    {outcome: '7/', cumulative: 64, score: 19},
    {outcome: '9-', cumulative: 73, score: 9},
    {outcome: '6-', cumulative: 79, score: 6},
    {outcome: 'X', cumulative: 96, score: 17},
    {outcome: '43', cumulative: 103, score: 7},
    {outcome: '62', cumulative: 111, score: 8},
    {outcome: '8/6', cumulative: 127, score: 16}
  ];
  t.deepEqual(result, expected);
  t.end();
});

test('strikeout to finish', function(t){
  var result = lib(['80','x','1/','7/','90','6-','x','43','X','xxX']);
  var expected = [
    {outcome: '8-', cumulative: 8, score: 8},
    {outcome: 'X', cumulative: 28, score: 20},
    {outcome: '1/', cumulative: 45, score: 17},
    {outcome: '7/', cumulative: 64, score: 19},
    {outcome: '9-', cumulative: 73, score: 9},
    {outcome: '6-', cumulative: 79, score: 6},
    {outcome: 'X', cumulative: 96, score: 17},
    {outcome: '43', cumulative: 103, score: 7},
    {outcome: 'X', cumulative: 133, score: 30},
    {outcome: 'XXX', cumulative: 163, score: 30}
  ];
  t.deepEqual(result, expected);
  t.end();
});

test('an incomplete game', function(t){
  var result = lib(['80','x','1/','7/','9']);
  var expected = [
    {outcome: '8-', cumulative: 8, score: 8},
    {outcome: 'X', cumulative: 28, score: 20},
    {outcome: '1/', cumulative: 45, score: 17},
    {outcome: '7/', cumulative: 64, score: 19},
    {outcome: '9', cumulative: 73, score: 9}
  ];
  t.deepEqual(result, expected);
  t.end();
});

test('did someone say "a perfect game"?', function(t){
  var result = lib(['x','x','x','X','x','X','X','X','X','xxX']);
  var expected = [
    {outcome: 'X', cumulative: 30, score: 30},
    {outcome: 'X', cumulative: 60, score: 30},
    {outcome: 'X', cumulative: 90, score: 30},
    {outcome: 'X', cumulative: 120, score: 30},
    {outcome: 'X', cumulative: 150, score: 30},
    {outcome: 'X', cumulative: 180, score: 30},
    {outcome: 'X', cumulative: 210, score: 30},
    {outcome: 'X', cumulative: 240, score: 30},
    {outcome: 'X', cumulative: 270, score: 30},
    {outcome: 'XXX', cumulative: 300, score: 30}
  ];
  t.deepEqual(result, expected);
  t.end();
});

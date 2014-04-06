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

  t.end();
});

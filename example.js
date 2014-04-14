var lib = require('./index'),
    async = require('async'),
    tt = require('text-table'),
    progression = [
      ['8'],
      ['81'],
      ['81','9'],
      ['81','9/'],
      ['81','9/','9'],
      ['81','9/','9-'],
      ['81','9/','9-','7'],
      ['81','9/','9-','71'],
      ['81','9/','9-','71','x'],
      ['81','9/','9-','71','x','f'],
      ['81','9/','9-','71','x','f8'],
      ['81','9/','9-','71','x','f8','X'],
      ['81','9/','9-','71','x','f8','X','0'],
      ['81','9/','9-','71','x','f8','X','0/'],
      ['81','9/','9-','71','x','f8','X','0/','3'],
      ['81','9/','9-','71','x','f8','X','0/','36'],
      ['81','9/','9-','71','x','f8','X','0/','36','x'],
      ['81','9/','9-','71','x','f8','X','0/','36','x4'],
      ['81','9/','9-','71','x','f8','X','0/','36','x4/']
    ];

var scoreboard = [
  ['  1', '  2', '  3', '  4', '  5', '  6', '  7','  8','  9',' 10'],
  null,
  null
];

var scoreboardFmt = {
  align: ['r','r','r','r','r','r','r','r','r','r']
};

process.stdout.write('\033[2J\n');

async.eachSeries(progression, function(state, cb){
  var thruRoll = lib(state);

  scoreboard[1] = thruRoll.map(function(frame){
    return frame.outcome || '';
  });

  scoreboard[2] = thruRoll.map(function(frame){
    return frame.cumulative || '';
  });
  process.stdout.write('\033[2J\n');
  process.stdout.write(tt(scoreboard,scoreboardFmt));
  setTimeout(cb, 400);
},function(){});

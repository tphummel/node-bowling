// requires separate install of `async` and `text-table` modules

const lib = require('./index')
const async = require('async')
const tt = require('text-table')
const progression = [
  ['8'],
  ['81'],
  ['81', '9'],
  ['81', '9/'],
  ['81', '9/', '9'],
  ['81', '9/', '9-'],
  ['81', '9/', '9-', '7'],
  ['81', '9/', '9-', '71'],
  ['81', '9/', '9-', '71', 'x'],
  ['81', '9/', '9-', '71', 'x', 'f'],
  ['81', '9/', '9-', '71', 'x', 'f8'],
  ['81', '9/', '9-', '71', 'x', 'f8', 'X'],
  ['81', '9/', '9-', '71', 'x', 'f8', 'X', '0'],
  ['81', '9/', '9-', '71', 'x', 'f8', 'X', '0/'],
  ['81', '9/', '9-', '71', 'x', 'f8', 'X', '0/', '3'],
  ['81', '9/', '9-', '71', 'x', 'f8', 'X', '0/', '36'],
  ['81', '9/', '9-', '71', 'x', 'f8', 'X', '0/', '36', 'x'],
  ['81', '9/', '9-', '71', 'x', 'f8', 'X', '0/', '36', 'x4'],
  ['81', '9/', '9-', '71', 'x', 'f8', 'X', '0/', '36', 'x4/']
]

const scoreboard = [
  ['  1', '  2', '  3', '  4', '  5', '  6', '  7', '  8', '  9', ' 10'],
  null,
  null
]

const scoreboardFmt = {
  align: ['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r']
}

process.stdout.write('\x1B[2J\n')

async.eachSeries(progression, function (state, cb) {
  const thruRoll = lib(state)

  scoreboard[1] = thruRoll.map(function (frame) {
    return frame.outcome || ''
  })

  scoreboard[2] = thruRoll.map(function (frame) {
    return frame.cumulative || ''
  })
  process.stdout.write('\x1B[2J\n')
  process.stdout.write(tt(scoreboard, scoreboardFmt))
  setTimeout(cb, 400)
}, function () {})

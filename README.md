
# node-bowling

[![Node.js CI](https://github.com/tphummel/node-bowling/actions/workflows/main.yml/badge.svg)](https://github.com/tphummel/node-bowling/actions/workflows/main.yml) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard) [![Known Vulnerabilities](https://snyk.io/test/github/tphummel/node-bowling/badge.svg?targetFile=package.json)](https://snyk.io/test/github/tphummel/node-bowling?targetFile=package.json) [![Socket Badge](https://socket.dev/api/badge/npm/package/bowling)](https://socket.dev/npm/package/bowling)

 📝 scorekeeping for ten pin bowling 🎳

 - supports complete and incomplete games
 - 100% test coverage
 - zero dependencies

[![NPM](https://nodei.co/npm/bowling.png?downloads=true)](https://nodei.co/npm/bowling/)

# install

    npm install bowling

# test

    npm test

# usage

    var bowl = require('bowling')


    var aCompleteGame = ['81','9-','9/','71','9-','X','90','70','x','7-'],
        result

    result = bowl(aCompleteGame)

    console.log(result)

    /*
    [
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
    ]
    */

# example

`example.js`: a script that shows how a game could be scored progressively

![Example](http://i.imgur.com/A9NlY6W.gif)

also: a [live-updating terminal scoreboard](https://gist.github.com/tphummel/f757412870387c9897b9)

# notes

- miss: `0` or `-`
- strike: `x` or `X`
- foul: `f` or `F`

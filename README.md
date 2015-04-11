
# node-bowling

apply scoring logic to ten-pin bowling results. handles both incomplete and complete games.

[![Build Status](https://travis-ci.org/tphummel/node-bowling.png)](https://travis-ci.org/tphummel/node-bowling) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

[![NPM](https://nodei.co/npm/bowling.png?downloads=true)](https://nodei.co/npm/bowling/)

[![testling badge](https://ci.testling.com/tphummel/node-bowling.png)](https://ci.testling.com/tphummel/node-bowling)

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

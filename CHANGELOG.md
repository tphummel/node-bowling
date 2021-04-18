1.4.1 / 2021-04-17
==================

  * ignore example.gif to shrink the size of the npm tarball

1.4.0 / 2021-04-17
==================

  * dropped test matrix support for node.js 8
  * added test matrix support for node.js 14, 15
  * upgrade node-tap from 14->15

1.3.12 / 2020-11-11
==================

  * upgrade standardjs 14 -> 16
  * bump transitive dep: yargs-parser


1.3.11 / 2020-07-26
==================

  * bump two transitive deps: lodash,

1.3.10 / 2020-01-23
==================

  * npm upgrade
  * add node 12 to version matrix

1.3.9 / 2018-11-27
==================

  * remove non-essential dev dependencies
  * drop node 4 and 6 from ci build matrix
  * move from travis org to com

1.3.8 / 2018-01-28
==================

  * remove IIFE wrapper

1.3.7 / 2018-01-28
==================

  * upgrade standard
  * upgrade node-tap
  * add CI support for node.js 8.x
  * enforce 100% unit test coverage
  * add snyk and nsp scans
  * readme badge cleanup

1.3.6 / 2017-02-24
==================

  * upgrade node-tap
  * drop CI support for node.js 0.10.x

1.3.5 / 2016-08-24
==================

  * Merge pull request #22 from tphummel/node-6.x
  * remove 0.11, iojs, 5.x node versions from travis.yml
  * Merge pull request #18 from tphummel/greenkeeper-async-2.0.0
  * add node 6.x to travis.yml
  * chore(package): update async to version 2.0.0
  * Merge pull request #21 from tphummel/greenkeeper-standard-8.0.0
  * chore(package): update standard to version 8.0.0


1.3.4 / 2016-08-10
==================

  * upgrade tap from 5.7.1 -> 6.3.0

1.3.3 / 2016-06-12
==================

  * upgraded feross/standard to v7.1.2
  * removed unnecessary escape chars from regular expressions

1.3.2 / 2016-04-09
==================

  * travis: automated npm publish on git tag
  * added two tests to reach 100% coverage
  * travis: target node versions 4.x, 5.x generally
  * standard linter fixes
  * update all deps with greenkeeper

1.3.1 / 2015-10-05
==================

  * test nodejs 4.0, 4.1
  * updated npm test lifecycle

1.3.0 / 2015-05-30
==================

  * added test coverage

1.2.5 / 2015-02-06
==================

  * travis: added 0.12, io.js

1.2.4 / 2015-02-03
==================

  * readme: link to live-updating scoreboard

1.2.3 / 2015-01-30
==================

  * jshint, asi
  * devDeps update

1.2.2 / 2014-04-13
==================

  * example usage script

1.2.1 / 2014-04-13
==================

 * test/testling, pkg, readme updates

1.2.0 / 2014-04-12
==================

 * iife
 * fix: tenth frame finalizing too early
 * vocab: replace 'throw' with 'roll'
 * added support for fouls, dedupe chars that eval to zero points

1.1.0 / 2014-04-07
==================

 * simplified tenth frame
 * various fixes for edge cases
 * validateFrame: use a relaxed regex to check general character format

1.0.0 / 2014-04-06
==================

 * basic functionality in place
 * test coverage for a few games i made up
 * messy but functional

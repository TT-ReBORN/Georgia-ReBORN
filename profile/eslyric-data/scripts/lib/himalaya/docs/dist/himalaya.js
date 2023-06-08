(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.himalaya = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var cov_24vn3a78n4 = function () {
  var path = '/Users/chrisandrejewski/Desktop/Work/github-repos/himalaya/src/compat.js',
      hash = 'cde94accf38c67a096269c512dfb0f1bca69a38a',
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = '__coverage__',
      coverageData = {
    path: '/Users/chrisandrejewski/Desktop/Work/github-repos/himalaya/src/compat.js',
    statementMap: {
      '0': {
        start: {
          line: 10,
          column: 2
        },
        end: {
          line: 10,
          column: 72
        }
      },
      '1': {
        start: {
          line: 14,
          column: 16
        },
        end: {
          line: 14,
          column: 62
        }
      },
      '2': {
        start: {
          line: 15,
          column: 20
        },
        end: {
          line: 15,
          column: 56
        }
      },
      '3': {
        start: {
          line: 16,
          column: 2
        },
        end: {
          line: 16,
          column: 48
        }
      },
      '4': {
        start: {
          line: 20,
          column: 2
        },
        end: {
          line: 20,
          column: 56
        }
      },
      '5': {
        start: {
          line: 24,
          column: 2
        },
        end: {
          line: 24,
          column: 42
        }
      },
      '6': {
        start: {
          line: 28,
          column: 14
        },
        end: {
          line: 28,
          column: 26
        }
      },
      '7': {
        start: {
          line: 29,
          column: 2
        },
        end: {
          line: 29,
          column: 29
        }
      },
      '8': {
        start: {
          line: 29,
          column: 17
        },
        end: {
          line: 29,
          column: 29
        }
      },
      '9': {
        start: {
          line: 31,
          column: 22
        },
        end: {
          line: 31,
          column: 34
        }
      },
      '10': {
        start: {
          line: 32,
          column: 23
        },
        end: {
          line: 32,
          column: 47
        }
      },
      '11': {
        start: {
          line: 33,
          column: 20
        },
        end: {
          line: 33,
          column: 70
        }
      },
      '12': {
        start: {
          line: 34,
          column: 2
        },
        end: {
          line: 38,
          column: 3
        }
      },
      '13': {
        start: {
          line: 35,
          column: 20
        },
        end: {
          line: 35,
          column: 40
        }
      },
      '14': {
        start: {
          line: 36,
          column: 4
        },
        end: {
          line: 36,
          column: 46
        }
      },
      '15': {
        start: {
          line: 36,
          column: 35
        },
        end: {
          line: 36,
          column: 46
        }
      },
      '16': {
        start: {
          line: 37,
          column: 4
        },
        end: {
          line: 37,
          column: 55
        }
      },
      '17': {
        start: {
          line: 37,
          column: 44
        },
        end: {
          line: 37,
          column: 55
        }
      },
      '18': {
        start: {
          line: 40,
          column: 2
        },
        end: {
          line: 40,
          column: 14
        }
      }
    },
    fnMap: {
      '0': {
        name: 'startsWith',
        decl: {
          start: {
            line: 9,
            column: 16
          },
          end: {
            line: 9,
            column: 26
          }
        },
        loc: {
          start: {
            line: 9,
            column: 57
          },
          end: {
            line: 11,
            column: 1
          }
        },
        line: 9
      },
      '1': {
        name: 'endsWith',
        decl: {
          start: {
            line: 13,
            column: 16
          },
          end: {
            line: 13,
            column: 24
          }
        },
        loc: {
          start: {
            line: 13,
            column: 55
          },
          end: {
            line: 17,
            column: 1
          }
        },
        line: 13
      },
      '2': {
        name: 'stringIncludes',
        decl: {
          start: {
            line: 19,
            column: 16
          },
          end: {
            line: 19,
            column: 30
          }
        },
        loc: {
          start: {
            line: 19,
            column: 61
          },
          end: {
            line: 21,
            column: 1
          }
        },
        line: 19
      },
      '3': {
        name: 'isRealNaN',
        decl: {
          start: {
            line: 23,
            column: 16
          },
          end: {
            line: 23,
            column: 25
          }
        },
        loc: {
          start: {
            line: 23,
            column: 30
          },
          end: {
            line: 25,
            column: 1
          }
        },
        line: 23
      },
      '4': {
        name: 'arrayIncludes',
        decl: {
          start: {
            line: 27,
            column: 16
          },
          end: {
            line: 27,
            column: 29
          }
        },
        loc: {
          start: {
            line: 27,
            column: 63
          },
          end: {
            line: 41,
            column: 1
          }
        },
        line: 27
      }
    },
    branchMap: {
      '0': {
        loc: {
          start: {
            line: 10,
            column: 20
          },
          end: {
            line: 10,
            column: 33
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 10,
            column: 20
          },
          end: {
            line: 10,
            column: 28
          }
        }, {
          start: {
            line: 10,
            column: 32
          },
          end: {
            line: 10,
            column: 33
          }
        }],
        line: 10
      },
      '1': {
        loc: {
          start: {
            line: 14,
            column: 17
          },
          end: {
            line: 14,
            column: 39
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 14,
            column: 17
          },
          end: {
            line: 14,
            column: 25
          }
        }, {
          start: {
            line: 14,
            column: 29
          },
          end: {
            line: 14,
            column: 39
          }
        }],
        line: 14
      },
      '2': {
        loc: {
          start: {
            line: 16,
            column: 9
          },
          end: {
            line: 16,
            column: 48
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 16,
            column: 9
          },
          end: {
            line: 16,
            column: 25
          }
        }, {
          start: {
            line: 16,
            column: 29
          },
          end: {
            line: 16,
            column: 48
          }
        }],
        line: 16
      },
      '3': {
        loc: {
          start: {
            line: 20,
            column: 35
          },
          end: {
            line: 20,
            column: 48
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 20,
            column: 35
          },
          end: {
            line: 20,
            column: 43
          }
        }, {
          start: {
            line: 20,
            column: 47
          },
          end: {
            line: 20,
            column: 48
          }
        }],
        line: 20
      },
      '4': {
        loc: {
          start: {
            line: 24,
            column: 9
          },
          end: {
            line: 24,
            column: 42
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 24,
            column: 9
          },
          end: {
            line: 24,
            column: 30
          }
        }, {
          start: {
            line: 24,
            column: 34
          },
          end: {
            line: 24,
            column: 42
          }
        }],
        line: 24
      },
      '5': {
        loc: {
          start: {
            line: 29,
            column: 2
          },
          end: {
            line: 29,
            column: 29
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 29,
            column: 2
          },
          end: {
            line: 29,
            column: 29
          }
        }, {
          start: {
            line: 29,
            column: 2
          },
          end: {
            line: 29,
            column: 29
          }
        }],
        line: 29
      },
      '6': {
        loc: {
          start: {
            line: 33,
            column: 20
          },
          end: {
            line: 33,
            column: 70
          }
        },
        type: 'cond-expr',
        locations: [{
          start: {
            line: 33,
            column: 39
          },
          end: {
            line: 33,
            column: 50
          }
        }, {
          start: {
            line: 33,
            column: 53
          },
          end: {
            line: 33,
            column: 70
          }
        }],
        line: 33
      },
      '7': {
        loc: {
          start: {
            line: 36,
            column: 4
          },
          end: {
            line: 36,
            column: 46
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 36,
            column: 4
          },
          end: {
            line: 36,
            column: 46
          }
        }, {
          start: {
            line: 36,
            column: 4
          },
          end: {
            line: 36,
            column: 46
          }
        }],
        line: 36
      },
      '8': {
        loc: {
          start: {
            line: 37,
            column: 4
          },
          end: {
            line: 37,
            column: 55
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 37,
            column: 4
          },
          end: {
            line: 37,
            column: 55
          }
        }, {
          start: {
            line: 37,
            column: 4
          },
          end: {
            line: 37,
            column: 55
          }
        }],
        line: 37
      },
      '9': {
        loc: {
          start: {
            line: 37,
            column: 8
          },
          end: {
            line: 37,
            column: 42
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 37,
            column: 8
          },
          end: {
            line: 37,
            column: 20
          }
        }, {
          start: {
            line: 37,
            column: 24
          },
          end: {
            line: 37,
            column: 42
          }
        }],
        line: 37
      }
    },
    s: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
      '10': 0,
      '11': 0,
      '12': 0,
      '13': 0,
      '14': 0,
      '15': 0,
      '16': 0,
      '17': 0,
      '18': 0
    },
    f: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0
    },
    b: {
      '0': [0, 0],
      '1': [0, 0],
      '2': [0, 0],
      '3': [0, 0],
      '4': [0, 0],
      '5': [0, 0],
      '6': [0, 0],
      '7': [0, 0],
      '8': [0, 0],
      '9': [0, 0]
    },
    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startsWith = startsWith;
exports.endsWith = endsWith;
exports.stringIncludes = stringIncludes;
exports.isRealNaN = isRealNaN;
exports.arrayIncludes = arrayIncludes;
/*
  We don't want to include babel-polyfill in our project.
    - Library authors should be using babel-runtime for non-global polyfilling
    - Adding babel-polyfill/-runtime increases bundle size significantly

  We will include our polyfill instance methods as regular functions.
*/

function startsWith(str, searchString, position) {
  cov_24vn3a78n4.f[0]++;
  cov_24vn3a78n4.s[0]++;

  return str.substr((cov_24vn3a78n4.b[0][0]++, position) || (cov_24vn3a78n4.b[0][1]++, 0), searchString.length) === searchString;
}

function endsWith(str, searchString, position) {
  cov_24vn3a78n4.f[1]++;

  var index = (cov_24vn3a78n4.s[1]++, ((cov_24vn3a78n4.b[1][0]++, position) || (cov_24vn3a78n4.b[1][1]++, str.length)) - searchString.length);
  var lastIndex = (cov_24vn3a78n4.s[2]++, str.lastIndexOf(searchString, index));
  cov_24vn3a78n4.s[3]++;
  return (cov_24vn3a78n4.b[2][0]++, lastIndex !== -1) && (cov_24vn3a78n4.b[2][1]++, lastIndex === index);
}

function stringIncludes(str, searchString, position) {
  cov_24vn3a78n4.f[2]++;
  cov_24vn3a78n4.s[4]++;

  return str.indexOf(searchString, (cov_24vn3a78n4.b[3][0]++, position) || (cov_24vn3a78n4.b[3][1]++, 0)) !== -1;
}

function isRealNaN(x) {
  cov_24vn3a78n4.f[3]++;
  cov_24vn3a78n4.s[5]++;

  return (cov_24vn3a78n4.b[4][0]++, typeof x === 'number') && (cov_24vn3a78n4.b[4][1]++, isNaN(x));
}

function arrayIncludes(array, searchElement, position) {
  cov_24vn3a78n4.f[4]++;

  var len = (cov_24vn3a78n4.s[6]++, array.length);
  cov_24vn3a78n4.s[7]++;
  if (len === 0) {
      cov_24vn3a78n4.b[5][0]++;
      cov_24vn3a78n4.s[8]++;
      return false;
    } else {
    cov_24vn3a78n4.b[5][1]++;
  }var lookupIndex = (cov_24vn3a78n4.s[9]++, position | 0);
  var isNaNElement = (cov_24vn3a78n4.s[10]++, isRealNaN(searchElement));
  var searchIndex = (cov_24vn3a78n4.s[11]++, lookupIndex >= 0 ? (cov_24vn3a78n4.b[6][0]++, lookupIndex) : (cov_24vn3a78n4.b[6][1]++, len + lookupIndex));
  cov_24vn3a78n4.s[12]++;
  while (searchIndex < len) {
    var element = (cov_24vn3a78n4.s[13]++, array[searchIndex++]);
    cov_24vn3a78n4.s[14]++;
    if (element === searchElement) {
        cov_24vn3a78n4.b[7][0]++;
        cov_24vn3a78n4.s[15]++;
        return true;
      } else {
      cov_24vn3a78n4.b[7][1]++;
    }cov_24vn3a78n4.s[16]++;
    if ((cov_24vn3a78n4.b[9][0]++, isNaNElement) && (cov_24vn3a78n4.b[9][1]++, isRealNaN(element))) {
        cov_24vn3a78n4.b[8][0]++;
        cov_24vn3a78n4.s[17]++;
        return true;
      } else {
      cov_24vn3a78n4.b[8][1]++;
    }
  }

  cov_24vn3a78n4.s[18]++;
  return false;
}

},{}],2:[function(require,module,exports){
'use strict';

var cov_1xnzystgba = function () {
  var path = '/Users/chrisandrejewski/Desktop/Work/github-repos/himalaya/src/format.js',
      hash = 'ef8c4d14fa58c2bce23a58bf5d7c370846a07329',
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = '__coverage__',
      coverageData = {
    path: '/Users/chrisandrejewski/Desktop/Work/github-repos/himalaya/src/format.js',
    statementMap: {
      '0': {
        start: {
          line: 2,
          column: 14
        },
        end: {
          line: 2,
          column: 30
        }
      },
      '1': {
        start: {
          line: 3,
          column: 2
        },
        end: {
          line: 3,
          column: 30
        }
      },
      '2': {
        start: {
          line: 3,
          column: 18
        },
        end: {
          line: 3,
          column: 30
        }
      },
      '3': {
        start: {
          line: 4,
          column: 2
        },
        end: {
          line: 4,
          column: 57
        }
      },
      '4': {
        start: {
          line: 8,
          column: 14
        },
        end: {
          line: 8,
          column: 27
        }
      },
      '5': {
        start: {
          line: 9,
          column: 14
        },
        end: {
          line: 9,
          column: 28
        }
      },
      '6': {
        start: {
          line: 10,
          column: 23
        },
        end: {
          line: 10,
          column: 49
        }
      },
      '7': {
        start: {
          line: 11,
          column: 2
        },
        end: {
          line: 13,
          column: 3
        }
      },
      '8': {
        start: {
          line: 12,
          column: 4
        },
        end: {
          line: 12,
          column: 28
        }
      },
      '9': {
        start: {
          line: 14,
          column: 2
        },
        end: {
          line: 14,
          column: 12
        }
      },
      '10': {
        start: {
          line: 18,
          column: 2
        },
        end: {
          line: 32,
          column: 4
        }
      },
      '11': {
        start: {
          line: 19,
          column: 17
        },
        end: {
          line: 19,
          column: 26
        }
      },
      '12': {
        start: {
          line: 20,
          column: 23
        },
        end: {
          line: 27,
          column: 39
        }
      },
      '13': {
        start: {
          line: 28,
          column: 4
        },
        end: {
          line: 30,
          column: 5
        }
      },
      '14': {
        start: {
          line: 29,
          column: 6
        },
        end: {
          line: 29,
          column: 41
        }
      },
      '15': {
        start: {
          line: 31,
          column: 4
        },
        end: {
          line: 31,
          column: 21
        }
      },
      '16': {
        start: {
          line: 36,
          column: 2
        },
        end: {
          line: 43,
          column: 4
        }
      },
      '17': {
        start: {
          line: 37,
          column: 18
        },
        end: {
          line: 37,
          column: 50
        }
      },
      '18': {
        start: {
          line: 38,
          column: 16
        },
        end: {
          line: 38,
          column: 24
        }
      },
      '19': {
        start: {
          line: 39,
          column: 18
        },
        end: {
          line: 41,
          column: 12
        }
      },
      '20': {
        start: {
          line: 42,
          column: 4
        },
        end: {
          line: 42,
          column: 23
        }
      }
    },
    fnMap: {
      '0': {
        name: 'splitHead',
        decl: {
          start: {
            line: 1,
            column: 16
          },
          end: {
            line: 1,
            column: 25
          }
        },
        loc: {
          start: {
            line: 1,
            column: 37
          },
          end: {
            line: 5,
            column: 1
          }
        },
        line: 1
      },
      '1': {
        name: 'unquote',
        decl: {
          start: {
            line: 7,
            column: 16
          },
          end: {
            line: 7,
            column: 23
          }
        },
        loc: {
          start: {
            line: 7,
            column: 30
          },
          end: {
            line: 15,
            column: 1
          }
        },
        line: 7
      },
      '2': {
        name: 'format',
        decl: {
          start: {
            line: 17,
            column: 16
          },
          end: {
            line: 17,
            column: 22
          }
        },
        loc: {
          start: {
            line: 17,
            column: 40
          },
          end: {
            line: 33,
            column: 1
          }
        },
        line: 17
      },
      '3': {
        name: '(anonymous_3)',
        decl: {
          start: {
            line: 18,
            column: 19
          },
          end: {
            line: 18,
            column: 20
          }
        },
        loc: {
          start: {
            line: 18,
            column: 27
          },
          end: {
            line: 32,
            column: 3
          }
        },
        line: 18
      },
      '4': {
        name: 'formatAttributes',
        decl: {
          start: {
            line: 35,
            column: 16
          },
          end: {
            line: 35,
            column: 32
          }
        },
        loc: {
          start: {
            line: 35,
            column: 46
          },
          end: {
            line: 44,
            column: 1
          }
        },
        line: 35
      },
      '5': {
        name: '(anonymous_5)',
        decl: {
          start: {
            line: 36,
            column: 24
          },
          end: {
            line: 36,
            column: 25
          }
        },
        loc: {
          start: {
            line: 36,
            column: 37
          },
          end: {
            line: 43,
            column: 3
          }
        },
        line: 36
      }
    },
    branchMap: {
      '0': {
        loc: {
          start: {
            line: 3,
            column: 2
          },
          end: {
            line: 3,
            column: 30
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 3,
            column: 2
          },
          end: {
            line: 3,
            column: 30
          }
        }, {
          start: {
            line: 3,
            column: 2
          },
          end: {
            line: 3,
            column: 30
          }
        }],
        line: 3
      },
      '1': {
        loc: {
          start: {
            line: 10,
            column: 23
          },
          end: {
            line: 10,
            column: 49
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 10,
            column: 23
          },
          end: {
            line: 10,
            column: 34
          }
        }, {
          start: {
            line: 10,
            column: 38
          },
          end: {
            line: 10,
            column: 49
          }
        }],
        line: 10
      },
      '2': {
        loc: {
          start: {
            line: 11,
            column: 2
          },
          end: {
            line: 13,
            column: 3
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 11,
            column: 2
          },
          end: {
            line: 13,
            column: 3
          }
        }, {
          start: {
            line: 11,
            column: 2
          },
          end: {
            line: 13,
            column: 3
          }
        }],
        line: 11
      },
      '3': {
        loc: {
          start: {
            line: 11,
            column: 6
          },
          end: {
            line: 11,
            column: 45
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 11,
            column: 6
          },
          end: {
            line: 11,
            column: 18
          }
        }, {
          start: {
            line: 11,
            column: 22
          },
          end: {
            line: 11,
            column: 45
          }
        }],
        line: 11
      },
      '4': {
        loc: {
          start: {
            line: 20,
            column: 23
          },
          end: {
            line: 27,
            column: 39
          }
        },
        type: 'cond-expr',
        locations: [{
          start: {
            line: 21,
            column: 8
          },
          end: {
            line: 26,
            column: 7
          }
        }, {
          start: {
            line: 27,
            column: 8
          },
          end: {
            line: 27,
            column: 39
          }
        }],
        line: 20
      },
      '5': {
        loc: {
          start: {
            line: 28,
            column: 4
          },
          end: {
            line: 30,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 28,
            column: 4
          },
          end: {
            line: 30,
            column: 5
          }
        }, {
          start: {
            line: 28,
            column: 4
          },
          end: {
            line: 30,
            column: 5
          }
        }],
        line: 28
      },
      '6': {
        loc: {
          start: {
            line: 39,
            column: 18
          },
          end: {
            line: 41,
            column: 12
          }
        },
        type: 'cond-expr',
        locations: [{
          start: {
            line: 40,
            column: 8
          },
          end: {
            line: 40,
            column: 25
          }
        }, {
          start: {
            line: 41,
            column: 8
          },
          end: {
            line: 41,
            column: 12
          }
        }],
        line: 39
      }
    },
    s: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
      '10': 0,
      '11': 0,
      '12': 0,
      '13': 0,
      '14': 0,
      '15': 0,
      '16': 0,
      '17': 0,
      '18': 0,
      '19': 0,
      '20': 0
    },
    f: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0
    },
    b: {
      '0': [0, 0],
      '1': [0, 0],
      '2': [0, 0],
      '3': [0, 0],
      '4': [0, 0],
      '5': [0, 0],
      '6': [0, 0]
    },
    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitHead = splitHead;
exports.unquote = unquote;
exports.format = format;
exports.formatAttributes = formatAttributes;
function splitHead(str, sep) {
  cov_1xnzystgba.f[0]++;

  var idx = (cov_1xnzystgba.s[0]++, str.indexOf(sep));
  cov_1xnzystgba.s[1]++;
  if (idx === -1) {
      cov_1xnzystgba.b[0][0]++;
      cov_1xnzystgba.s[2]++;
      return [str];
    } else {
    cov_1xnzystgba.b[0][1]++;
  }cov_1xnzystgba.s[3]++;
  return [str.slice(0, idx), str.slice(idx + sep.length)];
}

function unquote(str) {
  cov_1xnzystgba.f[1]++;

  var car = (cov_1xnzystgba.s[4]++, str.charAt(0));
  var end = (cov_1xnzystgba.s[5]++, str.length - 1);
  var isQuoteStart = (cov_1xnzystgba.s[6]++, (cov_1xnzystgba.b[1][0]++, car === '"') || (cov_1xnzystgba.b[1][1]++, car === "'"));
  cov_1xnzystgba.s[7]++;
  if ((cov_1xnzystgba.b[3][0]++, isQuoteStart) && (cov_1xnzystgba.b[3][1]++, car === str.charAt(end))) {
    cov_1xnzystgba.b[2][0]++;
    cov_1xnzystgba.s[8]++;

    return str.slice(1, end);
  } else {
    cov_1xnzystgba.b[2][1]++;
  }
  cov_1xnzystgba.s[9]++;
  return str;
}

function format(nodes, options) {
  cov_1xnzystgba.f[2]++;
  cov_1xnzystgba.s[10]++;

  return nodes.map(function (node) {
    cov_1xnzystgba.f[3]++;

    var type = (cov_1xnzystgba.s[11]++, node.type);
    var outputNode = (cov_1xnzystgba.s[12]++, type === 'element' ? (cov_1xnzystgba.b[4][0]++, {
      type: type,
      tagName: node.tagName.toLowerCase(),
      attributes: formatAttributes(node.attributes),
      children: format(node.children, options)
    }) : (cov_1xnzystgba.b[4][1]++, { type: type, content: node.content }));
    cov_1xnzystgba.s[13]++;
    if (options.includePositions) {
      cov_1xnzystgba.b[5][0]++;
      cov_1xnzystgba.s[14]++;

      outputNode.position = node.position;
    } else {
      cov_1xnzystgba.b[5][1]++;
    }
    cov_1xnzystgba.s[15]++;
    return outputNode;
  });
}

function formatAttributes(attributes) {
  cov_1xnzystgba.f[4]++;
  cov_1xnzystgba.s[16]++;

  return attributes.map(function (attribute) {
    cov_1xnzystgba.f[5]++;

    var parts = (cov_1xnzystgba.s[17]++, splitHead(attribute.trim(), '='));
    var key = (cov_1xnzystgba.s[18]++, parts[0]);
    var value = (cov_1xnzystgba.s[19]++, typeof parts[1] === 'string' ? (cov_1xnzystgba.b[6][0]++, unquote(parts[1])) : (cov_1xnzystgba.b[6][1]++, null));
    cov_1xnzystgba.s[20]++;
    return { key: key, value: value };
  });
}

},{}],3:[function(require,module,exports){
'use strict';

var cov_1drn7jthmy = function () {
  var path = '/Users/chrisandrejewski/Desktop/Work/github-repos/himalaya/src/index.js',
      hash = 'a91ca68b6320b199fa63e4cbd37dce6857e0c43d',
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = '__coverage__',
      coverageData = {
    path: '/Users/chrisandrejewski/Desktop/Work/github-repos/himalaya/src/index.js',
    statementMap: {
      '0': {
        start: {
          line: 12,
          column: 29
        },
        end: {
          line: 18,
          column: 1
        }
      },
      '1': {
        start: {
          line: 21,
          column: 17
        },
        end: {
          line: 21,
          column: 36
        }
      },
      '2': {
        start: {
          line: 22,
          column: 16
        },
        end: {
          line: 22,
          column: 39
        }
      },
      '3': {
        start: {
          line: 23,
          column: 2
        },
        end: {
          line: 23,
          column: 31
        }
      },
      '4': {
        start: {
          line: 27,
          column: 2
        },
        end: {
          line: 27,
          column: 29
        }
      }
    },
    fnMap: {
      '0': {
        name: 'parse',
        decl: {
          start: {
            line: 20,
            column: 16
          },
          end: {
            line: 20,
            column: 21
          }
        },
        loc: {
          start: {
            line: 20,
            column: 53
          },
          end: {
            line: 24,
            column: 1
          }
        },
        line: 20
      },
      '1': {
        name: 'stringify',
        decl: {
          start: {
            line: 26,
            column: 16
          },
          end: {
            line: 26,
            column: 25
          }
        },
        loc: {
          start: {
            line: 26,
            column: 57
          },
          end: {
            line: 28,
            column: 1
          }
        },
        line: 26
      }
    },
    branchMap: {
      '0': {
        loc: {
          start: {
            line: 20,
            column: 28
          },
          end: {
            line: 20,
            column: 51
          }
        },
        type: 'default-arg',
        locations: [{
          start: {
            line: 20,
            column: 38
          },
          end: {
            line: 20,
            column: 51
          }
        }],
        line: 20
      },
      '1': {
        loc: {
          start: {
            line: 26,
            column: 32
          },
          end: {
            line: 26,
            column: 55
          }
        },
        type: 'default-arg',
        locations: [{
          start: {
            line: 26,
            column: 42
          },
          end: {
            line: 26,
            column: 55
          }
        }],
        line: 26
      }
    },
    s: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0
    },
    f: {
      '0': 0,
      '1': 0
    },
    b: {
      '0': [0],
      '1': [0]
    },
    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDefaults = undefined;
exports.parse = parse;
exports.stringify = stringify;

var _lexer = require('./lexer');

var _lexer2 = _interopRequireDefault(_lexer);

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _format = require('./format');

var _stringify = require('./stringify');

var _tags = require('./tags');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseDefaults = exports.parseDefaults = (cov_1drn7jthmy.s[0]++, {
  voidTags: _tags.voidTags,
  closingTags: _tags.closingTags,
  childlessTags: _tags.childlessTags,
  closingTagAncestorBreakers: _tags.closingTagAncestorBreakers,
  includePositions: false
});

function parse(str) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (cov_1drn7jthmy.b[0][0]++, parseDefaults);
  cov_1drn7jthmy.f[0]++;

  var tokens = (cov_1drn7jthmy.s[1]++, (0, _lexer2.default)(str, options));
  var nodes = (cov_1drn7jthmy.s[2]++, (0, _parser2.default)(tokens, options));
  cov_1drn7jthmy.s[3]++;
  return (0, _format.format)(nodes, options);
}

function stringify(ast) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (cov_1drn7jthmy.b[1][0]++, parseDefaults);
  cov_1drn7jthmy.f[1]++;
  cov_1drn7jthmy.s[4]++;

  return (0, _stringify.toHTML)(ast, options);
}

},{"./format":2,"./lexer":4,"./parser":5,"./stringify":6,"./tags":7}],4:[function(require,module,exports){
'use strict';

var cov_1mknr9mehe = function () {
  var path = '/Users/chrisandrejewski/Desktop/Work/github-repos/himalaya/src/lexer.js',
      hash = '99f1269b85a36e02e6fcfa2eb5c9423a8a428848',
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = '__coverage__',
      coverageData = {
    path: '/Users/chrisandrejewski/Desktop/Work/github-repos/himalaya/src/lexer.js',
    statementMap: {
      '0': {
        start: {
          line: 9,
          column: 16
        },
        end: {
          line: 9,
          column: 30
        }
      },
      '1': {
        start: {
          line: 10,
          column: 14
        },
        end: {
          line: 10,
          column: 42
        }
      },
      '2': {
        start: {
          line: 11,
          column: 2
        },
        end: {
          line: 19,
          column: 3
        }
      },
      '3': {
        start: {
          line: 12,
          column: 17
        },
        end: {
          line: 12,
          column: 30
        }
      },
      '4': {
        start: {
          line: 13,
          column: 4
        },
        end: {
          line: 18,
          column: 5
        }
      },
      '5': {
        start: {
          line: 14,
          column: 6
        },
        end: {
          line: 14,
          column: 21
        }
      },
      '6': {
        start: {
          line: 15,
          column: 6
        },
        end: {
          line: 15,
          column: 25
        }
      },
      '7': {
        start: {
          line: 17,
          column: 6
        },
        end: {
          line: 17,
          column: 23
        }
      },
      '8': {
        start: {
          line: 23,
          column: 14
        },
        end: {
          line: 23,
          column: 34
        }
      },
      '9': {
        start: {
          line: 24,
          column: 2
        },
        end: {
          line: 24,
          column: 41
        }
      },
      '10': {
        start: {
          line: 28,
          column: 2
        },
        end: {
          line: 32,
          column: 3
        }
      },
      '11': {
        start: {
          line: 36,
          column: 2
        },
        end: {
          line: 40,
          column: 3
        }
      },
      '12': {
        start: {
          line: 44,
          column: 16
        },
        end: {
          line: 49,
          column: 3
        }
      },
      '13': {
        start: {
          line: 50,
          column: 2
        },
        end: {
          line: 50,
          column: 12
        }
      },
      '14': {
        start: {
          line: 51,
          column: 2
        },
        end: {
          line: 51,
          column: 21
        }
      },
      '15': {
        start: {
          line: 55,
          column: 42
        },
        end: {
          line: 55,
          column: 47
        }
      },
      '16': {
        start: {
          line: 56,
          column: 14
        },
        end: {
          line: 56,
          column: 24
        }
      },
      '17': {
        start: {
          line: 57,
          column: 2
        },
        end: {
          line: 72,
          column: 3
        }
      },
      '18': {
        start: {
          line: 58,
          column: 18
        },
        end: {
          line: 58,
          column: 38
        }
      },
      '19': {
        start: {
          line: 59,
          column: 4
        },
        end: {
          line: 59,
          column: 18
        }
      },
      '20': {
        start: {
          line: 60,
          column: 4
        },
        end: {
          line: 71,
          column: 5
        }
      },
      '21': {
        start: {
          line: 61,
          column: 24
        },
        end: {
          line: 61,
          column: 57
        }
      },
      '22': {
        start: {
          line: 62,
          column: 6
        },
        end: {
          line: 70,
          column: 7
        }
      },
      '23': {
        start: {
          line: 63,
          column: 8
        },
        end: {
          line: 63,
          column: 25
        }
      },
      '24': {
        start: {
          line: 65,
          column: 24
        },
        end: {
          line: 65,
          column: 37
        }
      },
      '25': {
        start: {
          line: 66,
          column: 24
        },
        end: {
          line: 66,
          column: 45
        }
      },
      '26': {
        start: {
          line: 67,
          column: 8
        },
        end: {
          line: 69,
          column: 9
        }
      },
      '27': {
        start: {
          line: 68,
          column: 10
        },
        end: {
          line: 68,
          column: 36
        }
      },
      '28': {
        start: {
          line: 75,
          column: 21
        },
        end: {
          line: 75,
          column: 34
        }
      },
      '29': {
        start: {
          line: 77,
          column: 2
        },
        end: {
          line: 87,
          column: 3
        }
      },
      '30': {
        start: {
          line: 78,
          column: 20
        },
        end: {
          line: 78,
          column: 43
        }
      },
      '31': {
        start: {
          line: 79,
          column: 4
        },
        end: {
          line: 81,
          column: 5
        }
      },
      '32': {
        start: {
          line: 80,
          column: 6
        },
        end: {
          line: 80,
          column: 20
        }
      },
      '33': {
        start: {
          line: 82,
          column: 17
        },
        end: {
          line: 82,
          column: 40
        }
      },
      '34': {
        start: {
          line: 83,
          column: 4
        },
        end: {
          line: 85,
          column: 5
        }
      },
      '35': {
        start: {
          line: 84,
          column: 6
        },
        end: {
          line: 84,
          column: 20
        }
      },
      '36': {
        start: {
          line: 86,
          column: 4
        },
        end: {
          line: 86,
          column: 23
        }
      },
      '37': {
        start: {
          line: 91,
          column: 15
        },
        end: {
          line: 91,
          column: 21
        }
      },
      '38': {
        start: {
          line: 92,
          column: 26
        },
        end: {
          line: 92,
          column: 31
        }
      },
      '39': {
        start: {
          line: 93,
          column: 16
        },
        end: {
          line: 93,
          column: 48
        }
      },
      '40': {
        start: {
          line: 94,
          column: 2
        },
        end: {
          line: 94,
          column: 40
        }
      },
      '41': {
        start: {
          line: 94,
          column: 34
        },
        end: {
          line: 94,
          column: 40
        }
      },
      '42': {
        start: {
          line: 95,
          column: 2
        },
        end: {
          line: 97,
          column: 3
        }
      },
      '43': {
        start: {
          line: 96,
          column: 4
        },
        end: {
          line: 96,
          column: 24
        }
      },
      '44': {
        start: {
          line: 99,
          column: 16
        },
        end: {
          line: 99,
          column: 38
        }
      },
      '45': {
        start: {
          line: 100,
          column: 18
        },
        end: {
          line: 100,
          column: 52
        }
      },
      '46': {
        start: {
          line: 101,
          column: 2
        },
        end: {
          line: 101,
          column: 38
        }
      },
      '47': {
        start: {
          line: 102,
          column: 14
        },
        end: {
          line: 102,
          column: 36
        }
      },
      '48': {
        start: {
          line: 103,
          column: 2
        },
        end: {
          line: 103,
          column: 60
        }
      },
      '49': {
        start: {
          line: 107,
          column: 26
        },
        end: {
          line: 107,
          column: 31
        }
      },
      '50': {
        start: {
          line: 108,
          column: 16
        },
        end: {
          line: 108,
          column: 38
        }
      },
      '51': {
        start: {
          line: 109,
          column: 2
        },
        end: {
          line: 109,
          column: 32
        }
      },
      '52': {
        start: {
          line: 110,
          column: 19
        },
        end: {
          line: 110,
          column: 53
        }
      },
      '53': {
        start: {
          line: 111,
          column: 19
        },
        end: {
          line: 111,
          column: 33
        }
      },
      '54': {
        start: {
          line: 112,
          column: 2
        },
        end: {
          line: 114,
          column: 3
        }
      },
      '55': {
        start: {
          line: 113,
          column: 4
        },
        end: {
          line: 113,
          column: 40
        }
      },
      '56': {
        start: {
          line: 116,
          column: 18
        },
        end: {
          line: 116,
          column: 55
        }
      },
      '57': {
        start: {
          line: 117,
          column: 2
        },
        end: {
          line: 117,
          column: 41
        }
      },
      '58': {
        start: {
          line: 118,
          column: 2
        },
        end: {
          line: 125,
          column: 4
        }
      },
      '59': {
        start: {
          line: 129,
          column: 26
        },
        end: {
          line: 129,
          column: 31
        }
      },
      '60': {
        start: {
          line: 131,
          column: 23
        },
        end: {
          line: 131,
          column: 53
        }
      },
      '61': {
        start: {
          line: 132,
          column: 18
        },
        end: {
          line: 132,
          column: 36
        }
      },
      '62': {
        start: {
          line: 133,
          column: 18
        },
        end: {
          line: 133,
          column: 40
        }
      },
      '63': {
        start: {
          line: 134,
          column: 4
        },
        end: {
          line: 134,
          column: 46
        }
      },
      '64': {
        start: {
          line: 135,
          column: 4
        },
        end: {
          line: 135,
          column: 68
        }
      },
      '65': {
        start: {
          line: 137,
          column: 18
        },
        end: {
          line: 137,
          column: 35
        }
      },
      '66': {
        start: {
          line: 138,
          column: 2
        },
        end: {
          line: 138,
          column: 25
        }
      },
      '67': {
        start: {
          line: 140,
          column: 22
        },
        end: {
          line: 140,
          column: 48
        }
      },
      '68': {
        start: {
          line: 141,
          column: 18
        },
        end: {
          line: 141,
          column: 35
        }
      },
      '69': {
        start: {
          line: 142,
          column: 4
        },
        end: {
          line: 142,
          column: 46
        }
      },
      '70': {
        start: {
          line: 143,
          column: 16
        },
        end: {
          line: 143,
          column: 38
        }
      },
      '71': {
        start: {
          line: 144,
          column: 4
        },
        end: {
          line: 144,
          column: 64
        }
      },
      '72': {
        start: {
          line: 146,
          column: 2
        },
        end: {
          line: 146,
          column: 16
        }
      },
      '73': {
        start: {
          line: 150,
          column: 19
        },
        end: {
          line: 150,
          column: 23
        }
      },
      '74': {
        start: {
          line: 152,
          column: 2
        },
        end: {
          line: 152,
          column: 30
        }
      },
      '75': {
        start: {
          line: 156,
          column: 26
        },
        end: {
          line: 156,
          column: 31
        }
      },
      '76': {
        start: {
          line: 157,
          column: 14
        },
        end: {
          line: 157,
          column: 24
        }
      },
      '77': {
        start: {
          line: 158,
          column: 14
        },
        end: {
          line: 158,
          column: 28
        }
      },
      '78': {
        start: {
          line: 159,
          column: 2
        },
        end: {
          line: 164,
          column: 3
        }
      },
      '79': {
        start: {
          line: 160,
          column: 17
        },
        end: {
          line: 160,
          column: 34
        }
      },
      '80': {
        start: {
          line: 161,
          column: 22
        },
        end: {
          line: 161,
          column: 79
        }
      },
      '81': {
        start: {
          line: 162,
          column: 4
        },
        end: {
          line: 162,
          column: 24
        }
      },
      '82': {
        start: {
          line: 162,
          column: 19
        },
        end: {
          line: 162,
          column: 24
        }
      },
      '83': {
        start: {
          line: 163,
          column: 4
        },
        end: {
          line: 163,
          column: 11
        }
      },
      '84': {
        start: {
          line: 166,
          column: 12
        },
        end: {
          line: 166,
          column: 21
        }
      },
      '85': {
        start: {
          line: 167,
          column: 2
        },
        end: {
          line: 172,
          column: 3
        }
      },
      '86': {
        start: {
          line: 168,
          column: 17
        },
        end: {
          line: 168,
          column: 32
        }
      },
      '87': {
        start: {
          line: 169,
          column: 22
        },
        end: {
          line: 169,
          column: 79
        }
      },
      '88': {
        start: {
          line: 170,
          column: 4
        },
        end: {
          line: 170,
          column: 25
        }
      },
      '89': {
        start: {
          line: 170,
          column: 20
        },
        end: {
          line: 170,
          column: 25
        }
      },
      '90': {
        start: {
          line: 171,
          column: 4
        },
        end: {
          line: 171,
          column: 9
        }
      },
      '91': {
        start: {
          line: 174,
          column: 2
        },
        end: {
          line: 174,
          column: 34
        }
      },
      '92': {
        start: {
          line: 175,
          column: 18
        },
        end: {
          line: 175,
          column: 39
        }
      },
      '93': {
        start: {
          line: 176,
          column: 2
        },
        end: {
          line: 179,
          column: 4
        }
      },
      '94': {
        start: {
          line: 180,
          column: 2
        },
        end: {
          line: 180,
          column: 16
        }
      },
      '95': {
        start: {
          line: 184,
          column: 34
        },
        end: {
          line: 184,
          column: 39
        }
      },
      '96': {
        start: {
          line: 185,
          column: 15
        },
        end: {
          line: 185,
          column: 29
        }
      },
      '97': {
        start: {
          line: 186,
          column: 14
        },
        end: {
          line: 186,
          column: 18
        }
      },
      '98': {
        start: {
          line: 187,
          column: 18
        },
        end: {
          line: 187,
          column: 24
        }
      },
      '99': {
        start: {
          line: 188,
          column: 16
        },
        end: {
          line: 188,
          column: 18
        }
      },
      '100': {
        start: {
          line: 189,
          column: 14
        },
        end: {
          line: 189,
          column: 24
        }
      },
      '101': {
        start: {
          line: 190,
          column: 2
        },
        end: {
          line: 227,
          column: 3
        }
      },
      '102': {
        start: {
          line: 191,
          column: 17
        },
        end: {
          line: 191,
          column: 35
        }
      },
      '103': {
        start: {
          line: 192,
          column: 4
        },
        end: {
          line: 199,
          column: 5
        }
      },
      '104': {
        start: {
          line: 193,
          column: 25
        },
        end: {
          line: 193,
          column: 39
        }
      },
      '105': {
        start: {
          line: 194,
          column: 6
        },
        end: {
          line: 196,
          column: 7
        }
      },
      '106': {
        start: {
          line: 195,
          column: 8
        },
        end: {
          line: 195,
          column: 20
        }
      },
      '107': {
        start: {
          line: 197,
          column: 6
        },
        end: {
          line: 197,
          column: 14
        }
      },
      '108': {
        start: {
          line: 198,
          column: 6
        },
        end: {
          line: 198,
          column: 14
        }
      },
      '109': {
        start: {
          line: 201,
          column: 21
        },
        end: {
          line: 201,
          column: 49
        }
      },
      '110': {
        start: {
          line: 202,
          column: 4
        },
        end: {
          line: 207,
          column: 5
        }
      },
      '111': {
        start: {
          line: 203,
          column: 6
        },
        end: {
          line: 205,
          column: 7
        }
      },
      '112': {
        start: {
          line: 204,
          column: 8
        },
        end: {
          line: 204,
          column: 48
        }
      },
      '113': {
        start: {
          line: 206,
          column: 6
        },
        end: {
          line: 206,
          column: 11
        }
      },
      '114': {
        start: {
          line: 209,
          column: 22
        },
        end: {
          line: 209,
          column: 44
        }
      },
      '115': {
        start: {
          line: 210,
          column: 4
        },
        end: {
          line: 217,
          column: 5
        }
      },
      '116': {
        start: {
          line: 211,
          column: 6
        },
        end: {
          line: 213,
          column: 7
        }
      },
      '117': {
        start: {
          line: 212,
          column: 8
        },
        end: {
          line: 212,
          column: 48
        }
      },
      '118': {
        start: {
          line: 214,
          column: 6
        },
        end: {
          line: 214,
          column: 28
        }
      },
      '119': {
        start: {
          line: 215,
          column: 6
        },
        end: {
          line: 215,
          column: 14
        }
      },
      '120': {
        start: {
          line: 216,
          column: 6
        },
        end: {
          line: 216,
          column: 14
        }
      },
      '121': {
        start: {
          line: 219,
          column: 25
        },
        end: {
          line: 219,
          column: 54
        }
      },
      '122': {
        start: {
          line: 220,
          column: 4
        },
        end: {
          line: 224,
          column: 5
        }
      },
      '123': {
        start: {
          line: 221,
          column: 6
        },
        end: {
          line: 221,
          column: 18
        }
      },
      '124': {
        start: {
          line: 222,
          column: 6
        },
        end: {
          line: 222,
          column: 14
        }
      },
      '125': {
        start: {
          line: 223,
          column: 6
        },
        end: {
          line: 223,
          column: 14
        }
      },
      '126': {
        start: {
          line: 226,
          column: 4
        },
        end: {
          line: 226,
          column: 12
        }
      },
      '127': {
        start: {
          line: 228,
          column: 2
        },
        end: {
          line: 228,
          column: 37
        }
      },
      '128': {
        start: {
          line: 230,
          column: 15
        },
        end: {
          line: 230,
          column: 27
        }
      },
      '129': {
        start: {
          line: 231,
          column: 15
        },
        end: {
          line: 231,
          column: 26
        }
      },
      '130': {
        start: {
          line: 232,
          column: 2
        },
        end: {
          line: 269,
          column: 3
        }
      },
      '131': {
        start: {
          line: 233,
          column: 17
        },
        end: {
          line: 233,
          column: 25
        }
      },
      '132': {
        start: {
          line: 234,
          column: 22
        },
        end: {
          line: 234,
          column: 46
        }
      },
      '133': {
        start: {
          line: 235,
          column: 4
        },
        end: {
          line: 253,
          column: 5
        }
      },
      '134': {
        start: {
          line: 236,
          column: 25
        },
        end: {
          line: 236,
          column: 37
        }
      },
      '135': {
        start: {
          line: 237,
          column: 6
        },
        end: {
          line: 252,
          column: 7
        }
      },
      '136': {
        start: {
          line: 238,
          column: 8
        },
        end: {
          line: 243,
          column: 9
        }
      },
      '137': {
        start: {
          line: 239,
          column: 26
        },
        end: {
          line: 239,
          column: 43
        }
      },
      '138': {
        start: {
          line: 240,
          column: 10
        },
        end: {
          line: 240,
          column: 47
        }
      },
      '139': {
        start: {
          line: 241,
          column: 10
        },
        end: {
          line: 241,
          column: 16
        }
      },
      '140': {
        start: {
          line: 242,
          column: 10
        },
        end: {
          line: 242,
          column: 18
        }
      },
      '141': {
        start: {
          line: 244,
          column: 26
        },
        end: {
          line: 244,
          column: 38
        }
      },
      '142': {
        start: {
          line: 245,
          column: 8
        },
        end: {
          line: 245,
          column: 14
        }
      },
      '143': {
        start: {
          line: 246,
          column: 8
        },
        end: {
          line: 251,
          column: 9
        }
      },
      '144': {
        start: {
          line: 247,
          column: 26
        },
        end: {
          line: 247,
          column: 48
        }
      },
      '145': {
        start: {
          line: 248,
          column: 10
        },
        end: {
          line: 248,
          column: 47
        }
      },
      '146': {
        start: {
          line: 249,
          column: 10
        },
        end: {
          line: 249,
          column: 16
        }
      },
      '147': {
        start: {
          line: 250,
          column: 10
        },
        end: {
          line: 250,
          column: 18
        }
      },
      '148': {
        start: {
          line: 254,
          column: 4
        },
        end: {
          line: 266,
          column: 5
        }
      },
      '149': {
        start: {
          line: 255,
          column: 25
        },
        end: {
          line: 255,
          column: 37
        }
      },
      '150': {
        start: {
          line: 256,
          column: 6
        },
        end: {
          line: 261,
          column: 7
        }
      },
      '151': {
        start: {
          line: 257,
          column: 24
        },
        end: {
          line: 257,
          column: 41
        }
      },
      '152': {
        start: {
          line: 258,
          column: 8
        },
        end: {
          line: 258,
          column: 45
        }
      },
      '153': {
        start: {
          line: 259,
          column: 8
        },
        end: {
          line: 259,
          column: 14
        }
      },
      '154': {
        start: {
          line: 260,
          column: 8
        },
        end: {
          line: 260,
          column: 16
        }
      },
      '155': {
        start: {
          line: 263,
          column: 22
        },
        end: {
          line: 263,
          column: 39
        }
      },
      '156': {
        start: {
          line: 264,
          column: 6
        },
        end: {
          line: 264,
          column: 43
        }
      },
      '157': {
        start: {
          line: 265,
          column: 6
        },
        end: {
          line: 265,
          column: 14
        }
      },
      '158': {
        start: {
          line: 268,
          column: 4
        },
        end: {
          line: 268,
          column: 38
        }
      },
      '159': {
        start: {
          line: 272,
          column: 13
        },
        end: {
          line: 272,
          column: 20
        }
      },
      '160': {
        start: {
          line: 275,
          column: 34
        },
        end: {
          line: 275,
          column: 39
        }
      },
      '161': {
        start: {
          line: 276,
          column: 22
        },
        end: {
          line: 276,
          column: 43
        }
      },
      '162': {
        start: {
          line: 277,
          column: 14
        },
        end: {
          line: 277,
          column: 24
        }
      },
      '163': {
        start: {
          line: 278,
          column: 14
        },
        end: {
          line: 278,
          column: 28
        }
      },
      '164': {
        start: {
          line: 279,
          column: 2
        },
        end: {
          line: 311,
          column: 3
        }
      },
      '165': {
        start: {
          line: 280,
          column: 20
        },
        end: {
          line: 280,
          column: 44
        }
      },
      '166': {
        start: {
          line: 281,
          column: 4
        },
        end: {
          line: 284,
          column: 5
        }
      },
      '167': {
        start: {
          line: 282,
          column: 6
        },
        end: {
          line: 282,
          column: 20
        }
      },
      '168': {
        start: {
          line: 283,
          column: 6
        },
        end: {
          line: 283,
          column: 11
        }
      },
      '169': {
        start: {
          line: 286,
          column: 29
        },
        end: {
          line: 286,
          column: 51
        }
      },
      '170': {
        start: {
          line: 287,
          column: 4
        },
        end: {
          line: 287,
          column: 48
        }
      },
      '171': {
        start: {
          line: 288,
          column: 21
        },
        end: {
          line: 288,
          column: 66
        }
      },
      '172': {
        start: {
          line: 289,
          column: 17
        },
        end: {
          line: 289,
          column: 33
        }
      },
      '173': {
        start: {
          line: 290,
          column: 4
        },
        end: {
          line: 293,
          column: 5
        }
      },
      '174': {
        start: {
          line: 291,
          column: 6
        },
        end: {
          line: 291,
          column: 37
        }
      },
      '175': {
        start: {
          line: 292,
          column: 6
        },
        end: {
          line: 292,
          column: 14
        }
      },
      '176': {
        start: {
          line: 295,
          column: 4
        },
        end: {
          line: 306,
          column: 5
        }
      },
      '177': {
        start: {
          line: 296,
          column: 24
        },
        end: {
          line: 296,
          column: 46
        }
      },
      '178': {
        start: {
          line: 297,
          column: 6
        },
        end: {
          line: 297,
          column: 42
        }
      },
      '179': {
        start: {
          line: 298,
          column: 6
        },
        end: {
          line: 305,
          column: 8
        }
      },
      '180': {
        start: {
          line: 308,
          column: 4
        },
        end: {
          line: 308,
          column: 39
        }
      },
      '181': {
        start: {
          line: 309,
          column: 4
        },
        end: {
          line: 309,
          column: 56
        }
      },
      '182': {
        start: {
          line: 310,
          column: 4
        },
        end: {
          line: 310,
          column: 9
        }
      }
    },
    fnMap: {
      '0': {
        name: 'feedPosition',
        decl: {
          start: {
            line: 8,
            column: 16
          },
          end: {
            line: 8,
            column: 28
          }
        },
        loc: {
          start: {
            line: 8,
            column: 50
          },
          end: {
            line: 20,
            column: 1
          }
        },
        line: 8
      },
      '1': {
        name: 'jumpPosition',
        decl: {
          start: {
            line: 22,
            column: 16
          },
          end: {
            line: 22,
            column: 28
          }
        },
        loc: {
          start: {
            line: 22,
            column: 50
          },
          end: {
            line: 25,
            column: 1
          }
        },
        line: 22
      },
      '2': {
        name: 'makeInitialPosition',
        decl: {
          start: {
            line: 27,
            column: 16
          },
          end: {
            line: 27,
            column: 35
          }
        },
        loc: {
          start: {
            line: 27,
            column: 39
          },
          end: {
            line: 33,
            column: 1
          }
        },
        line: 27
      },
      '3': {
        name: 'copyPosition',
        decl: {
          start: {
            line: 35,
            column: 16
          },
          end: {
            line: 35,
            column: 28
          }
        },
        loc: {
          start: {
            line: 35,
            column: 40
          },
          end: {
            line: 41,
            column: 1
          }
        },
        line: 35
      },
      '4': {
        name: 'lexer',
        decl: {
          start: {
            line: 43,
            column: 24
          },
          end: {
            line: 43,
            column: 29
          }
        },
        loc: {
          start: {
            line: 43,
            column: 45
          },
          end: {
            line: 52,
            column: 1
          }
        },
        line: 43
      },
      '5': {
        name: 'lex',
        decl: {
          start: {
            line: 54,
            column: 16
          },
          end: {
            line: 54,
            column: 19
          }
        },
        loc: {
          start: {
            line: 54,
            column: 28
          },
          end: {
            line: 73,
            column: 1
          }
        },
        line: 54
      },
      '6': {
        name: 'findTextEnd',
        decl: {
          start: {
            line: 76,
            column: 16
          },
          end: {
            line: 76,
            column: 27
          }
        },
        loc: {
          start: {
            line: 76,
            column: 41
          },
          end: {
            line: 88,
            column: 1
          }
        },
        line: 76
      },
      '7': {
        name: 'lexText',
        decl: {
          start: {
            line: 90,
            column: 16
          },
          end: {
            line: 90,
            column: 23
          }
        },
        loc: {
          start: {
            line: 90,
            column: 32
          },
          end: {
            line: 104,
            column: 1
          }
        },
        line: 90
      },
      '8': {
        name: 'lexComment',
        decl: {
          start: {
            line: 106,
            column: 16
          },
          end: {
            line: 106,
            column: 26
          }
        },
        loc: {
          start: {
            line: 106,
            column: 35
          },
          end: {
            line: 126,
            column: 1
          }
        },
        line: 106
      },
      '9': {
        name: 'lexTag',
        decl: {
          start: {
            line: 128,
            column: 16
          },
          end: {
            line: 128,
            column: 22
          }
        },
        loc: {
          start: {
            line: 128,
            column: 31
          },
          end: {
            line: 147,
            column: 1
          }
        },
        line: 128
      },
      '10': {
        name: 'isWhitespaceChar',
        decl: {
          start: {
            line: 151,
            column: 16
          },
          end: {
            line: 151,
            column: 32
          }
        },
        loc: {
          start: {
            line: 151,
            column: 40
          },
          end: {
            line: 153,
            column: 1
          }
        },
        line: 151
      },
      '11': {
        name: 'lexTagName',
        decl: {
          start: {
            line: 155,
            column: 16
          },
          end: {
            line: 155,
            column: 26
          }
        },
        loc: {
          start: {
            line: 155,
            column: 35
          },
          end: {
            line: 181,
            column: 1
          }
        },
        line: 155
      },
      '12': {
        name: 'lexTagAttributes',
        decl: {
          start: {
            line: 183,
            column: 16
          },
          end: {
            line: 183,
            column: 32
          }
        },
        loc: {
          start: {
            line: 183,
            column: 41
          },
          end: {
            line: 270,
            column: 1
          }
        },
        line: 183
      },
      '13': {
        name: 'lexSkipTag',
        decl: {
          start: {
            line: 274,
            column: 16
          },
          end: {
            line: 274,
            column: 26
          }
        },
        loc: {
          start: {
            line: 274,
            column: 44
          },
          end: {
            line: 312,
            column: 1
          }
        },
        line: 274
      }
    },
    branchMap: {
      '0': {
        loc: {
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 18,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 18,
            column: 5
          }
        }, {
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 18,
            column: 5
          }
        }],
        line: 13
      },
      '1': {
        loc: {
          start: {
            line: 60,
            column: 4
          },
          end: {
            line: 71,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 60,
            column: 4
          },
          end: {
            line: 71,
            column: 5
          }
        }, {
          start: {
            line: 60,
            column: 4
          },
          end: {
            line: 71,
            column: 5
          }
        }],
        line: 60
      },
      '2': {
        loc: {
          start: {
            line: 62,
            column: 6
          },
          end: {
            line: 70,
            column: 7
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 62,
            column: 6
          },
          end: {
            line: 70,
            column: 7
          }
        }, {
          start: {
            line: 62,
            column: 6
          },
          end: {
            line: 70,
            column: 7
          }
        }],
        line: 62
      },
      '3': {
        loc: {
          start: {
            line: 67,
            column: 8
          },
          end: {
            line: 69,
            column: 9
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 67,
            column: 8
          },
          end: {
            line: 69,
            column: 9
          }
        }, {
          start: {
            line: 67,
            column: 8
          },
          end: {
            line: 69,
            column: 9
          }
        }],
        line: 67
      },
      '4': {
        loc: {
          start: {
            line: 79,
            column: 4
          },
          end: {
            line: 81,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 79,
            column: 4
          },
          end: {
            line: 81,
            column: 5
          }
        }, {
          start: {
            line: 79,
            column: 4
          },
          end: {
            line: 81,
            column: 5
          }
        }],
        line: 79
      },
      '5': {
        loc: {
          start: {
            line: 83,
            column: 4
          },
          end: {
            line: 85,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 83,
            column: 4
          },
          end: {
            line: 85,
            column: 5
          }
        }, {
          start: {
            line: 83,
            column: 4
          },
          end: {
            line: 85,
            column: 5
          }
        }],
        line: 83
      },
      '6': {
        loc: {
          start: {
            line: 83,
            column: 8
          },
          end: {
            line: 83,
            column: 63
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 83,
            column: 8
          },
          end: {
            line: 83,
            column: 20
          }
        }, {
          start: {
            line: 83,
            column: 24
          },
          end: {
            line: 83,
            column: 36
          }
        }, {
          start: {
            line: 83,
            column: 40
          },
          end: {
            line: 83,
            column: 63
          }
        }],
        line: 83
      },
      '7': {
        loc: {
          start: {
            line: 94,
            column: 2
          },
          end: {
            line: 94,
            column: 40
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 94,
            column: 2
          },
          end: {
            line: 94,
            column: 40
          }
        }, {
          start: {
            line: 94,
            column: 2
          },
          end: {
            line: 94,
            column: 40
          }
        }],
        line: 94
      },
      '8': {
        loc: {
          start: {
            line: 95,
            column: 2
          },
          end: {
            line: 97,
            column: 3
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 95,
            column: 2
          },
          end: {
            line: 97,
            column: 3
          }
        }, {
          start: {
            line: 95,
            column: 2
          },
          end: {
            line: 97,
            column: 3
          }
        }],
        line: 95
      },
      '9': {
        loc: {
          start: {
            line: 112,
            column: 2
          },
          end: {
            line: 114,
            column: 3
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 112,
            column: 2
          },
          end: {
            line: 114,
            column: 3
          }
        }, {
          start: {
            line: 112,
            column: 2
          },
          end: {
            line: 114,
            column: 3
          }
        }],
        line: 112
      },
      '10': {
        loc: {
          start: {
            line: 134,
            column: 32
          },
          end: {
            line: 134,
            column: 45
          }
        },
        type: 'cond-expr',
        locations: [{
          start: {
            line: 134,
            column: 40
          },
          end: {
            line: 134,
            column: 41
          }
        }, {
          start: {
            line: 134,
            column: 44
          },
          end: {
            line: 134,
            column: 45
          }
        }],
        line: 134
      },
      '11': {
        loc: {
          start: {
            line: 142,
            column: 32
          },
          end: {
            line: 142,
            column: 45
          }
        },
        type: 'cond-expr',
        locations: [{
          start: {
            line: 142,
            column: 40
          },
          end: {
            line: 142,
            column: 41
          }
        }, {
          start: {
            line: 142,
            column: 44
          },
          end: {
            line: 142,
            column: 45
          }
        }],
        line: 142
      },
      '12': {
        loc: {
          start: {
            line: 161,
            column: 24
          },
          end: {
            line: 161,
            column: 78
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 161,
            column: 24
          },
          end: {
            line: 161,
            column: 46
          }
        }, {
          start: {
            line: 161,
            column: 50
          },
          end: {
            line: 161,
            column: 62
          }
        }, {
          start: {
            line: 161,
            column: 66
          },
          end: {
            line: 161,
            column: 78
          }
        }],
        line: 161
      },
      '13': {
        loc: {
          start: {
            line: 162,
            column: 4
          },
          end: {
            line: 162,
            column: 24
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 162,
            column: 4
          },
          end: {
            line: 162,
            column: 24
          }
        }, {
          start: {
            line: 162,
            column: 4
          },
          end: {
            line: 162,
            column: 24
          }
        }],
        line: 162
      },
      '14': {
        loc: {
          start: {
            line: 169,
            column: 24
          },
          end: {
            line: 169,
            column: 78
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 169,
            column: 24
          },
          end: {
            line: 169,
            column: 46
          }
        }, {
          start: {
            line: 169,
            column: 50
          },
          end: {
            line: 169,
            column: 62
          }
        }, {
          start: {
            line: 169,
            column: 66
          },
          end: {
            line: 169,
            column: 78
          }
        }],
        line: 169
      },
      '15': {
        loc: {
          start: {
            line: 170,
            column: 4
          },
          end: {
            line: 170,
            column: 25
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 170,
            column: 4
          },
          end: {
            line: 170,
            column: 25
          }
        }, {
          start: {
            line: 170,
            column: 4
          },
          end: {
            line: 170,
            column: 25
          }
        }],
        line: 170
      },
      '16': {
        loc: {
          start: {
            line: 192,
            column: 4
          },
          end: {
            line: 199,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 192,
            column: 4
          },
          end: {
            line: 199,
            column: 5
          }
        }, {
          start: {
            line: 192,
            column: 4
          },
          end: {
            line: 199,
            column: 5
          }
        }],
        line: 192
      },
      '17': {
        loc: {
          start: {
            line: 194,
            column: 6
          },
          end: {
            line: 196,
            column: 7
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 194,
            column: 6
          },
          end: {
            line: 196,
            column: 7
          }
        }, {
          start: {
            line: 194,
            column: 6
          },
          end: {
            line: 196,
            column: 7
          }
        }],
        line: 194
      },
      '18': {
        loc: {
          start: {
            line: 201,
            column: 21
          },
          end: {
            line: 201,
            column: 49
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 201,
            column: 21
          },
          end: {
            line: 201,
            column: 33
          }
        }, {
          start: {
            line: 201,
            column: 37
          },
          end: {
            line: 201,
            column: 49
          }
        }],
        line: 201
      },
      '19': {
        loc: {
          start: {
            line: 202,
            column: 4
          },
          end: {
            line: 207,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 202,
            column: 4
          },
          end: {
            line: 207,
            column: 5
          }
        }, {
          start: {
            line: 202,
            column: 4
          },
          end: {
            line: 207,
            column: 5
          }
        }],
        line: 202
      },
      '20': {
        loc: {
          start: {
            line: 203,
            column: 6
          },
          end: {
            line: 205,
            column: 7
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 203,
            column: 6
          },
          end: {
            line: 205,
            column: 7
          }
        }, {
          start: {
            line: 203,
            column: 6
          },
          end: {
            line: 205,
            column: 7
          }
        }],
        line: 203
      },
      '21': {
        loc: {
          start: {
            line: 210,
            column: 4
          },
          end: {
            line: 217,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 210,
            column: 4
          },
          end: {
            line: 217,
            column: 5
          }
        }, {
          start: {
            line: 210,
            column: 4
          },
          end: {
            line: 217,
            column: 5
          }
        }],
        line: 210
      },
      '22': {
        loc: {
          start: {
            line: 211,
            column: 6
          },
          end: {
            line: 213,
            column: 7
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 211,
            column: 6
          },
          end: {
            line: 213,
            column: 7
          }
        }, {
          start: {
            line: 211,
            column: 6
          },
          end: {
            line: 213,
            column: 7
          }
        }],
        line: 211
      },
      '23': {
        loc: {
          start: {
            line: 219,
            column: 25
          },
          end: {
            line: 219,
            column: 54
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 219,
            column: 25
          },
          end: {
            line: 219,
            column: 38
          }
        }, {
          start: {
            line: 219,
            column: 42
          },
          end: {
            line: 219,
            column: 54
          }
        }],
        line: 219
      },
      '24': {
        loc: {
          start: {
            line: 220,
            column: 4
          },
          end: {
            line: 224,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 220,
            column: 4
          },
          end: {
            line: 224,
            column: 5
          }
        }, {
          start: {
            line: 220,
            column: 4
          },
          end: {
            line: 224,
            column: 5
          }
        }],
        line: 220
      },
      '25': {
        loc: {
          start: {
            line: 235,
            column: 4
          },
          end: {
            line: 253,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 235,
            column: 4
          },
          end: {
            line: 253,
            column: 5
          }
        }, {
          start: {
            line: 235,
            column: 4
          },
          end: {
            line: 253,
            column: 5
          }
        }],
        line: 235
      },
      '26': {
        loc: {
          start: {
            line: 237,
            column: 6
          },
          end: {
            line: 252,
            column: 7
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 237,
            column: 6
          },
          end: {
            line: 252,
            column: 7
          }
        }, {
          start: {
            line: 237,
            column: 6
          },
          end: {
            line: 252,
            column: 7
          }
        }],
        line: 237
      },
      '27': {
        loc: {
          start: {
            line: 237,
            column: 10
          },
          end: {
            line: 237,
            column: 51
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 237,
            column: 10
          },
          end: {
            line: 237,
            column: 20
          }
        }, {
          start: {
            line: 237,
            column: 24
          },
          end: {
            line: 237,
            column: 51
          }
        }],
        line: 237
      },
      '28': {
        loc: {
          start: {
            line: 238,
            column: 8
          },
          end: {
            line: 243,
            column: 9
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 238,
            column: 8
          },
          end: {
            line: 243,
            column: 9
          }
        }, {
          start: {
            line: 238,
            column: 8
          },
          end: {
            line: 243,
            column: 9
          }
        }],
        line: 238
      },
      '29': {
        loc: {
          start: {
            line: 246,
            column: 8
          },
          end: {
            line: 251,
            column: 9
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 246,
            column: 8
          },
          end: {
            line: 251,
            column: 9
          }
        }, {
          start: {
            line: 246,
            column: 8
          },
          end: {
            line: 251,
            column: 9
          }
        }],
        line: 246
      },
      '30': {
        loc: {
          start: {
            line: 254,
            column: 4
          },
          end: {
            line: 266,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 254,
            column: 4
          },
          end: {
            line: 266,
            column: 5
          }
        }, {
          start: {
            line: 254,
            column: 4
          },
          end: {
            line: 266,
            column: 5
          }
        }],
        line: 254
      },
      '31': {
        loc: {
          start: {
            line: 256,
            column: 6
          },
          end: {
            line: 261,
            column: 7
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 256,
            column: 6
          },
          end: {
            line: 261,
            column: 7
          }
        }, {
          start: {
            line: 256,
            column: 6
          },
          end: {
            line: 261,
            column: 7
          }
        }],
        line: 256
      },
      '32': {
        loc: {
          start: {
            line: 256,
            column: 10
          },
          end: {
            line: 256,
            column: 56
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 256,
            column: 10
          },
          end: {
            line: 256,
            column: 20
          }
        }, {
          start: {
            line: 256,
            column: 24
          },
          end: {
            line: 256,
            column: 56
          }
        }],
        line: 256
      },
      '33': {
        loc: {
          start: {
            line: 281,
            column: 4
          },
          end: {
            line: 284,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 281,
            column: 4
          },
          end: {
            line: 284,
            column: 5
          }
        }, {
          start: {
            line: 281,
            column: 4
          },
          end: {
            line: 284,
            column: 5
          }
        }],
        line: 281
      },
      '34': {
        loc: {
          start: {
            line: 290,
            column: 4
          },
          end: {
            line: 293,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 290,
            column: 4
          },
          end: {
            line: 293,
            column: 5
          }
        }, {
          start: {
            line: 290,
            column: 4
          },
          end: {
            line: 293,
            column: 5
          }
        }],
        line: 290
      },
      '35': {
        loc: {
          start: {
            line: 295,
            column: 4
          },
          end: {
            line: 306,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 295,
            column: 4
          },
          end: {
            line: 306,
            column: 5
          }
        }, {
          start: {
            line: 295,
            column: 4
          },
          end: {
            line: 306,
            column: 5
          }
        }],
        line: 295
      }
    },
    s: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
      '10': 0,
      '11': 0,
      '12': 0,
      '13': 0,
      '14': 0,
      '15': 0,
      '16': 0,
      '17': 0,
      '18': 0,
      '19': 0,
      '20': 0,
      '21': 0,
      '22': 0,
      '23': 0,
      '24': 0,
      '25': 0,
      '26': 0,
      '27': 0,
      '28': 0,
      '29': 0,
      '30': 0,
      '31': 0,
      '32': 0,
      '33': 0,
      '34': 0,
      '35': 0,
      '36': 0,
      '37': 0,
      '38': 0,
      '39': 0,
      '40': 0,
      '41': 0,
      '42': 0,
      '43': 0,
      '44': 0,
      '45': 0,
      '46': 0,
      '47': 0,
      '48': 0,
      '49': 0,
      '50': 0,
      '51': 0,
      '52': 0,
      '53': 0,
      '54': 0,
      '55': 0,
      '56': 0,
      '57': 0,
      '58': 0,
      '59': 0,
      '60': 0,
      '61': 0,
      '62': 0,
      '63': 0,
      '64': 0,
      '65': 0,
      '66': 0,
      '67': 0,
      '68': 0,
      '69': 0,
      '70': 0,
      '71': 0,
      '72': 0,
      '73': 0,
      '74': 0,
      '75': 0,
      '76': 0,
      '77': 0,
      '78': 0,
      '79': 0,
      '80': 0,
      '81': 0,
      '82': 0,
      '83': 0,
      '84': 0,
      '85': 0,
      '86': 0,
      '87': 0,
      '88': 0,
      '89': 0,
      '90': 0,
      '91': 0,
      '92': 0,
      '93': 0,
      '94': 0,
      '95': 0,
      '96': 0,
      '97': 0,
      '98': 0,
      '99': 0,
      '100': 0,
      '101': 0,
      '102': 0,
      '103': 0,
      '104': 0,
      '105': 0,
      '106': 0,
      '107': 0,
      '108': 0,
      '109': 0,
      '110': 0,
      '111': 0,
      '112': 0,
      '113': 0,
      '114': 0,
      '115': 0,
      '116': 0,
      '117': 0,
      '118': 0,
      '119': 0,
      '120': 0,
      '121': 0,
      '122': 0,
      '123': 0,
      '124': 0,
      '125': 0,
      '126': 0,
      '127': 0,
      '128': 0,
      '129': 0,
      '130': 0,
      '131': 0,
      '132': 0,
      '133': 0,
      '134': 0,
      '135': 0,
      '136': 0,
      '137': 0,
      '138': 0,
      '139': 0,
      '140': 0,
      '141': 0,
      '142': 0,
      '143': 0,
      '144': 0,
      '145': 0,
      '146': 0,
      '147': 0,
      '148': 0,
      '149': 0,
      '150': 0,
      '151': 0,
      '152': 0,
      '153': 0,
      '154': 0,
      '155': 0,
      '156': 0,
      '157': 0,
      '158': 0,
      '159': 0,
      '160': 0,
      '161': 0,
      '162': 0,
      '163': 0,
      '164': 0,
      '165': 0,
      '166': 0,
      '167': 0,
      '168': 0,
      '169': 0,
      '170': 0,
      '171': 0,
      '172': 0,
      '173': 0,
      '174': 0,
      '175': 0,
      '176': 0,
      '177': 0,
      '178': 0,
      '179': 0,
      '180': 0,
      '181': 0,
      '182': 0
    },
    f: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
      '10': 0,
      '11': 0,
      '12': 0,
      '13': 0
    },
    b: {
      '0': [0, 0],
      '1': [0, 0],
      '2': [0, 0],
      '3': [0, 0],
      '4': [0, 0],
      '5': [0, 0],
      '6': [0, 0, 0],
      '7': [0, 0],
      '8': [0, 0],
      '9': [0, 0],
      '10': [0, 0],
      '11': [0, 0],
      '12': [0, 0, 0],
      '13': [0, 0],
      '14': [0, 0, 0],
      '15': [0, 0],
      '16': [0, 0],
      '17': [0, 0],
      '18': [0, 0],
      '19': [0, 0],
      '20': [0, 0],
      '21': [0, 0],
      '22': [0, 0],
      '23': [0, 0],
      '24': [0, 0],
      '25': [0, 0],
      '26': [0, 0],
      '27': [0, 0],
      '28': [0, 0],
      '29': [0, 0],
      '30': [0, 0],
      '31': [0, 0],
      '32': [0, 0],
      '33': [0, 0],
      '34': [0, 0],
      '35': [0, 0]
    },
    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.feedPosition = feedPosition;
exports.jumpPosition = jumpPosition;
exports.makeInitialPosition = makeInitialPosition;
exports.copyPosition = copyPosition;
exports.default = lexer;
exports.lex = lex;
exports.findTextEnd = findTextEnd;
exports.lexText = lexText;
exports.lexComment = lexComment;
exports.lexTag = lexTag;
exports.isWhitespaceChar = isWhitespaceChar;
exports.lexTagName = lexTagName;
exports.lexTagAttributes = lexTagAttributes;
exports.lexSkipTag = lexSkipTag;

var _compat = require('./compat');

function feedPosition(position, str, len) {
  cov_1mknr9mehe.f[0]++;

  var start = (cov_1mknr9mehe.s[0]++, position.index);
  var end = (cov_1mknr9mehe.s[1]++, position.index = start + len);
  cov_1mknr9mehe.s[2]++;
  for (var i = start; i < end; i++) {
    var char = (cov_1mknr9mehe.s[3]++, str.charAt(i));
    cov_1mknr9mehe.s[4]++;
    if (char === '\n') {
      cov_1mknr9mehe.b[0][0]++;
      cov_1mknr9mehe.s[5]++;

      position.line++;
      cov_1mknr9mehe.s[6]++;
      position.column = 0;
    } else {
      cov_1mknr9mehe.b[0][1]++;
      cov_1mknr9mehe.s[7]++;

      position.column++;
    }
  }
}

function jumpPosition(position, str, end) {
  cov_1mknr9mehe.f[1]++;

  var len = (cov_1mknr9mehe.s[8]++, end - position.index);
  cov_1mknr9mehe.s[9]++;
  return feedPosition(position, str, len);
}

function makeInitialPosition() {
  cov_1mknr9mehe.f[2]++;
  cov_1mknr9mehe.s[10]++;

  return {
    index: 0,
    column: 0,
    line: 0
  };
}

function copyPosition(position) {
  cov_1mknr9mehe.f[3]++;
  cov_1mknr9mehe.s[11]++;

  return {
    index: position.index,
    line: position.line,
    column: position.column
  };
}

function lexer(str, options) {
  cov_1mknr9mehe.f[4]++;

  var state = (cov_1mknr9mehe.s[12]++, {
    str: str,
    options: options,
    position: makeInitialPosition(),
    tokens: []
  });
  cov_1mknr9mehe.s[13]++;
  lex(state);
  cov_1mknr9mehe.s[14]++;
  return state.tokens;
}

function lex(state) {
  cov_1mknr9mehe.f[5]++;

  var _ref = (cov_1mknr9mehe.s[15]++, state),
      str = _ref.str,
      childlessTags = _ref.options.childlessTags;

  var len = (cov_1mknr9mehe.s[16]++, str.length);
  cov_1mknr9mehe.s[17]++;
  while (state.position.index < len) {
    var start = (cov_1mknr9mehe.s[18]++, state.position.index);
    cov_1mknr9mehe.s[19]++;
    lexText(state);
    cov_1mknr9mehe.s[20]++;
    if (state.position.index === start) {
      cov_1mknr9mehe.b[1][0]++;

      var isComment = (cov_1mknr9mehe.s[21]++, (0, _compat.startsWith)(str, '!--', start + 1));
      cov_1mknr9mehe.s[22]++;
      if (isComment) {
        cov_1mknr9mehe.b[2][0]++;
        cov_1mknr9mehe.s[23]++;

        lexComment(state);
      } else {
        cov_1mknr9mehe.b[2][1]++;

        var tagName = (cov_1mknr9mehe.s[24]++, lexTag(state));
        var safeTag = (cov_1mknr9mehe.s[25]++, tagName.toLowerCase());
        cov_1mknr9mehe.s[26]++;
        if ((0, _compat.arrayIncludes)(childlessTags, safeTag)) {
          cov_1mknr9mehe.b[3][0]++;
          cov_1mknr9mehe.s[27]++;

          lexSkipTag(tagName, state);
        } else {
          cov_1mknr9mehe.b[3][1]++;
        }
      }
    } else {
      cov_1mknr9mehe.b[1][1]++;
    }
  }
}

var alphanumeric = (cov_1mknr9mehe.s[28]++, /[A-Za-z0-9]/);
function findTextEnd(str, index) {
  cov_1mknr9mehe.f[6]++;
  cov_1mknr9mehe.s[29]++;

  while (true) {
    var textEnd = (cov_1mknr9mehe.s[30]++, str.indexOf('<', index));
    cov_1mknr9mehe.s[31]++;
    if (textEnd === -1) {
      cov_1mknr9mehe.b[4][0]++;
      cov_1mknr9mehe.s[32]++;

      return textEnd;
    } else {
      cov_1mknr9mehe.b[4][1]++;
    }
    var char = (cov_1mknr9mehe.s[33]++, str.charAt(textEnd + 1));
    cov_1mknr9mehe.s[34]++;
    if ((cov_1mknr9mehe.b[6][0]++, char === '/') || (cov_1mknr9mehe.b[6][1]++, char === '!') || (cov_1mknr9mehe.b[6][2]++, alphanumeric.test(char))) {
      cov_1mknr9mehe.b[5][0]++;
      cov_1mknr9mehe.s[35]++;

      return textEnd;
    } else {
      cov_1mknr9mehe.b[5][1]++;
    }
    cov_1mknr9mehe.s[36]++;
    index = textEnd + 1;
  }
}

function lexText(state) {
  cov_1mknr9mehe.f[7]++;

  var type = (cov_1mknr9mehe.s[37]++, 'text');

  var _ref2 = (cov_1mknr9mehe.s[38]++, state),
      str = _ref2.str,
      position = _ref2.position;

  var textEnd = (cov_1mknr9mehe.s[39]++, findTextEnd(str, position.index));
  cov_1mknr9mehe.s[40]++;
  if (textEnd === position.index) {
      cov_1mknr9mehe.b[7][0]++;
      cov_1mknr9mehe.s[41]++;
      return;
    } else {
    cov_1mknr9mehe.b[7][1]++;
  }cov_1mknr9mehe.s[42]++;
  if (textEnd === -1) {
    cov_1mknr9mehe.b[8][0]++;
    cov_1mknr9mehe.s[43]++;

    textEnd = str.length;
  } else {
    cov_1mknr9mehe.b[8][1]++;
  }

  var start = (cov_1mknr9mehe.s[44]++, copyPosition(position));
  var content = (cov_1mknr9mehe.s[45]++, str.slice(position.index, textEnd));
  cov_1mknr9mehe.s[46]++;
  jumpPosition(position, str, textEnd);
  var end = (cov_1mknr9mehe.s[47]++, copyPosition(position));
  cov_1mknr9mehe.s[48]++;
  state.tokens.push({ type: type, content: content, position: { start: start, end: end } });
}

function lexComment(state) {
  cov_1mknr9mehe.f[8]++;

  var _ref3 = (cov_1mknr9mehe.s[49]++, state),
      str = _ref3.str,
      position = _ref3.position;

  var start = (cov_1mknr9mehe.s[50]++, copyPosition(position));
  cov_1mknr9mehe.s[51]++;
  feedPosition(position, str, 4); // "<!--".length
  var contentEnd = (cov_1mknr9mehe.s[52]++, str.indexOf('-->', position.index));
  var commentEnd = (cov_1mknr9mehe.s[53]++, contentEnd + 3); // "-->".length
  cov_1mknr9mehe.s[54]++;
  if (contentEnd === -1) {
    cov_1mknr9mehe.b[9][0]++;
    cov_1mknr9mehe.s[55]++;

    contentEnd = commentEnd = str.length;
  } else {
    cov_1mknr9mehe.b[9][1]++;
  }

  var content = (cov_1mknr9mehe.s[56]++, str.slice(position.index, contentEnd));
  cov_1mknr9mehe.s[57]++;
  jumpPosition(position, str, commentEnd);
  cov_1mknr9mehe.s[58]++;
  state.tokens.push({
    type: 'comment',
    content: content,
    position: {
      start: start,
      end: copyPosition(position)
    }
  });
}

function lexTag(state) {
  cov_1mknr9mehe.f[9]++;

  var _ref4 = (cov_1mknr9mehe.s[59]++, state),
      str = _ref4.str,
      position = _ref4.position;

  {
    var secondChar = (cov_1mknr9mehe.s[60]++, str.charAt(position.index + 1));
    var close = (cov_1mknr9mehe.s[61]++, secondChar === '/');
    var start = (cov_1mknr9mehe.s[62]++, copyPosition(position));
    cov_1mknr9mehe.s[63]++;
    feedPosition(position, str, close ? (cov_1mknr9mehe.b[10][0]++, 2) : (cov_1mknr9mehe.b[10][1]++, 1));
    cov_1mknr9mehe.s[64]++;
    state.tokens.push({ type: 'tag-start', close: close, position: { start: start } });
  }
  var tagName = (cov_1mknr9mehe.s[65]++, lexTagName(state));
  cov_1mknr9mehe.s[66]++;
  lexTagAttributes(state);
  {
    var firstChar = (cov_1mknr9mehe.s[67]++, str.charAt(position.index));
    var _close = (cov_1mknr9mehe.s[68]++, firstChar === '/');
    cov_1mknr9mehe.s[69]++;
    feedPosition(position, str, _close ? (cov_1mknr9mehe.b[11][0]++, 2) : (cov_1mknr9mehe.b[11][1]++, 1));
    var end = (cov_1mknr9mehe.s[70]++, copyPosition(position));
    cov_1mknr9mehe.s[71]++;
    state.tokens.push({ type: 'tag-end', close: _close, position: { end: end } });
  }
  cov_1mknr9mehe.s[72]++;
  return tagName;
}

// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-white-space
var whitespace = (cov_1mknr9mehe.s[73]++, /\s/);
function isWhitespaceChar(char) {
  cov_1mknr9mehe.f[10]++;
  cov_1mknr9mehe.s[74]++;

  return whitespace.test(char);
}

function lexTagName(state) {
  cov_1mknr9mehe.f[11]++;

  var _ref5 = (cov_1mknr9mehe.s[75]++, state),
      str = _ref5.str,
      position = _ref5.position;

  var len = (cov_1mknr9mehe.s[76]++, str.length);
  var start = (cov_1mknr9mehe.s[77]++, position.index);
  cov_1mknr9mehe.s[78]++;
  while (start < len) {
    var char = (cov_1mknr9mehe.s[79]++, str.charAt(start));
    var isTagChar = (cov_1mknr9mehe.s[80]++, !((cov_1mknr9mehe.b[12][0]++, isWhitespaceChar(char)) || (cov_1mknr9mehe.b[12][1]++, char === '/') || (cov_1mknr9mehe.b[12][2]++, char === '>')));
    cov_1mknr9mehe.s[81]++;
    if (isTagChar) {
        cov_1mknr9mehe.b[13][0]++;
        cov_1mknr9mehe.s[82]++;
        break;
      } else {
      cov_1mknr9mehe.b[13][1]++;
    }cov_1mknr9mehe.s[83]++;
    start++;
  }

  var end = (cov_1mknr9mehe.s[84]++, start + 1);
  cov_1mknr9mehe.s[85]++;
  while (end < len) {
    var _char = (cov_1mknr9mehe.s[86]++, str.charAt(end));
    var _isTagChar = (cov_1mknr9mehe.s[87]++, !((cov_1mknr9mehe.b[14][0]++, isWhitespaceChar(_char)) || (cov_1mknr9mehe.b[14][1]++, _char === '/') || (cov_1mknr9mehe.b[14][2]++, _char === '>')));
    cov_1mknr9mehe.s[88]++;
    if (!_isTagChar) {
        cov_1mknr9mehe.b[15][0]++;
        cov_1mknr9mehe.s[89]++;
        break;
      } else {
      cov_1mknr9mehe.b[15][1]++;
    }cov_1mknr9mehe.s[90]++;
    end++;
  }

  cov_1mknr9mehe.s[91]++;
  jumpPosition(position, str, end);
  var tagName = (cov_1mknr9mehe.s[92]++, str.slice(start, end));
  cov_1mknr9mehe.s[93]++;
  state.tokens.push({
    type: 'tag',
    content: tagName
  });
  cov_1mknr9mehe.s[94]++;
  return tagName;
}

function lexTagAttributes(state) {
  cov_1mknr9mehe.f[12]++;

  var _ref6 = (cov_1mknr9mehe.s[95]++, state),
      str = _ref6.str,
      position = _ref6.position,
      tokens = _ref6.tokens;

  var cursor = (cov_1mknr9mehe.s[96]++, position.index);
  var quote = (cov_1mknr9mehe.s[97]++, null); // null, single-, or double-quote
  var wordBegin = (cov_1mknr9mehe.s[98]++, cursor); // index of word start
  var words = (cov_1mknr9mehe.s[99]++, []); // "key", "key=value", "key='value'", etc
  var len = (cov_1mknr9mehe.s[100]++, str.length);
  cov_1mknr9mehe.s[101]++;
  while (cursor < len) {
    var char = (cov_1mknr9mehe.s[102]++, str.charAt(cursor));
    cov_1mknr9mehe.s[103]++;
    if (quote) {
      cov_1mknr9mehe.b[16][0]++;

      var isQuoteEnd = (cov_1mknr9mehe.s[104]++, char === quote);
      cov_1mknr9mehe.s[105]++;
      if (isQuoteEnd) {
        cov_1mknr9mehe.b[17][0]++;
        cov_1mknr9mehe.s[106]++;

        quote = null;
      } else {
        cov_1mknr9mehe.b[17][1]++;
      }
      cov_1mknr9mehe.s[107]++;
      cursor++;
      cov_1mknr9mehe.s[108]++;
      continue;
    } else {
      cov_1mknr9mehe.b[16][1]++;
    }

    var isTagEnd = (cov_1mknr9mehe.s[109]++, (cov_1mknr9mehe.b[18][0]++, char === '/') || (cov_1mknr9mehe.b[18][1]++, char === '>'));
    cov_1mknr9mehe.s[110]++;
    if (isTagEnd) {
      cov_1mknr9mehe.b[19][0]++;
      cov_1mknr9mehe.s[111]++;

      if (cursor !== wordBegin) {
        cov_1mknr9mehe.b[20][0]++;
        cov_1mknr9mehe.s[112]++;

        words.push(str.slice(wordBegin, cursor));
      } else {
        cov_1mknr9mehe.b[20][1]++;
      }
      cov_1mknr9mehe.s[113]++;
      break;
    } else {
      cov_1mknr9mehe.b[19][1]++;
    }

    var isWordEnd = (cov_1mknr9mehe.s[114]++, isWhitespaceChar(char));
    cov_1mknr9mehe.s[115]++;
    if (isWordEnd) {
      cov_1mknr9mehe.b[21][0]++;
      cov_1mknr9mehe.s[116]++;

      if (cursor !== wordBegin) {
        cov_1mknr9mehe.b[22][0]++;
        cov_1mknr9mehe.s[117]++;

        words.push(str.slice(wordBegin, cursor));
      } else {
        cov_1mknr9mehe.b[22][1]++;
      }
      cov_1mknr9mehe.s[118]++;
      wordBegin = cursor + 1;
      cov_1mknr9mehe.s[119]++;
      cursor++;
      cov_1mknr9mehe.s[120]++;
      continue;
    } else {
      cov_1mknr9mehe.b[21][1]++;
    }

    var isQuoteStart = (cov_1mknr9mehe.s[121]++, (cov_1mknr9mehe.b[23][0]++, char === '\'') || (cov_1mknr9mehe.b[23][1]++, char === '"'));
    cov_1mknr9mehe.s[122]++;
    if (isQuoteStart) {
      cov_1mknr9mehe.b[24][0]++;
      cov_1mknr9mehe.s[123]++;

      quote = char;
      cov_1mknr9mehe.s[124]++;
      cursor++;
      cov_1mknr9mehe.s[125]++;
      continue;
    } else {
      cov_1mknr9mehe.b[24][1]++;
    }

    cov_1mknr9mehe.s[126]++;
    cursor++;
  }
  cov_1mknr9mehe.s[127]++;
  jumpPosition(position, str, cursor);

  var wLen = (cov_1mknr9mehe.s[128]++, words.length);
  var type = (cov_1mknr9mehe.s[129]++, 'attribute');
  cov_1mknr9mehe.s[130]++;
  for (var i = 0; i < wLen; i++) {
    var word = (cov_1mknr9mehe.s[131]++, words[i]);
    var isNotPair = (cov_1mknr9mehe.s[132]++, word.indexOf('=') === -1);
    cov_1mknr9mehe.s[133]++;
    if (isNotPair) {
      cov_1mknr9mehe.b[25][0]++;

      var secondWord = (cov_1mknr9mehe.s[134]++, words[i + 1]);
      cov_1mknr9mehe.s[135]++;
      if ((cov_1mknr9mehe.b[27][0]++, secondWord) && (cov_1mknr9mehe.b[27][1]++, (0, _compat.startsWith)(secondWord, '='))) {
        cov_1mknr9mehe.b[26][0]++;
        cov_1mknr9mehe.s[136]++;

        if (secondWord.length > 1) {
          cov_1mknr9mehe.b[28][0]++;

          var newWord = (cov_1mknr9mehe.s[137]++, word + secondWord);
          cov_1mknr9mehe.s[138]++;
          tokens.push({ type: type, content: newWord });
          cov_1mknr9mehe.s[139]++;
          i += 1;
          cov_1mknr9mehe.s[140]++;
          continue;
        } else {
          cov_1mknr9mehe.b[28][1]++;
        }
        var thirdWord = (cov_1mknr9mehe.s[141]++, words[i + 2]);
        cov_1mknr9mehe.s[142]++;
        i += 1;
        cov_1mknr9mehe.s[143]++;
        if (thirdWord) {
          cov_1mknr9mehe.b[29][0]++;

          var _newWord = (cov_1mknr9mehe.s[144]++, word + '=' + thirdWord);
          cov_1mknr9mehe.s[145]++;
          tokens.push({ type: type, content: _newWord });
          cov_1mknr9mehe.s[146]++;
          i += 1;
          cov_1mknr9mehe.s[147]++;
          continue;
        } else {
          cov_1mknr9mehe.b[29][1]++;
        }
      } else {
        cov_1mknr9mehe.b[26][1]++;
      }
    } else {
      cov_1mknr9mehe.b[25][1]++;
    }
    cov_1mknr9mehe.s[148]++;
    if ((0, _compat.endsWith)(word, '=')) {
      cov_1mknr9mehe.b[30][0]++;

      var _secondWord = (cov_1mknr9mehe.s[149]++, words[i + 1]);
      cov_1mknr9mehe.s[150]++;
      if ((cov_1mknr9mehe.b[32][0]++, _secondWord) && (cov_1mknr9mehe.b[32][1]++, !(0, _compat.stringIncludes)(_secondWord, '='))) {
        cov_1mknr9mehe.b[31][0]++;

        var _newWord3 = (cov_1mknr9mehe.s[151]++, word + _secondWord);
        cov_1mknr9mehe.s[152]++;
        tokens.push({ type: type, content: _newWord3 });
        cov_1mknr9mehe.s[153]++;
        i += 1;
        cov_1mknr9mehe.s[154]++;
        continue;
      } else {
        cov_1mknr9mehe.b[31][1]++;
      }

      var _newWord2 = (cov_1mknr9mehe.s[155]++, word.slice(0, -1));
      cov_1mknr9mehe.s[156]++;
      tokens.push({ type: type, content: _newWord2 });
      cov_1mknr9mehe.s[157]++;
      continue;
    } else {
      cov_1mknr9mehe.b[30][1]++;
    }

    cov_1mknr9mehe.s[158]++;
    tokens.push({ type: type, content: word });
  }
}

var push = (cov_1mknr9mehe.s[159]++, [].push);

function lexSkipTag(tagName, state) {
  cov_1mknr9mehe.f[13]++;

  var _ref7 = (cov_1mknr9mehe.s[160]++, state),
      str = _ref7.str,
      position = _ref7.position,
      tokens = _ref7.tokens;

  var safeTagName = (cov_1mknr9mehe.s[161]++, tagName.toLowerCase());
  var len = (cov_1mknr9mehe.s[162]++, str.length);
  var index = (cov_1mknr9mehe.s[163]++, position.index);
  cov_1mknr9mehe.s[164]++;
  while (index < len) {
    var nextTag = (cov_1mknr9mehe.s[165]++, str.indexOf('</', index));
    cov_1mknr9mehe.s[166]++;
    if (nextTag === -1) {
      cov_1mknr9mehe.b[33][0]++;
      cov_1mknr9mehe.s[167]++;

      lexText(state);
      cov_1mknr9mehe.s[168]++;
      break;
    } else {
      cov_1mknr9mehe.b[33][1]++;
    }

    var tagStartPosition = (cov_1mknr9mehe.s[169]++, copyPosition(position));
    cov_1mknr9mehe.s[170]++;
    jumpPosition(tagStartPosition, str, nextTag);
    var tagState = (cov_1mknr9mehe.s[171]++, { str: str, position: tagStartPosition, tokens: [] });
    var name = (cov_1mknr9mehe.s[172]++, lexTag(tagState));
    cov_1mknr9mehe.s[173]++;
    if (safeTagName !== name.toLowerCase()) {
      cov_1mknr9mehe.b[34][0]++;
      cov_1mknr9mehe.s[174]++;

      index = tagState.position.index;
      cov_1mknr9mehe.s[175]++;
      continue;
    } else {
      cov_1mknr9mehe.b[34][1]++;
    }

    cov_1mknr9mehe.s[176]++;
    if (nextTag !== position.index) {
      cov_1mknr9mehe.b[35][0]++;

      var textStart = (cov_1mknr9mehe.s[177]++, copyPosition(position));
      cov_1mknr9mehe.s[178]++;
      jumpPosition(position, str, nextTag);
      cov_1mknr9mehe.s[179]++;
      tokens.push({
        type: 'text',
        content: str.slice(textStart.index, nextTag),
        position: {
          start: textStart,
          end: copyPosition(position)
        }
      });
    } else {
      cov_1mknr9mehe.b[35][1]++;
    }

    cov_1mknr9mehe.s[180]++;
    push.apply(tokens, tagState.tokens);
    cov_1mknr9mehe.s[181]++;
    jumpPosition(position, str, tagState.position.index);
    cov_1mknr9mehe.s[182]++;
    break;
  }
}

},{"./compat":1}],5:[function(require,module,exports){
'use strict';

var cov_q4ngc1js5 = function () {
  var path = '/Users/chrisandrejewski/Desktop/Work/github-repos/himalaya/src/parser.js',
      hash = '10fb0478bb046c7059c47c8225586b7e30f48474',
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = '__coverage__',
      coverageData = {
    path: '/Users/chrisandrejewski/Desktop/Work/github-repos/himalaya/src/parser.js',
    statementMap: {
      '0': {
        start: {
          line: 4,
          column: 15
        },
        end: {
          line: 4,
          column: 44
        }
      },
      '1': {
        start: {
          line: 5,
          column: 16
        },
        end: {
          line: 5,
          column: 59
        }
      },
      '2': {
        start: {
          line: 6,
          column: 2
        },
        end: {
          line: 6,
          column: 14
        }
      },
      '3': {
        start: {
          line: 7,
          column: 2
        },
        end: {
          line: 7,
          column: 22
        }
      },
      '4': {
        start: {
          line: 11,
          column: 21
        },
        end: {
          line: 11,
          column: 39
        }
      },
      '5': {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 24,
          column: 3
        }
      },
      '6': {
        start: {
          line: 13,
          column: 23
        },
        end: {
          line: 13,
          column: 39
        }
      },
      '7': {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 23,
          column: 5
        }
      },
      '8': {
        start: {
          line: 15,
          column: 28
        },
        end: {
          line: 15,
          column: 55
        }
      },
      '9': {
        start: {
          line: 16,
          column: 6
        },
        end: {
          line: 18,
          column: 7
        }
      },
      '10': {
        start: {
          line: 17,
          column: 8
        },
        end: {
          line: 17,
          column: 13
        }
      },
      '11': {
        start: {
          line: 19,
          column: 6
        },
        end: {
          line: 21,
          column: 7
        }
      },
      '12': {
        start: {
          line: 20,
          column: 8
        },
        end: {
          line: 20,
          column: 19
        }
      },
      '13': {
        start: {
          line: 22,
          column: 6
        },
        end: {
          line: 22,
          column: 20
        }
      },
      '14': {
        start: {
          line: 25,
          column: 2
        },
        end: {
          line: 25,
          column: 14
        }
      },
      '15': {
        start: {
          line: 29,
          column: 2
        },
        end: {
          line: 29,
          column: 45
        }
      },
      '16': {
        start: {
          line: 30,
          column: 2
        },
        end: {
          line: 32,
          column: 3
        }
      },
      '17': {
        start: {
          line: 31,
          column: 4
        },
        end: {
          line: 31,
          column: 47
        }
      },
      '18': {
        start: {
          line: 33,
          column: 2
        },
        end: {
          line: 33,
          column: 25
        }
      },
      '19': {
        start: {
          line: 37,
          column: 28
        },
        end: {
          line: 37,
          column: 33
        }
      },
      '20': {
        start: {
          line: 38,
          column: 16
        },
        end: {
          line: 38,
          column: 21
        }
      },
      '21': {
        start: {
          line: 39,
          column: 14
        },
        end: {
          line: 39,
          column: 46
        }
      },
      '22': {
        start: {
          line: 40,
          column: 14
        },
        end: {
          line: 40,
          column: 27
        }
      },
      '23': {
        start: {
          line: 41,
          column: 17
        },
        end: {
          line: 41,
          column: 22
        }
      },
      '24': {
        start: {
          line: 42,
          column: 2
        },
        end: {
          line: 132,
          column: 3
        }
      },
      '25': {
        start: {
          line: 43,
          column: 18
        },
        end: {
          line: 43,
          column: 32
        }
      },
      '26': {
        start: {
          line: 44,
          column: 4
        },
        end: {
          line: 48,
          column: 5
        }
      },
      '27': {
        start: {
          line: 45,
          column: 6
        },
        end: {
          line: 45,
          column: 23
        }
      },
      '28': {
        start: {
          line: 46,
          column: 6
        },
        end: {
          line: 46,
          column: 14
        }
      },
      '29': {
        start: {
          line: 47,
          column: 6
        },
        end: {
          line: 47,
          column: 14
        }
      },
      '30': {
        start: {
          line: 50,
          column: 21
        },
        end: {
          line: 50,
          column: 37
        }
      },
      '31': {
        start: {
          line: 51,
          column: 4
        },
        end: {
          line: 51,
          column: 12
        }
      },
      '32': {
        start: {
          line: 52,
          column: 20
        },
        end: {
          line: 52,
          column: 50
        }
      },
      '33': {
        start: {
          line: 53,
          column: 4
        },
        end: {
          line: 73,
          column: 5
        }
      },
      '34': {
        start: {
          line: 54,
          column: 18
        },
        end: {
          line: 54,
          column: 30
        }
      },
      '35': {
        start: {
          line: 55,
          column: 25
        },
        end: {
          line: 55,
          column: 30
        }
      },
      '36': {
        start: {
          line: 56,
          column: 6
        },
        end: {
          line: 61,
          column: 7
        }
      },
      '37': {
        start: {
          line: 57,
          column: 8
        },
        end: {
          line: 60,
          column: 9
        }
      },
      '38': {
        start: {
          line: 58,
          column: 10
        },
        end: {
          line: 58,
          column: 29
        }
      },
      '39': {
        start: {
          line: 59,
          column: 10
        },
        end: {
          line: 59,
          column: 15
        }
      },
      '40': {
        start: {
          line: 62,
          column: 6
        },
        end: {
          line: 66,
          column: 7
        }
      },
      '41': {
        start: {
          line: 63,
          column: 25
        },
        end: {
          line: 63,
          column: 39
        }
      },
      '42': {
        start: {
          line: 64,
          column: 8
        },
        end: {
          line: 64,
          column: 46
        }
      },
      '43': {
        start: {
          line: 64,
          column: 41
        },
        end: {
          line: 64,
          column: 46
        }
      },
      '44': {
        start: {
          line: 65,
          column: 8
        },
        end: {
          line: 65,
          column: 16
        }
      },
      '45': {
        start: {
          line: 67,
          column: 6
        },
        end: {
          line: 72,
          column: 7
        }
      },
      '46': {
        start: {
          line: 68,
          column: 8
        },
        end: {
          line: 68,
          column: 88
        }
      },
      '47': {
        start: {
          line: 69,
          column: 8
        },
        end: {
          line: 69,
          column: 13
        }
      },
      '48': {
        start: {
          line: 71,
          column: 8
        },
        end: {
          line: 71,
          column: 16
        }
      },
      '49': {
        start: {
          line: 75,
          column: 25
        },
        end: {
          line: 75,
          column: 68
        }
      },
      '50': {
        start: {
          line: 76,
          column: 34
        },
        end: {
          line: 76,
          column: 46
        }
      },
      '51': {
        start: {
          line: 77,
          column: 4
        },
        end: {
          line: 80,
          column: 5
        }
      },
      '52': {
        start: {
          line: 78,
          column: 56
        },
        end: {
          line: 78,
          column: 63
        }
      },
      '53': {
        start: {
          line: 79,
          column: 6
        },
        end: {
          line: 79,
          column: 77
        }
      },
      '54': {
        start: {
          line: 82,
          column: 4
        },
        end: {
          line: 95,
          column: 5
        }
      },
      '55': {
        start: {
          line: 85,
          column: 25
        },
        end: {
          line: 85,
          column: 41
        }
      },
      '56': {
        start: {
          line: 86,
          column: 6
        },
        end: {
          line: 94,
          column: 7
        }
      },
      '57': {
        start: {
          line: 87,
          column: 8
        },
        end: {
          line: 92,
          column: 9
        }
      },
      '58': {
        start: {
          line: 88,
          column: 10
        },
        end: {
          line: 88,
          column: 86
        }
      },
      '59': {
        start: {
          line: 89,
          column: 32
        },
        end: {
          line: 89,
          column: 48
        }
      },
      '60': {
        start: {
          line: 90,
          column: 10
        },
        end: {
          line: 90,
          column: 47
        }
      },
      '61': {
        start: {
          line: 91,
          column: 10
        },
        end: {
          line: 91,
          column: 15
        }
      },
      '62': {
        start: {
          line: 93,
          column: 8
        },
        end: {
          line: 93,
          column: 39
        }
      },
      '63': {
        start: {
          line: 97,
          column: 21
        },
        end: {
          line: 97,
          column: 23
        }
      },
      '64': {
        start: {
          line: 99,
          column: 4
        },
        end: {
          line: 104,
          column: 5
        }
      },
      '65': {
        start: {
          line: 100,
          column: 6
        },
        end: {
          line: 100,
          column: 32
        }
      },
      '66': {
        start: {
          line: 101,
          column: 6
        },
        end: {
          line: 101,
          column: 45
        }
      },
      '67': {
        start: {
          line: 101,
          column: 40
        },
        end: {
          line: 101,
          column: 45
        }
      },
      '68': {
        start: {
          line: 102,
          column: 6
        },
        end: {
          line: 102,
          column: 40
        }
      },
      '69': {
        start: {
          line: 103,
          column: 6
        },
        end: {
          line: 103,
          column: 14
        }
      },
      '70': {
        start: {
          line: 106,
          column: 4
        },
        end: {
          line: 106,
          column: 12
        }
      },
      '71': {
        start: {
          line: 107,
          column: 21
        },
        end: {
          line: 107,
          column: 23
        }
      },
      '72': {
        start: {
          line: 108,
          column: 21
        },
        end: {
          line: 111,
          column: 5
        }
      },
      '73': {
        start: {
          line: 112,
          column: 24
        },
        end: {
          line: 118,
          column: 5
        }
      },
      '74': {
        start: {
          line: 119,
          column: 4
        },
        end: {
          line: 119,
          column: 27
        }
      },
      '75': {
        start: {
          line: 121,
          column: 24
        },
        end: {
          line: 121,
          column: 86
        }
      },
      '76': {
        start: {
          line: 122,
          column: 4
        },
        end: {
          line: 131,
          column: 5
        }
      },
      '77': {
        start: {
          line: 123,
          column: 19
        },
        end: {
          line: 123,
          column: 60
        }
      },
      '78': {
        start: {
          line: 124,
          column: 25
        },
        end: {
          line: 124,
          column: 57
        }
      },
      '79': {
        start: {
          line: 125,
          column: 6
        },
        end: {
          line: 125,
          column: 23
        }
      },
      '80': {
        start: {
          line: 126,
          column: 6
        },
        end: {
          line: 126,
          column: 32
        }
      },
      '81': {
        start: {
          line: 127,
          column: 31
        },
        end: {
          line: 127,
          column: 52
        }
      },
      '82': {
        start: {
          line: 128,
          column: 6
        },
        end: {
          line: 130,
          column: 7
        }
      },
      '83': {
        start: {
          line: 129,
          column: 8
        },
        end: {
          line: 129,
          column: 66
        }
      },
      '84': {
        start: {
          line: 133,
          column: 2
        },
        end: {
          line: 133,
          column: 23
        }
      }
    },
    fnMap: {
      '0': {
        name: 'parser',
        decl: {
          start: {
            line: 3,
            column: 24
          },
          end: {
            line: 3,
            column: 30
          }
        },
        loc: {
          start: {
            line: 3,
            column: 49
          },
          end: {
            line: 8,
            column: 1
          }
        },
        line: 3
      },
      '1': {
        name: 'hasTerminalParent',
        decl: {
          start: {
            line: 10,
            column: 16
          },
          end: {
            line: 10,
            column: 33
          }
        },
        loc: {
          start: {
            line: 10,
            column: 62
          },
          end: {
            line: 26,
            column: 1
          }
        },
        line: 10
      },
      '2': {
        name: 'rewindStack',
        decl: {
          start: {
            line: 28,
            column: 16
          },
          end: {
            line: 28,
            column: 27
          }
        },
        loc: {
          start: {
            line: 28,
            column: 81
          },
          end: {
            line: 34,
            column: 1
          }
        },
        line: 28
      },
      '3': {
        name: 'parse',
        decl: {
          start: {
            line: 36,
            column: 16
          },
          end: {
            line: 36,
            column: 21
          }
        },
        loc: {
          start: {
            line: 36,
            column: 30
          },
          end: {
            line: 134,
            column: 1
          }
        },
        line: 36
      }
    },
    branchMap: {
      '0': {
        loc: {
          start: {
            line: 12,
            column: 2
          },
          end: {
            line: 24,
            column: 3
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 12,
            column: 2
          },
          end: {
            line: 24,
            column: 3
          }
        }, {
          start: {
            line: 12,
            column: 2
          },
          end: {
            line: 24,
            column: 3
          }
        }],
        line: 12
      },
      '1': {
        loc: {
          start: {
            line: 16,
            column: 6
          },
          end: {
            line: 18,
            column: 7
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 16,
            column: 6
          },
          end: {
            line: 18,
            column: 7
          }
        }, {
          start: {
            line: 16,
            column: 6
          },
          end: {
            line: 18,
            column: 7
          }
        }],
        line: 16
      },
      '2': {
        loc: {
          start: {
            line: 19,
            column: 6
          },
          end: {
            line: 21,
            column: 7
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 19,
            column: 6
          },
          end: {
            line: 21,
            column: 7
          }
        }, {
          start: {
            line: 19,
            column: 6
          },
          end: {
            line: 21,
            column: 7
          }
        }],
        line: 19
      },
      '3': {
        loc: {
          start: {
            line: 44,
            column: 4
          },
          end: {
            line: 48,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 44,
            column: 4
          },
          end: {
            line: 48,
            column: 5
          }
        }, {
          start: {
            line: 44,
            column: 4
          },
          end: {
            line: 48,
            column: 5
          }
        }],
        line: 44
      },
      '4': {
        loc: {
          start: {
            line: 53,
            column: 4
          },
          end: {
            line: 73,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 53,
            column: 4
          },
          end: {
            line: 73,
            column: 5
          }
        }, {
          start: {
            line: 53,
            column: 4
          },
          end: {
            line: 73,
            column: 5
          }
        }],
        line: 53
      },
      '5': {
        loc: {
          start: {
            line: 57,
            column: 8
          },
          end: {
            line: 60,
            column: 9
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 57,
            column: 8
          },
          end: {
            line: 60,
            column: 9
          }
        }, {
          start: {
            line: 57,
            column: 8
          },
          end: {
            line: 60,
            column: 9
          }
        }],
        line: 57
      },
      '6': {
        loc: {
          start: {
            line: 64,
            column: 8
          },
          end: {
            line: 64,
            column: 46
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 64,
            column: 8
          },
          end: {
            line: 64,
            column: 46
          }
        }, {
          start: {
            line: 64,
            column: 8
          },
          end: {
            line: 64,
            column: 46
          }
        }],
        line: 64
      },
      '7': {
        loc: {
          start: {
            line: 67,
            column: 6
          },
          end: {
            line: 72,
            column: 7
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 67,
            column: 6
          },
          end: {
            line: 72,
            column: 7
          }
        }, {
          start: {
            line: 67,
            column: 6
          },
          end: {
            line: 72,
            column: 7
          }
        }],
        line: 67
      },
      '8': {
        loc: {
          start: {
            line: 77,
            column: 4
          },
          end: {
            line: 80,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 77,
            column: 4
          },
          end: {
            line: 80,
            column: 5
          }
        }, {
          start: {
            line: 77,
            column: 4
          },
          end: {
            line: 80,
            column: 5
          }
        }],
        line: 77
      },
      '9': {
        loc: {
          start: {
            line: 82,
            column: 4
          },
          end: {
            line: 95,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 82,
            column: 4
          },
          end: {
            line: 95,
            column: 5
          }
        }, {
          start: {
            line: 82,
            column: 4
          },
          end: {
            line: 95,
            column: 5
          }
        }],
        line: 82
      },
      '10': {
        loc: {
          start: {
            line: 87,
            column: 8
          },
          end: {
            line: 92,
            column: 9
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 87,
            column: 8
          },
          end: {
            line: 92,
            column: 9
          }
        }, {
          start: {
            line: 87,
            column: 8
          },
          end: {
            line: 92,
            column: 9
          }
        }],
        line: 87
      },
      '11': {
        loc: {
          start: {
            line: 101,
            column: 6
          },
          end: {
            line: 101,
            column: 45
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 101,
            column: 6
          },
          end: {
            line: 101,
            column: 45
          }
        }, {
          start: {
            line: 101,
            column: 6
          },
          end: {
            line: 101,
            column: 45
          }
        }],
        line: 101
      },
      '12': {
        loc: {
          start: {
            line: 121,
            column: 26
          },
          end: {
            line: 121,
            column: 85
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 121,
            column: 26
          },
          end: {
            line: 121,
            column: 41
          }
        }, {
          start: {
            line: 121,
            column: 45
          },
          end: {
            line: 121,
            column: 85
          }
        }],
        line: 121
      },
      '13': {
        loc: {
          start: {
            line: 122,
            column: 4
          },
          end: {
            line: 131,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 122,
            column: 4
          },
          end: {
            line: 131,
            column: 5
          }
        }, {
          start: {
            line: 122,
            column: 4
          },
          end: {
            line: 131,
            column: 5
          }
        }],
        line: 122
      },
      '14': {
        loc: {
          start: {
            line: 128,
            column: 6
          },
          end: {
            line: 130,
            column: 7
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 128,
            column: 6
          },
          end: {
            line: 130,
            column: 7
          }
        }, {
          start: {
            line: 128,
            column: 6
          },
          end: {
            line: 130,
            column: 7
          }
        }],
        line: 128
      }
    },
    s: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
      '10': 0,
      '11': 0,
      '12': 0,
      '13': 0,
      '14': 0,
      '15': 0,
      '16': 0,
      '17': 0,
      '18': 0,
      '19': 0,
      '20': 0,
      '21': 0,
      '22': 0,
      '23': 0,
      '24': 0,
      '25': 0,
      '26': 0,
      '27': 0,
      '28': 0,
      '29': 0,
      '30': 0,
      '31': 0,
      '32': 0,
      '33': 0,
      '34': 0,
      '35': 0,
      '36': 0,
      '37': 0,
      '38': 0,
      '39': 0,
      '40': 0,
      '41': 0,
      '42': 0,
      '43': 0,
      '44': 0,
      '45': 0,
      '46': 0,
      '47': 0,
      '48': 0,
      '49': 0,
      '50': 0,
      '51': 0,
      '52': 0,
      '53': 0,
      '54': 0,
      '55': 0,
      '56': 0,
      '57': 0,
      '58': 0,
      '59': 0,
      '60': 0,
      '61': 0,
      '62': 0,
      '63': 0,
      '64': 0,
      '65': 0,
      '66': 0,
      '67': 0,
      '68': 0,
      '69': 0,
      '70': 0,
      '71': 0,
      '72': 0,
      '73': 0,
      '74': 0,
      '75': 0,
      '76': 0,
      '77': 0,
      '78': 0,
      '79': 0,
      '80': 0,
      '81': 0,
      '82': 0,
      '83': 0,
      '84': 0
    },
    f: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0
    },
    b: {
      '0': [0, 0],
      '1': [0, 0],
      '2': [0, 0],
      '3': [0, 0],
      '4': [0, 0],
      '5': [0, 0],
      '6': [0, 0],
      '7': [0, 0],
      '8': [0, 0],
      '9': [0, 0],
      '10': [0, 0],
      '11': [0, 0],
      '12': [0, 0],
      '13': [0, 0],
      '14': [0, 0]
    },
    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parser;
exports.hasTerminalParent = hasTerminalParent;
exports.rewindStack = rewindStack;
exports.parse = parse;

var _compat = require('./compat');

function parser(tokens, options) {
  cov_q4ngc1js5.f[0]++;

  var root = (cov_q4ngc1js5.s[0]++, { tagName: null, children: [] });
  var state = (cov_q4ngc1js5.s[1]++, { tokens: tokens, options: options, cursor: 0, stack: [root] });
  cov_q4ngc1js5.s[2]++;
  parse(state);
  cov_q4ngc1js5.s[3]++;
  return root.children;
}

function hasTerminalParent(tagName, stack, terminals) {
  cov_q4ngc1js5.f[1]++;

  var tagParents = (cov_q4ngc1js5.s[4]++, terminals[tagName]);
  cov_q4ngc1js5.s[5]++;
  if (tagParents) {
    cov_q4ngc1js5.b[0][0]++;

    var currentIndex = (cov_q4ngc1js5.s[6]++, stack.length - 1);
    cov_q4ngc1js5.s[7]++;
    while (currentIndex >= 0) {
      var parentTagName = (cov_q4ngc1js5.s[8]++, stack[currentIndex].tagName);
      cov_q4ngc1js5.s[9]++;
      if (parentTagName === tagName) {
        cov_q4ngc1js5.b[1][0]++;
        cov_q4ngc1js5.s[10]++;

        break;
      } else {
        cov_q4ngc1js5.b[1][1]++;
      }
      cov_q4ngc1js5.s[11]++;
      if ((0, _compat.arrayIncludes)(tagParents, parentTagName)) {
        cov_q4ngc1js5.b[2][0]++;
        cov_q4ngc1js5.s[12]++;

        return true;
      } else {
        cov_q4ngc1js5.b[2][1]++;
      }
      cov_q4ngc1js5.s[13]++;
      currentIndex--;
    }
  } else {
    cov_q4ngc1js5.b[0][1]++;
  }
  cov_q4ngc1js5.s[14]++;
  return false;
}

function rewindStack(stack, newLength, childrenEndPosition, endPosition) {
  cov_q4ngc1js5.f[2]++;
  cov_q4ngc1js5.s[15]++;

  stack[newLength].position.end = endPosition;
  cov_q4ngc1js5.s[16]++;
  for (var i = newLength + 1, len = stack.length; i < len; i++) {
    cov_q4ngc1js5.s[17]++;

    stack[i].position.end = childrenEndPosition;
  }
  cov_q4ngc1js5.s[18]++;
  stack.splice(newLength);
}

function parse(state) {
  cov_q4ngc1js5.f[3]++;

  var _ref = (cov_q4ngc1js5.s[19]++, state),
      tokens = _ref.tokens,
      options = _ref.options;

  var _ref2 = (cov_q4ngc1js5.s[20]++, state),
      stack = _ref2.stack;

  var nodes = (cov_q4ngc1js5.s[21]++, stack[stack.length - 1].children);
  var len = (cov_q4ngc1js5.s[22]++, tokens.length);

  var _ref3 = (cov_q4ngc1js5.s[23]++, state),
      cursor = _ref3.cursor;

  cov_q4ngc1js5.s[24]++;

  while (cursor < len) {
    var token = (cov_q4ngc1js5.s[25]++, tokens[cursor]);
    cov_q4ngc1js5.s[26]++;
    if (token.type !== 'tag-start') {
      cov_q4ngc1js5.b[3][0]++;
      cov_q4ngc1js5.s[27]++;

      nodes.push(token);
      cov_q4ngc1js5.s[28]++;
      cursor++;
      cov_q4ngc1js5.s[29]++;
      continue;
    } else {
      cov_q4ngc1js5.b[3][1]++;
    }

    var tagToken = (cov_q4ngc1js5.s[30]++, tokens[++cursor]);
    cov_q4ngc1js5.s[31]++;
    cursor++;
    var tagName = (cov_q4ngc1js5.s[32]++, tagToken.content.toLowerCase());
    cov_q4ngc1js5.s[33]++;
    if (token.close) {
      cov_q4ngc1js5.b[4][0]++;

      var index = (cov_q4ngc1js5.s[34]++, stack.length);
      var shouldRewind = (cov_q4ngc1js5.s[35]++, false);
      cov_q4ngc1js5.s[36]++;
      while (--index > -1) {
        cov_q4ngc1js5.s[37]++;

        if (stack[index].tagName === tagName) {
          cov_q4ngc1js5.b[5][0]++;
          cov_q4ngc1js5.s[38]++;

          shouldRewind = true;
          cov_q4ngc1js5.s[39]++;
          break;
        } else {
          cov_q4ngc1js5.b[5][1]++;
        }
      }
      cov_q4ngc1js5.s[40]++;
      while (cursor < len) {
        var endToken = (cov_q4ngc1js5.s[41]++, tokens[cursor]);
        cov_q4ngc1js5.s[42]++;
        if (endToken.type !== 'tag-end') {
            cov_q4ngc1js5.b[6][0]++;
            cov_q4ngc1js5.s[43]++;
            break;
          } else {
          cov_q4ngc1js5.b[6][1]++;
        }cov_q4ngc1js5.s[44]++;
        cursor++;
      }
      cov_q4ngc1js5.s[45]++;
      if (shouldRewind) {
        cov_q4ngc1js5.b[7][0]++;
        cov_q4ngc1js5.s[46]++;

        rewindStack(stack, index, token.position.start, tokens[cursor - 1].position.end);
        cov_q4ngc1js5.s[47]++;
        break;
      } else {
        cov_q4ngc1js5.b[7][1]++;
        cov_q4ngc1js5.s[48]++;

        continue;
      }
    } else {
      cov_q4ngc1js5.b[4][1]++;
    }

    var isClosingTag = (cov_q4ngc1js5.s[49]++, (0, _compat.arrayIncludes)(options.closingTags, tagName));
    var shouldRewindToAutoClose = (cov_q4ngc1js5.s[50]++, isClosingTag);
    cov_q4ngc1js5.s[51]++;
    if (shouldRewindToAutoClose) {
      cov_q4ngc1js5.b[8][0]++;

      var _ref4 = (cov_q4ngc1js5.s[52]++, options),
          terminals = _ref4.closingTagAncestorBreakers;

      cov_q4ngc1js5.s[53]++;

      shouldRewindToAutoClose = !hasTerminalParent(tagName, stack, terminals);
    } else {
      cov_q4ngc1js5.b[8][1]++;
    }

    cov_q4ngc1js5.s[54]++;
    if (shouldRewindToAutoClose) {
      cov_q4ngc1js5.b[9][0]++;

      // rewind the stack to just above the previous
      // closing tag of the same name
      var currentIndex = (cov_q4ngc1js5.s[55]++, stack.length - 1);
      cov_q4ngc1js5.s[56]++;
      while (currentIndex > 0) {
        cov_q4ngc1js5.s[57]++;

        if (tagName === stack[currentIndex].tagName) {
          cov_q4ngc1js5.b[10][0]++;
          cov_q4ngc1js5.s[58]++;

          rewindStack(stack, currentIndex, token.position.start, token.position.start);
          var previousIndex = (cov_q4ngc1js5.s[59]++, currentIndex - 1);
          cov_q4ngc1js5.s[60]++;
          nodes = stack[previousIndex].children;
          cov_q4ngc1js5.s[61]++;
          break;
        } else {
          cov_q4ngc1js5.b[10][1]++;
        }
        cov_q4ngc1js5.s[62]++;
        currentIndex = currentIndex - 1;
      }
    } else {
      cov_q4ngc1js5.b[9][1]++;
    }

    var attributes = (cov_q4ngc1js5.s[63]++, []);
    var attrToken = void 0;
    cov_q4ngc1js5.s[64]++;
    while (cursor < len) {
      cov_q4ngc1js5.s[65]++;

      attrToken = tokens[cursor];
      cov_q4ngc1js5.s[66]++;
      if (attrToken.type === 'tag-end') {
          cov_q4ngc1js5.b[11][0]++;
          cov_q4ngc1js5.s[67]++;
          break;
        } else {
        cov_q4ngc1js5.b[11][1]++;
      }cov_q4ngc1js5.s[68]++;
      attributes.push(attrToken.content);
      cov_q4ngc1js5.s[69]++;
      cursor++;
    }

    cov_q4ngc1js5.s[70]++;
    cursor++;
    var children = (cov_q4ngc1js5.s[71]++, []);
    var position = (cov_q4ngc1js5.s[72]++, {
      start: token.position.start,
      end: attrToken.position.end
    });
    var elementNode = (cov_q4ngc1js5.s[73]++, {
      type: 'element',
      tagName: tagToken.content,
      attributes: attributes,
      children: children,
      position: position
    });
    cov_q4ngc1js5.s[74]++;
    nodes.push(elementNode);

    var hasChildren = (cov_q4ngc1js5.s[75]++, !((cov_q4ngc1js5.b[12][0]++, attrToken.close) || (cov_q4ngc1js5.b[12][1]++, (0, _compat.arrayIncludes)(options.voidTags, tagName))));
    cov_q4ngc1js5.s[76]++;
    if (hasChildren) {
      cov_q4ngc1js5.b[13][0]++;

      var size = (cov_q4ngc1js5.s[77]++, stack.push({ tagName: tagName, children: children, position: position }));
      var innerState = (cov_q4ngc1js5.s[78]++, { tokens: tokens, options: options, cursor: cursor, stack: stack });
      cov_q4ngc1js5.s[79]++;
      parse(innerState);
      cov_q4ngc1js5.s[80]++;
      cursor = innerState.cursor;
      var rewoundInElement = (cov_q4ngc1js5.s[81]++, stack.length === size);
      cov_q4ngc1js5.s[82]++;
      if (rewoundInElement) {
        cov_q4ngc1js5.b[14][0]++;
        cov_q4ngc1js5.s[83]++;

        elementNode.position.end = tokens[cursor - 1].position.end;
      } else {
        cov_q4ngc1js5.b[14][1]++;
      }
    } else {
      cov_q4ngc1js5.b[13][1]++;
    }
  }
  cov_q4ngc1js5.s[84]++;
  state.cursor = cursor;
}

},{"./compat":1}],6:[function(require,module,exports){
'use strict';

var cov_fs4bzhlz4 = function () {
  var path = '/Users/chrisandrejewski/Desktop/Work/github-repos/himalaya/src/stringify.js',
      hash = '4a6a4628f3d12bd91f868fee07f716c74df89307',
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = '__coverage__',
      coverageData = {
    path: '/Users/chrisandrejewski/Desktop/Work/github-repos/himalaya/src/stringify.js',
    statementMap: {
      '0': {
        start: {
          line: 4,
          column: 2
        },
        end: {
          line: 12,
          column: 8
        }
      },
      '1': {
        start: {
          line: 5,
          column: 25
        },
        end: {
          line: 5,
          column: 34
        }
      },
      '2': {
        start: {
          line: 6,
          column: 4
        },
        end: {
          line: 8,
          column: 5
        }
      },
      '3': {
        start: {
          line: 7,
          column: 6
        },
        end: {
          line: 7,
          column: 30
        }
      },
      '4': {
        start: {
          line: 9,
          column: 24
        },
        end: {
          line: 9,
          column: 50
        }
      },
      '5': {
        start: {
          line: 10,
          column: 18
        },
        end: {
          line: 10,
          column: 42
        }
      },
      '6': {
        start: {
          line: 11,
          column: 4
        },
        end: {
          line: 11,
          column: 53
        }
      },
      '7': {
        start: {
          line: 16,
          column: 2
        },
        end: {
          line: 28,
          column: 13
        }
      },
      '8': {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 19,
          column: 5
        }
      },
      '9': {
        start: {
          line: 18,
          column: 6
        },
        end: {
          line: 18,
          column: 25
        }
      },
      '10': {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 22,
          column: 5
        }
      },
      '11': {
        start: {
          line: 21,
          column: 6
        },
        end: {
          line: 21,
          column: 37
        }
      },
      '12': {
        start: {
          line: 23,
          column: 44
        },
        end: {
          line: 23,
          column: 48
        }
      },
      '13': {
        start: {
          line: 24,
          column: 26
        },
        end: {
          line: 24,
          column: 80
        }
      },
      '14': {
        start: {
          line: 25,
          column: 4
        },
        end: {
          line: 27,
          column: 94
        }
      }
    },
    fnMap: {
      '0': {
        name: 'formatAttributes',
        decl: {
          start: {
            line: 3,
            column: 16
          },
          end: {
            line: 3,
            column: 32
          }
        },
        loc: {
          start: {
            line: 3,
            column: 46
          },
          end: {
            line: 13,
            column: 1
          }
        },
        line: 3
      },
      '1': {
        name: '(anonymous_1)',
        decl: {
          start: {
            line: 4,
            column: 27
          },
          end: {
            line: 4,
            column: 28
          }
        },
        loc: {
          start: {
            line: 4,
            column: 49
          },
          end: {
            line: 12,
            column: 3
          }
        },
        line: 4
      },
      '2': {
        name: 'toHTML',
        decl: {
          start: {
            line: 15,
            column: 16
          },
          end: {
            line: 15,
            column: 22
          }
        },
        loc: {
          start: {
            line: 15,
            column: 39
          },
          end: {
            line: 29,
            column: 1
          }
        },
        line: 15
      },
      '3': {
        name: '(anonymous_3)',
        decl: {
          start: {
            line: 16,
            column: 18
          },
          end: {
            line: 16,
            column: 19
          }
        },
        loc: {
          start: {
            line: 16,
            column: 26
          },
          end: {
            line: 28,
            column: 3
          }
        },
        line: 16
      }
    },
    branchMap: {
      '0': {
        loc: {
          start: {
            line: 6,
            column: 4
          },
          end: {
            line: 8,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 6,
            column: 4
          },
          end: {
            line: 8,
            column: 5
          }
        }, {
          start: {
            line: 6,
            column: 4
          },
          end: {
            line: 8,
            column: 5
          }
        }],
        line: 6
      },
      '1': {
        loc: {
          start: {
            line: 10,
            column: 18
          },
          end: {
            line: 10,
            column: 42
          }
        },
        type: 'cond-expr',
        locations: [{
          start: {
            line: 10,
            column: 32
          },
          end: {
            line: 10,
            column: 35
          }
        }, {
          start: {
            line: 10,
            column: 38
          },
          end: {
            line: 10,
            column: 42
          }
        }],
        line: 10
      },
      '2': {
        loc: {
          start: {
            line: 17,
            column: 4
          },
          end: {
            line: 19,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 17,
            column: 4
          },
          end: {
            line: 19,
            column: 5
          }
        }, {
          start: {
            line: 17,
            column: 4
          },
          end: {
            line: 19,
            column: 5
          }
        }],
        line: 17
      },
      '3': {
        loc: {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 22,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 22,
            column: 5
          }
        }, {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 22,
            column: 5
          }
        }],
        line: 20
      },
      '4': {
        loc: {
          start: {
            line: 25,
            column: 11
          },
          end: {
            line: 27,
            column: 94
          }
        },
        type: 'cond-expr',
        locations: [{
          start: {
            line: 26,
            column: 8
          },
          end: {
            line: 26,
            column: 53
          }
        }, {
          start: {
            line: 27,
            column: 8
          },
          end: {
            line: 27,
            column: 94
          }
        }],
        line: 25
      }
    },
    s: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
      '10': 0,
      '11': 0,
      '12': 0,
      '13': 0,
      '14': 0
    },
    f: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0
    },
    b: {
      '0': [0, 0],
      '1': [0, 0],
      '2': [0, 0],
      '3': [0, 0],
      '4': [0, 0]
    },
    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatAttributes = formatAttributes;
exports.toHTML = toHTML;

var _compat = require('./compat');

function formatAttributes(attributes) {
  cov_fs4bzhlz4.f[0]++;
  cov_fs4bzhlz4.s[0]++;

  return attributes.reduce(function (attrs, attribute) {
    cov_fs4bzhlz4.f[1]++;

    var _ref = (cov_fs4bzhlz4.s[1]++, attribute),
        key = _ref.key,
        value = _ref.value;

    cov_fs4bzhlz4.s[2]++;

    if (value === null) {
      cov_fs4bzhlz4.b[0][0]++;
      cov_fs4bzhlz4.s[3]++;

      return attrs + ' ' + key;
    } else {
      cov_fs4bzhlz4.b[0][1]++;
    }
    var quoteEscape = (cov_fs4bzhlz4.s[4]++, value.indexOf('\'') !== -1);
    var quote = (cov_fs4bzhlz4.s[5]++, quoteEscape ? (cov_fs4bzhlz4.b[1][0]++, '"') : (cov_fs4bzhlz4.b[1][1]++, '\''));
    cov_fs4bzhlz4.s[6]++;
    return attrs + ' ' + key + '=' + quote + value + quote;
  }, '');
}

function toHTML(tree, options) {
  cov_fs4bzhlz4.f[2]++;
  cov_fs4bzhlz4.s[7]++;

  return tree.map(function (node) {
    cov_fs4bzhlz4.f[3]++;
    cov_fs4bzhlz4.s[8]++;

    if (node.type === 'text') {
      cov_fs4bzhlz4.b[2][0]++;
      cov_fs4bzhlz4.s[9]++;

      return node.content;
    } else {
      cov_fs4bzhlz4.b[2][1]++;
    }
    cov_fs4bzhlz4.s[10]++;
    if (node.type === 'comment') {
      cov_fs4bzhlz4.b[3][0]++;
      cov_fs4bzhlz4.s[11]++;

      return '<!--' + node.content + '-->';
    } else {
      cov_fs4bzhlz4.b[3][1]++;
    }

    var _ref2 = (cov_fs4bzhlz4.s[12]++, node),
        tagName = _ref2.tagName,
        attributes = _ref2.attributes,
        children = _ref2.children;

    var isSelfClosing = (cov_fs4bzhlz4.s[13]++, (0, _compat.arrayIncludes)(options.voidTags, tagName.toLowerCase()));
    cov_fs4bzhlz4.s[14]++;
    return isSelfClosing ? (cov_fs4bzhlz4.b[4][0]++, '<' + tagName + formatAttributes(attributes) + '>') : (cov_fs4bzhlz4.b[4][1]++, '<' + tagName + formatAttributes(attributes) + '>' + toHTML(children, options) + '</' + tagName + '>');
  }).join('');
}

exports.default = { toHTML: toHTML };

},{"./compat":1}],7:[function(require,module,exports){
'use strict';

var cov_ebkruvd2n = function () {
  var path = '/Users/chrisandrejewski/Desktop/Work/github-repos/himalaya/src/tags.js',
      hash = '6039b9f65d15797c952509955976acf6930e65a4',
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = '__coverage__',
      coverageData = {
    path: '/Users/chrisandrejewski/Desktop/Work/github-repos/himalaya/src/tags.js',
    statementMap: {
      '0': {
        start: {
          line: 5,
          column: 29
        },
        end: {
          line: 5,
          column: 60
        }
      },
      '1': {
        start: {
          line: 11,
          column: 27
        },
        end: {
          line: 14,
          column: 1
        }
      },
      '2': {
        start: {
          line: 23,
          column: 42
        },
        end: {
          line: 32,
          column: 1
        }
      },
      '3': {
        start: {
          line: 38,
          column: 24
        },
        end: {
          line: 42,
          column: 1
        }
      }
    },
    fnMap: {},
    branchMap: {},
    s: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0
    },
    f: {},
    b: {},
    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
  Tags which contain arbitary non-parsed content
  For example: <script> JavaScript should not be parsed
*/
var childlessTags = exports.childlessTags = (cov_ebkruvd2n.s[0]++, ['style', 'script', 'template']);

/*
  Tags which auto-close because they cannot be nested
  For example: <p>Outer<p>Inner is <p>Outer</p><p>Inner</p>
*/
var closingTags = exports.closingTags = (cov_ebkruvd2n.s[1]++, ['html', 'head', 'body', 'p', 'dt', 'dd', 'li', 'option', 'thead', 'th', 'tbody', 'tr', 'td', 'tfoot', 'colgroup']);

/*
  Closing tags which have ancestor tags which
  may exist within them which prevent the
  closing tag from auto-closing.
  For example: in <li><ul><li></ul></li>,
  the top-level <li> should not auto-close.
*/
var closingTagAncestorBreakers = exports.closingTagAncestorBreakers = (cov_ebkruvd2n.s[2]++, {
  li: ['ul', 'ol', 'menu'],
  dt: ['dl'],
  dd: ['dl'],
  tbody: ['table'],
  thead: ['table'],
  tfoot: ['table'],
  tr: ['table'],
  td: ['table']

  /*
    Tags which do not need the closing tag
    For example: <img> does not need </img>
  */
});var voidTags = exports.voidTags = (cov_ebkruvd2n.s[3]++, ['!doctype', 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

},{}]},{},[3])(3)
});
//# sourceMappingURL=himalaya.js.map

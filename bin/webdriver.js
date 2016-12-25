'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var waitForElement = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(selector) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return nightmare.get().evaluate(function (_selector, done) {
                            var interval = setInterval(function () {
                                var element = document.querySelector(_selector);
                                if (!element) {
                                    return;
                                }

                                if (element.childElementCount > 0) {
                                    clearInterval(interval);
                                    setTimeout(function () {
                                        done();
                                    });
                                }
                            }, 50);
                        }, selector);

                    case 3:
                        _context.next = 10;
                        break;

                    case 5:
                        _context.prev = 5;
                        _context.t0 = _context['catch'](0);

                        end();
                        debug(_context.t0);
                        return _context.abrupt('return', false);

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 5]]);
    }));

    return function waitForElement(_x) {
        return _ref.apply(this, arguments);
    };
}();

var getScreenshot = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(width, evaluate) {
        var driver, dimensions;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        debug('getScreenshot');
                        driver = nightmare.get();
                        _context2.prev = 2;

                        if (!evaluate) {
                            _context2.next = 6;
                            break;
                        }

                        _context2.next = 6;
                        return driver.evaluate(evalFn(evaluate));

                    case 6:
                        _context2.next = 8;
                        return driver.evaluate(getPageDimensions);

                    case 8:
                        dimensions = _context2.sent;

                        width = width ? Number(width) : dimensions.width;
                        _context2.next = 12;
                        return driver.viewport(width, dimensions.height).wait(1000);

                    case 12:
                        _context2.next = 14;
                        return driver.evaluate(hideScrollbar);

                    case 14:
                        _context2.next = 16;
                        return driver.screenshot();

                    case 16:
                        return _context2.abrupt('return', _context2.sent);

                    case 19:
                        _context2.prev = 19;
                        _context2.t0 = _context2['catch'](2);

                        end();
                        debug(_context2.t0);
                        return _context2.abrupt('return', _promise2.default.reject(_context2.t0));

                    case 24:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[2, 19]]);
    }));

    return function getScreenshot(_x2, _x3) {
        return _ref2.apply(this, arguments);
    };
}();

var getHTML = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(evaluate) {
        var driver;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        debug('getHTML');
                        driver = nightmare.get();
                        _context3.prev = 2;

                        if (!evaluate) {
                            _context3.next = 6;
                            break;
                        }

                        _context3.next = 6;
                        return driver.evaluate(evalFn(evaluate));

                    case 6:
                        _context3.next = 8;
                        return driver.evaluate(function () {
                            var node = document.doctype;
                            var doctype = "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>';
                            return doctype + '\n' + document.documentElement.innerHTML;
                        });

                    case 8:
                        return _context3.abrupt('return', _context3.sent);

                    case 11:
                        _context3.prev = 11;
                        _context3.t0 = _context3['catch'](2);

                        end();
                        debug(_context3.t0);
                        return _context3.abrupt('return', _promise2.default.reject(_context3.t0));

                    case 16:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this, [[2, 11]]);
    }));

    return function getHTML(_x4) {
        return _ref3.apply(this, arguments);
    };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('scavenger:webdriver');
var nightmare = require('./nightmare');

module.exports = {
    load: load,
    end: end,
    waitForElement: waitForElement,
    getScreenshot: getScreenshot,
    getHTML: getHTML,
    isLoaded: isLoaded,
    goto: goto
};

function load(url, waitMs, debugMode) {
    nightmare.init(debugMode);
}

function goto(url, waitMs) {
    debug('goto: ' + url);
    return nightmare.get().goto(url).wait(waitMs).catch(function (err) {
        debug(err);
        end();
        if (!(err instanceof Error) && err.details) {
            return _promise2.default.reject(new Error(err.message + ': ' + err.details));
        }
        return _promise2.default.reject(err);
    });
}

function end() {
    return nightmare.end();
}

function isLoaded() {
    return nightmare.isLoaded();
}

function hideScrollbar(done) {
    if (document.readyState === "complete") {
        run();
        done();
    } else {
        document.addEventListener("DOMContentLoaded", function (event) {
            run();
            done();
        });
    }

    function run() {
        var sheet = function () {
            var style = document.createElement("style");
            style.appendChild(document.createTextNode(""));
            document.head.appendChild(style);
            return style.sheet;
        }();
        sheet.insertRule('::-webkit-scrollbar { width: 0 !important; display: none; }', 0);
    }
}

function getPageDimensions() {
    var body = document.querySelector('body');
    return {
        height: body.scrollHeight,
        width: body.scrollWidth
    };
}

function evalFn(fnString) {
    return eval('(' + fnString + ')');
}
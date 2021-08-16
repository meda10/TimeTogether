(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process){(function (){
'use strict'

// require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

const anniversary = new Date('Aug 17, 2017 15:00:00');
let next_anniversary = new Date('Aug 17, 2021 15:00:00');
let time_to_send_msg = new Date('Jul 25, 2021 14:26:05');
const secondsInADay = 60 * 60 * 1000 * 24;
const secondsInAHour = 60 * 60 * 1000;
const secondsInAMins = 60 * 1000;
const count_up_id = 'countup1';
const count_down_id = 'anniversary';
const count_up_id_times = 'time_only';

window.onload = function() {
  // setTimeout(sendMessage, timeToSendMessage);
  countUpFromTime(anniversary);
  countDownToTime(next_anniversary);
};

function check_date(now, date){
  return now.getFullYear() === date.getFullYear() &&
    now.getMonth() === date.getMonth() &&
    now.getDate() === date.getDate() &&
    now.getHours() === date.getHours() &&
    now.getMinutes() === date.getMinutes() &&
    now.getSeconds() === date.getSeconds();
}

function get_time(timeDifference) {
  let days = Math.floor(timeDifference / (secondsInADay));
  let years = Math.floor(days / 365);
  if (years > 1){
    days = days - (years * 365);
  }
  let hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour));
  let minutes = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / secondsInAMins);
  let seconds = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % secondsInAMins) / 1000);

  console.log(authToken)

  return {years, days, hours, minutes, seconds};
}

function countUpFromTime(countFrom) {
  let now = new Date();
  let timeDifference = (now - countFrom);
  let { years, days, hours, minutes, seconds } = get_time(timeDifference);

  let id_times = document.getElementById(count_up_id_times);
  id_times.getElementsByClassName('days_only')[0].innerHTML = String(Math.floor(timeDifference / secondsInADay));
  id_times.getElementsByClassName('hours_only')[0].innerHTML = String(Math.floor(timeDifference / secondsInAHour));
  id_times.getElementsByClassName('minutes_only')[0].innerHTML = String(Math.floor(timeDifference / secondsInAMins));
  id_times.getElementsByClassName('seconds_only')[0].innerHTML = String(Math.floor(timeDifference / 1000));

  let idEl = document.getElementById(count_up_id);
  idEl.getElementsByClassName('years')[0].innerHTML = String(years);
  idEl.getElementsByClassName('days')[0].innerHTML = String(days);
  idEl.getElementsByClassName('hours')[0].innerHTML = String(hours);
  idEl.getElementsByClassName('minutes')[0].innerHTML = String(minutes);
  idEl.getElementsByClassName('seconds')[0].innerHTML = String(seconds);

  clearTimeout(countUpFromTime.interval);
  countUpFromTime.interval = setTimeout(function(){ countUpFromTime(countFrom); }, 1000);
}

function countDownToTime(countTo) {
  let now = new Date();
  if (now > countTo){
    next_anniversary.setFullYear(next_anniversary.getFullYear() + 1)
    // countTo.setFullYear(countTo.getFullYear() + 1)
  }
  let { years, days, hours, minutes, seconds } = get_time(countTo - now);

  let idEl = document.getElementById(count_down_id);
  idEl.getElementsByClassName('days')[0].innerHTML = String(days);
  idEl.getElementsByClassName('hours')[0].innerHTML = String(hours);
  idEl.getElementsByClassName('minutes')[0].innerHTML = String(minutes);
  idEl.getElementsByClassName('seconds')[0].innerHTML = String(seconds);

  if (check_date(now, time_to_send_msg)){
    //send message
    //increment date
    console.log("AAA");
    // client.messages.create({
    //     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
    //     from: '+15017122661',
    //     to: '+15558675310'
    //   }).then(message => console.log(message.sid));
  }

  clearTimeout(countDownToTime.interval);
  countDownToTime.interval = setTimeout(function(){ countDownToTime(countTo); },1000);
}

// function sendMessage() {
//   alert("The time is 9:36 AM");
//   console.log(timeToSendMessage);
// }

$("#fullview").fullView({
  dots:  true,
  dotsPosition:  'right',
})

}).call(this)}).call(this,require('_process'))
},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1]);

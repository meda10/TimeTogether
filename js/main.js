'use strict'

const anniversary = new Date('Aug 17, 2017 15:00:00');
let next_anniversary = new Date('Aug 17, 2021 15:00:00');
let time_to_send_msg = new Date('Aug 16, 2021 20:16:30');
const secondsInADay = 60 * 60 * 1000 * 24;
const secondsInAHour = 60 * 60 * 1000;
const secondsInAMins = 60 * 1000;
const count_up_id = 'countup1';
const count_down_id = 'anniversary';
const count_up_id_times = 'time_only';
let leap_years = [2020, 2024, 2028, 2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060, 2064, 2068, 2072, 2076, 2080, 2084, 2088, 2092, 2096, 2104, 2108];

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

function get_time(now, timeDifference) {
  let days = Math.floor(timeDifference / (secondsInADay));
  let years = Math.floor(days / 365);
  let leep = 0;
  if (years > 1){
    for(const year of leap_years){
      if(now.getFullYear() >= year){
        leep += 1;
      }
    }
    years = Math.floor(leep + (days - (leep * 366)) / 365);
    days = Math.floor(days - (leep * 366 + ((years - leep) * 365)));
  }
  let hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour));
  let minutes = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / secondsInAMins);
  let seconds = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % secondsInAMins) / 1000);
  return {years, days, hours, minutes, seconds};
}

function countUpFromTime(countFrom) {
  let now = new Date();
  let timeDifference = (now - countFrom);
  let { years, days, hours, minutes, seconds } = get_time(now, timeDifference);

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
  let { years, days, hours, minutes, seconds } = get_time(now,countTo - now);

  let idEl = document.getElementById(count_down_id);
  idEl.getElementsByClassName('days')[0].innerHTML = String(days);
  idEl.getElementsByClassName('hours')[0].innerHTML = String(hours);
  idEl.getElementsByClassName('minutes')[0].innerHTML = String(minutes);
  idEl.getElementsByClassName('seconds')[0].innerHTML = String(seconds);

  if (check_date(now, time_to_send_msg)){

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

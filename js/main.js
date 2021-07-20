window.onload = function() {
  // Month Day, Year Hour:Minute:Second, id-of-element-container
  countUpFromTime("Aug 17, 2017 15:00:00", 'countup1'); // ****** Change this line!
};

function countUpFromTime(countFrom, id) {
  countFrom = new Date(countFrom).getTime();
  let now = new Date();
  countFrom = new Date(countFrom);
  let timeDifference = (now - countFrom);
  let secondsInADay = 60 * 60 * 1000 * 24;
  let secondsInAHour = 60 * 60 * 1000;

  let days = Math.floor(timeDifference / (secondsInADay));
  let years = Math.floor(days / 365);
  if (years > 1){
    days = days - (years * 365)
  }
  let hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour));
  let mins = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / (60 * 1000));
  let secs = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % (60 * 1000)) / 1000);

  let idEl = document.getElementById(id);
  idEl.getElementsByClassName('years')[0].innerHTML = String(years);
  idEl.getElementsByClassName('days')[0].innerHTML = String(days);
  idEl.getElementsByClassName('hours')[0].innerHTML = String(hours);
  idEl.getElementsByClassName('minutes')[0].innerHTML = String(mins);
  idEl.getElementsByClassName('seconds')[0].innerHTML = String(secs);

  clearTimeout(countUpFromTime.interval);
  countUpFromTime.interval = setTimeout(function(){ countUpFromTime(countFrom, id); }, 1000);
}

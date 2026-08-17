import { 
  intervalToDuration, 
  differenceInDays, 
  differenceInHours, 
  differenceInMinutes, 
  differenceInSeconds, 
  differenceInYears,
  addYears,
  setYear
} from 'date-fns';

// Define multiple anniversaries, each mapped to its unique page/section selectors
const anniversaries = [
  {
    id: 'anniv1',
    baseDate: new Date('Aug 17, 2017 15:00:00'),
    countUps: {
      timeOnly: '#time_only_1',
      breakdown: '#countup_1'
    },
    countdown: '#anniversary_1'
  },
  {
    id: 'anniv2',
    baseDate: new Date('May 10, 2025 14:00:00'),
    countUps: {
      timeOnly: '#time_only_2',
      breakdown: '#countup_2'
    },
    countdown: '#anniversary_2'
  }
];

// Helper function utilizing date-fns to handle Feb 29 gracefully (defaults to Feb 28 on non-leap years)
function getNextAnniversary(baseDate, now = new Date()) {
  let next = setYear(baseDate, now.getFullYear());
  
  // If this year's anniversary has already passed, target next year
  if (now > next) {
    next = addYears(next, 1);
  }
  return next;
}

function updateTimers() {
  const now = new Date();

  anniversaries.forEach(item => {
    const anniversary = item.baseDate;

    // ====================
    // 1. COUNT UP TIMER
    // ====================
    
    // TIME ONLY (Total Differences)
    const timeOnlyEl = document.querySelector(item.countUps.timeOnly);
    if (timeOnlyEl) {
      timeOnlyEl.querySelector('.days_only').textContent = differenceInDays(now, anniversary);
      timeOnlyEl.querySelector('.hours_only').textContent = differenceInHours(now, anniversary);
      timeOnlyEl.querySelector('.minutes_only').textContent = differenceInMinutes(now, anniversary);
      timeOnlyEl.querySelector('.seconds_only').textContent = differenceInSeconds(now, anniversary);
    }

    // BREAKDOWN (Years, Days, Hours, Mins, Secs)
    const countupEl = document.querySelector(item.countUps.breakdown);
    if (countupEl) {
      // Calculate total years passed
      const passedYears = differenceInYears(now, anniversary);
      // Create a temporary date shifted by those exact years to find the remaining days
      const dateAfterYears = addYears(anniversary, passedYears);
      const passedDays = differenceInDays(now, dateAfterYears);
      
      // Calculate the remaining time units
      const passedHours = differenceInHours(now, dateAfterYears) % 24;
      const passedMinutes = differenceInMinutes(now, dateAfterYears) % 60;
      const passedSeconds = differenceInSeconds(now, dateAfterYears) % 60;

      countupEl.querySelector('.years').textContent = passedYears;
      countupEl.querySelector('.days').textContent = passedDays;
      countupEl.querySelector('.hours').textContent = passedHours;
      countupEl.querySelector('.minutes').textContent = passedMinutes;
      countupEl.querySelector('.seconds').textContent = passedSeconds;
    }

    // ====================
    // 2. COUNT DOWN TIMER
    // ====================
    const nextAnniversary = getNextAnniversary(anniversary, now);

    const countdownEl = document.querySelector(item.countdown);
    if (countdownEl) {
      const totalDays = differenceInDays(nextAnniversary, now);
      const totalHours = differenceInHours(nextAnniversary, now) % 24;
      const totalMinutes = differenceInMinutes(nextAnniversary, now) % 60;
      const totalSeconds = differenceInSeconds(nextAnniversary, now) % 60;

      const daysEl = countdownEl.querySelector('.days');
      const hoursEl = countdownEl.querySelector('.hours');
      const minutesEl = countdownEl.querySelector('.minutes');
      const secondsEl = countdownEl.querySelector('.seconds');

      if (daysEl) daysEl.textContent = totalDays;
      if (hoursEl) hoursEl.textContent = totalHours;
      if (minutesEl) minutesEl.textContent = totalMinutes;
      if (secondsEl) secondsEl.textContent = totalSeconds;
    }
  });
}

window.onload = function() {
  // Run once immediately, then every second
  updateTimers();
  setInterval(updateTimers, 1000);

  // Initialize FullView plugin across multiple pages/sections
  if (window.jQuery) {
    window.jQuery("#fullview").fullView({
      dots: true,
      dotsPosition: 'right',
    });
  }
};
import { setClock } from "../main-page/clock.js";

setInterval(setClock, 1000);
setClock();

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

const hoursInput = document.querySelector('.hours-input');
    const minutesInput = document.querySelector('.minutes-input');
    const secondsInput = document.querySelector('.seconds-input');

    const timeText = document.querySelector('.time-text');
    const ring = document.querySelector('.progress-ring-circle');
    const alarm = document.getElementById('alarm-audio');

    const startBtn = document.querySelector('.start-button');
    const pauseBtn = document.querySelector('.pause-button');
    const resumeBtn = document.querySelector('.resume-button');
    const resetBtn = document.querySelector('.reset-button');

    let totalTime = 0;
    let currentTime = 0;
    let interval = null;
    let isPaused = false;

    const RADIUS = 90;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    ring.style.strokeDasharray = `${CIRCUMFERENCE}`;
    ring.style.strokeDashoffset = 0;

    function formatTime(sec) {
      const h = String(Math.floor(sec / 3600)).padStart(2, '0');
      const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
      const s = String(sec % 60).padStart(2, '0');
      return `${h}:${m}:${s}`;
    }

    function updateRing() {
      const progress = currentTime / totalTime;
      const offset = CIRCUMFERENCE * (1 - progress);
      ring.style.strokeDashoffset = offset;
      timeText.textContent = formatTime(currentTime);
    }

    function startTimer() {
      const hrs = parseInt(hoursInput.value) || 0;
      const min = parseInt(minutesInput.value) || 0;
      const sec = parseInt(secondsInput.value) || 0;
      totalTime = hrs * 3600 + min * 60 + sec;

      if (totalTime <= 0) {
        alert("Please enter a valid time.");
        return;
      }

      currentTime = totalTime;
      updateRing();

      startBtn.style.display = 'none';
      pauseBtn.style.display = 'inline-block';
      resetBtn.style.display = 'inline-block';

      interval = setInterval(() => {
        if (!isPaused && currentTime > 0) {
          currentTime--;
          updateRing();

          if (currentTime === 0) {
            clearInterval(interval);
            ring.style.strokeDashoffset = 0;
            timeText.textContent = "00:00:00";
            alarm.play();
            alert("⏰ Time's up!");
            resetTimer();
          }
        }
      }, 1000);
    }

    function pauseTimer() {
      isPaused = true;
      pauseBtn.style.display = 'none';
      resumeBtn.style.display = 'inline-block';
    }

    function resumeTimer() {
      isPaused = false;
      resumeBtn.style.display = 'none';
      pauseBtn.style.display = 'inline-block';
    }

    function resetTimer() {
      clearInterval(interval);
      interval = null;
      currentTime = 0;
      isPaused = false;

      ring.style.strokeDashoffset = 0;
      timeText.textContent = "00:00:00";

      startBtn.style.display = 'inline-block';
      pauseBtn.style.display = 'none';
      resumeBtn.style.display = 'none';
      resetBtn.style.display = 'none';

      hoursInput.value = '';
      minutesInput.value = '';
      secondsInput.value = '';
    }

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resumeBtn.addEventListener('click', resumeTimer);
    resetBtn.addEventListener('click', resetTimer);
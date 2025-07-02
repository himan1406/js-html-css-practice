import { setClock } from "../main-page/clock.js";

setInterval(setClock, 1000);
setClock();

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isPaused = false;
let laps = [];

const display = document.querySelector('.time-container');
const controls = document.querySelector('.controls');
const lapList = document.querySelector('.lap-list');

function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const hrs = String(Math.floor(total / 3600)).padStart(2, '0');
  const mins = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const secs = String(total % 60).padStart(2, '0');
  const msec = String(ms % 1000).padStart(3, '0');
  return `${hrs}:${mins}:${secs}.${msec}`;
}

function updateDisplay() {
  display.textContent = formatTime(elapsedTime);
}

function start() {
  if (timerInterval) return;
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
  }, 10);
  showActionButtons();
}

function pause() {
  clearInterval(timerInterval);
  timerInterval = null;
  isPaused = true;
  showResumeButtons();
}

function resume() {
  start();
  isPaused = false;
}

function reset() {
  clearInterval(timerInterval);
  timerInterval = null;
  elapsedTime = 0;
  isPaused = false;
  updateDisplay();
  laps = [];
  lapList.innerHTML = '';
  localStorage.removeItem('laps');
  renderInitialUI();
}

function addLap() {
  const lapTime = formatTime(elapsedTime);
  laps.push(lapTime);

  const li = document.createElement('li');
  li.className = 'lap-text';
  li.textContent = `Lap ${laps.length}: ${lapTime}`;
  lapList.appendChild(li);

  localStorage.setItem('laps', JSON.stringify(laps));
}

function showActionButtons() {
  controls.innerHTML = `
    <button class="stop-button">Stop</button>
    <button class="reset-button">Reset</button>
    <button class="lap-button">Lap</button>
  `;

  document.querySelector('.stop-button').addEventListener('click', pause);
  document.querySelector('.reset-button').addEventListener('click', reset);
  document.querySelector('.lap-button').addEventListener('click', addLap);
}

function showResumeButtons() {
  controls.innerHTML = `
    <button class="resume-button">Resume</button>
    <button class="reset-button">Reset</button>
    <button class="lap-button">Lap</button>
  `;

  document.querySelector('.resume-button').addEventListener('click', resume);
  document.querySelector('.reset-button').addEventListener('click', reset);
  document.querySelector('.lap-button').addEventListener('click', addLap);
}

function renderInitialUI() {
  controls.innerHTML = `<button class="start-button">Start</button>`;
  document.querySelector('.start-button').addEventListener('click', start);
}

function restoreLaps() {
  const saved = localStorage.getItem('laps');
  if (saved) {
    laps = JSON.parse(saved);
    laps.forEach((lap, index) => {
      const li = document.createElement('li');
      li.className = 'lap-text';
      li.textContent = `Lap ${index + 1}: ${lap}`;
      lapList.appendChild(li);
    });
  }
}

window.addEventListener('load', () => {
  updateDisplay();
  renderInitialUI();
  restoreLaps();
});

lapList.querySelectorAll('.lap-text').forEach((li, index) => {
  setTimeout(() => {
    li.classList.add('removing');
  }, index * 50);
});
setTimeout(() => {
  lapList.innerHTML = '';
}, laps.length * 50 + 200);

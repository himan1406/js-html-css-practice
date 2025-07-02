import { setClock } from "../main-page/clock.js";

setInterval(setClock, 1000);
setClock();

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});


let alarms = JSON.parse(localStorage.getItem('alarms')) || [];

renderAlarms();

function renderAlarms() {
  let timeHTML = '';

  alarms.forEach((alarm) => {
    const { time } = alarm;
    const html = `
      <div class="time-list-item" data-time="${time}">${time}</div>
      <button class="delete-alarm-button js-delete-button" data-time="${time}">Delete</button>
    `;
    timeHTML += html;
  });

  document.querySelector('.js-alarm-list').innerHTML = timeHTML;
}

function addAlarm() {
  const inputElement = document.querySelector('.js-alarm-time');
  const time = inputElement.value;

  if (!time) {
    alert('Please enter a time!');
    return;
  }

  const exists = alarms.some(alarm => alarm.time === time);
  if (exists) {
    alert('Alarm for this time already exists!');
    return;
  }

  alarms.push({
    time: time,
    triggered: false
  });

  saveAlarms();
  renderAlarms();
  inputElement.value = '';
}

function deleteAlarm(index) {
  alarms.splice(index, 1);
  saveAlarms();
  renderAlarms();
}

function saveAlarms() {
  localStorage.setItem('alarms', JSON.stringify(alarms));
}

document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.js-set-alarm');
  button.addEventListener('click', addAlarm);

  const listContainer = document.querySelector('.js-alarm-list');
  listContainer.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('js-delete-button')) {
      const timeToDelete = target.getAttribute('data-time');
      const index = alarms.findIndex(alarm => alarm.time === timeToDelete);
      if (index !== -1) {
        deleteAlarm(index);
      }
    }
  });
});

setInterval(() => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);

  alarms.forEach((alarm) => {
    if (alarm.time === currentTime && !alarm.triggered) {
      alarm.triggered = true;
      saveAlarms();

      const audio = document.getElementById("alarm-audio");
      audio.play();

      alert("⏰ Alarm ringing!");
    }
  });
}, 1000);

"use strict";

// ==========================
// ELEMENTS
// ==========================

const startButton = document.querySelector(".js-start");
const resetButton = document.querySelector(".js-reset");
const clockface = document.querySelector(".js-time");

const lapButton = document.querySelector(".js-take-lap");
const action = document.querySelector(".action");

resetButton.disabled = true;
lapButton.disabled = true;

// ==========================
// OBJECT TIMER
// ==========================

const timer = {
  startTime: 0,
  deltaTime: 0,
  timerId: 0,
  isActive: false,

  start() {
    lapButton.disabled = false;
    resetButton.disabled = true;

    this.isActive = true;

    this.startTime = Date.now() - this.deltaTime;
    this.timerId = setInterval(() => {
      const currentTime = Date.now();
      this.deltaTime = currentTime - this.startTime;
      this.updateClockface(this.deltaTime);
    }, 100);
  },

  pause() {
    clearInterval(this.timerId);
    this.isActive = false;

    lapButton.disabled = true;
    resetButton.disabled = false;
  },

  reset() {
    this.pause();
    this.deltaTime = 0;
    this.updateClockface(this.deltaTime);

    document.querySelector(".js-laps").remove();

    resetButton.disabled = true;
  },

  updateClockface(ms) {
    clockface.textContent = this.formatTime(ms);
  },

  formatTime(time) {
    const date = new Date(time);

    let minutes = date.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    let seconds = date.getSeconds();
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    let mseconds = String(Math.round(date.getMilliseconds() / 100)).slice(0, 1);

    return `${minutes}:${seconds}:${mseconds}`;
  },

  getLap() {
    const lap = document.createElement("li");
    lap.textContent = this.formatTime(this.deltaTime);
    document.querySelector(".js-laps").append(lap);
  },

  createList() {
    const list = document.createElement("ul");
    list.classList.add("laps", "js-laps");
    action.after(list);
  }
};

// ==========================
// EVENTS
// ==========================

startButton.addEventListener("click", handleStartButtonClick);
resetButton.addEventListener("click", handleResetButtonClick);
lapButton.addEventListener("click", timer.getLap.bind(timer));

function handleStartButtonClick() {
  if (startButton.textContent === "Start") {
    timer.createList();
  }
  if (!timer.isActive) {
    timer.start();
    startButton.textContent = "Pause";
  } else {
    timer.pause();
    startButton.textContent = "Continue";
  }
}

function handleResetButtonClick() {
  timer.reset();
  startButton.textContent = "Start";
}

const starBtn = document.getElementById("start-btn");
const subContainer = document.getElementById("sub-container");
const ball = document.getElementById("ball");
const speedometer = document.getElementById("speedometer");
const distanceTracker = document.getElementById("distance-tracker");

let startInteval;
let bounceInterval;

let metersTravelled;
let ballHeight;
let velocity;

let velocityAfterBounce;

let fallingHeight = subContainer.getBoundingClientRect().top;

const pixelToMetersFactor = 15;
const bounceFactor = 0.75;

starBtn.addEventListener("click", () => {
  if (startInteval) clearInterval(startInteval);
  if (bounceInterval) clearInterval(bounceInterval);

  starBtn.innerText = "Restart";
  ballHeight = subContainer.getBoundingClientRect().top;
  let oneHundrethOfSecond = 0;

  startInteval = setInterval(() => {
    console.log("Start interval...");
    oneHundrethOfSecond++;

    ball.style.top =
      ballHeight + getFallenDistanceInMeters(oneHundrethOfSecond) + "px";

    if (
      ball.getBoundingClientRect().bottom >
      subContainer.getBoundingClientRect().bottom
    ) {
      velocityAfterBounce = velocity * bounceFactor;
      startBounce();
      clearInterval(startInteval);
    }
  }, 10);
});

//! Velocity Calculation for free fall over time is like this: 1/2 * 9.8 [m/s²] * seconds = velocity [m/s]

function getFallenDistanceInMeters(oneHundrethOfSecond) {
  velocity = 9.81 * (oneHundrethOfSecond / 100);
  speedometer.innerText = "Velocity [m/s]: " + Math.floor(velocity);

  metersTravelled =
    (1 / 2) * velocity * (oneHundrethOfSecond / 100) * pixelToMetersFactor;
  //console.log("Meters travelled " + metersTravelled + " [m]");

  distanceTracker.innerText =
    "Distance → ceiling [m]: " + Math.floor(metersTravelled);

  return metersTravelled;
}

function startBounce() {
  if (velocityAfterBounce < 1) {
    console.log("Velocity to small!");
    return;
  }
  let oneHundrethOfSecond = 0;

  bounceInterval = setInterval(() => {
    oneHundrethOfSecond++;

    ball.style.top =
      subContainer.getBoundingClientRect().bottom -
      ball.getBoundingClientRect().height -
      getMeters(oneHundrethOfSecond) +
      "px";
  }, 10);
}

function getMeters(oneHundrethOfSecond) {
  const seconds = oneHundrethOfSecond / 100;
  velocity = velocityAfterBounce - 9.81 * seconds;

  speedometer.innerText = "Velocity [m/s]: " + Math.floor(velocity);

  const meters =
    (-9.81 * (1 / 2) * seconds * seconds + velocityAfterBounce * seconds) *
    pixelToMetersFactor;

  distanceTracker.innerText = "Distance →  floor [m]: " + Math.floor(meters);

  if (meters <= 0) {
    console.log(velocityAfterBounce);
    clearInterval(bounceInterval);

    velocityAfterBounce = -velocity * bounceFactor;
    startBounce();
    return 0;
  }
  return meters;
}

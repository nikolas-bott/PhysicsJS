const starBtn = document.getElementById("start-btn");
const subContainer = document.getElementById("sub-container");
const ball = document.getElementById("ball");
const speedometer = document.getElementById("speedometer");
const distanceTracker = document.getElementById("distance-tracker");

let currentInterval;
let metersTravelled;
let ballHeight;
let velocity;

starBtn.addEventListener("click", () => {
  if (currentInterval) clearInterval(currentInterval);

  starBtn.innerText = "Restart";
  ballHeight = subContainer.getBoundingClientRect().top;
  let oneHundrethOfSecond = 0;

  currentInterval = setInterval(() => {
    if (
      ball.getBoundingClientRect().bottom >
      subContainer.getBoundingClientRect().bottom
    ) {
      clearInterval(currentInterval);
    }

    oneHundrethOfSecond++;

    ball.style.top =
      ballHeight + getFallenDistanceInMeters(oneHundrethOfSecond) + "px";
  }, 10);
});

//! Velocity Calculation for free fall over time is like this: 1/2 * 9.8 [m/s²] * seconds = velocity [m/s]

function getFallenDistanceInMeters(oneHundrethOfSecond) {
  velocity = 9.81 * (oneHundrethOfSecond / 100);
  speedometer.innerText = "Speed in m/s: " + Math.floor(velocity);

  metersTravelled = (1 / 2) * velocity * (oneHundrethOfSecond / 100);
  console.log("Meters travelled " + metersTravelled + " [m]");

  distanceTracker.innerText =
    "Distance Travelled in m: " + Math.floor(metersTravelled);

  return metersTravelled;
}

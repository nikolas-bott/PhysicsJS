const starBtn = document.getElementById("start-btn");
const subContainer = document.getElementById("sub-container");
const ball = document.getElementById("ball");
const speedometer = document.getElementById("speedometer");
const distanceTracker = document.getElementById("distance-tracker");
const ratioSlider = document.getElementById("pixel-meter-ratio");
const pixelToMetersText = document.getElementById("pixel-to-meter");
const bounceFactorSlider = document.getElementById("bounce-factor");
const bounceFactorText = document.getElementById("bFactor");
const stormFactorText = document.getElementById("stormFactor");
const stormFactorSlider = document.getElementById("storm-factor");

const windContainer = document.querySelector(".wind-container");
const numParticles = 10; // You can adjust the number of particles

let startInterval;
let bounceInterval;
let stormInterval;

let metersTravelled;
let ballHeight;
let downwardsVelocity;

let velocityAfterBounce;

let fallingHeight = subContainer.getBoundingClientRect().top;

let pixelToMetersFactor = 0.35;
let stormSpeed = 0;
let bounceFactor = 0.75;
const weightOfBallInKg = 2;
const ballWidthInPx = 20;

starBtn.addEventListener("click", () => {
  resetBall();

  addStorm();

  starBtn.innerText = "Restart";
  ballHeight = subContainer.getBoundingClientRect().top;
  let oneHundrethOfSecond = 0;

  startInterval = setInterval(() => {
    oneHundrethOfSecond++;

    ball.style.top =
      ballHeight + getFallenDistanceInMeters(oneHundrethOfSecond) + "px";

    if (
      ball.getBoundingClientRect().bottom >
      subContainer.getBoundingClientRect().bottom
    ) {
      velocityAfterBounce = downwardsVelocity * bounceFactor;
      startBounce();
      clearInterval(startInterval);
    }
  }, 10);
});

ratioSlider.oninput = function () {
  pixelToMetersFactor = this.value / 100;
  resetBall();

  pixelToMetersText.innerText = "1m = " + pixelToMetersFactor + "px";
};

bounceFactorSlider.oninput = function () {
  bounceFactor = this.value / 100;
  bounceFactor = bounceFactor.toFixed(2);
  resetBall();

  bounceFactorText.innerText = "Bounce Factor: " + bounceFactor + "x";
};

stormFactorSlider.oninput = function () {
  stormSpeed = this.value;
  resetBall();

  stormFactorText.innerText = "Storm speed: " + stormSpeed + " [m/s]";
};

//! Velocity Calculation for free fall over time is like this: 1/2 * 9.8 [m/s²] * seconds = velocity [m/s]

function getFallenDistanceInMeters(oneHundrethOfSecond) {
  downwardsVelocity = 9.81 * (oneHundrethOfSecond / 100);
  speedometer.innerText = "Velocity [m/s]: " + Math.floor(downwardsVelocity);

  metersTravelled =
    ((1 / 2) * downwardsVelocity * (oneHundrethOfSecond / 100)) /
    pixelToMetersFactor;
  //console.log("Meters travelled " + metersTravelled + " [m]");

  distanceTracker.innerText =
    "Distance → ceiling [m]: " + Math.floor(metersTravelled);

  return metersTravelled;
}

function startBounce() {
  if (velocityAfterBounce < 0.4) {
    downwardsVelocity = 0;

    speedometer.innerText = "Velocity [m/s]: " + Math.floor(downwardsVelocity);
    distanceTracker.innerText = "Distance →  floor [m]: " + Math.floor(0);

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
  downwardsVelocity = velocityAfterBounce - 9.81 * seconds;

  speedometer.innerText = "Velocity [m/s]: " + Math.floor(downwardsVelocity);

  const meters =
    (-9.81 * (1 / 2) * seconds * seconds + velocityAfterBounce * seconds) /
    pixelToMetersFactor;

  distanceTracker.innerText = "Distance →  floor [m]: " + Math.floor(meters);

  if (meters <= 0) {
    console.log(velocityAfterBounce);
    clearInterval(bounceInterval);

    velocityAfterBounce = -downwardsVelocity * bounceFactor;
    startBounce();
    return 0;
  }
  return meters;
}

function addStorm() {
  let millisecond = 0;
  const orignalPosOfBall =
    (subContainer.getBoundingClientRect().right +
      subContainer.getBoundingClientRect().left) /
    2;

  console.log(orignalPosOfBall);

  stormInterval = setInterval(() => {
    // if (
    //   ball.getBoundingClientRect().left <=
    //   subContainer.getBoundingClientRect().left
    // ) {
    //   resetBall();
    //   return;
    // }
    console.log();
    millisecond++;
    const metersTravelled =
      ((millisecond / 1000) * stormSpeed) / pixelToMetersFactor;

    ball.style.left = orignalPosOfBall + metersTravelled + "px";
  }, 1);
}

function resetBall() {
  if (stormInterval) clearInterval(stormInterval);
  if (startInterval) clearInterval(startInterval);
  if (bounceInterval) clearInterval(bounceInterval);

  const horizontalPosOfBall =
    (subContainer.getBoundingClientRect().right +
      subContainer.getBoundingClientRect().left) /
    2;

  const vertivalPosOfBall = subContainer.getBoundingClientRect().top;

  ball.style.left = horizontalPosOfBall + "px";
  ball.style.top = vertivalPosOfBall + "px";
}

// function getAirRessistanceAcc(oneHundrethOfSecond) {
//Formula: Force [N] = (1/2) * drag coefficent (for a sphere its 0.47, for a cube 1.05) * 1.225 [kg/m³] * A [m²] * v² [m/s]

//   //Formula for are of a ball A = pi * r²
//   const ballRadiusInMeters = ballWidthInPx / pixelToMetersFactor / 2;
//   const area = Math.PI * ballRadiusInMeters ** 2;
//   const force = (1 / 2) * 0.47 * 1.225 * area * velocity * velocity;

//   const deceleration = force / weightOfBallInKg;
//   const totalDec = 9.81 - deceleration;

//   const velo = totalDec * (oneHundrethOfSecond / 100);

//   console.log("Velocity: " + velo);
// }

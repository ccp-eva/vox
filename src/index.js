import getGazeCoords from './js/getGazeCoords';
import randomNumber from './js/randomNumber';
import shuffleArray from './js/shuffleArray';
import animateViewBox from './js/animateViewBox';
import animateCoord from './js/animateCoord';
import showElement from './js/showElement';
import divideWithRemainder from './js/divideWithRemainder';
import getEyeCenter from './js/getEyeCenter';
import setEyeCenter from './js/setEyeCenter';
import setTargetCenter from './js/setTargetCenter';
import clickDistanceFromTarget from './js/clickDistanceFromTarget';

// TODO balloon flugbahn flüssig animieren

// ---------------------------------------------------------------------------------------------------------------------
// SVG & SCREEN SIZE

// TODO find more elegant solution to tell user to view on fullscreen
// if (clientWidth < 600 || clientHeight < 200) alert('Please view on bigger screen!');
// ---------------------------------------------------------------------------------------------------------------------
const { offsetWidth } = document.body;
const { offsetHeight } = document.body;
console.log('client browser size', { offsetWidth, offsetHeight });

// get viewBox size from whole SVG
const outerSVG = document.getElementById('outer-svg');
const origViewBoxX = parseFloat(outerSVG.getAttribute('viewBox').split(' ')[0]);
const origViewBoxY = parseFloat(outerSVG.getAttribute('viewBox').split(' ')[1]);
const origViewBoxWidth = parseFloat(outerSVG.getAttribute('viewBox').split(' ')[2]);
const origViewBoxHeight = parseFloat(outerSVG.getAttribute('viewBox').split(' ')[3]);
console.log('viewbox size', {
  origViewBoxX, origViewBoxY, origViewBoxWidth, origViewBoxHeight,
});

// ---------------------------------------------------------------------------------------------------------------------
// GET ALL RELEVANT ELEMENTS IN SVG
// ---------------------------------------------------------------------------------------------------------------------
const button = document.getElementById('button');
button.setAttribute('visibility', 'hidden');

// if you change animal agents or targets, then change ID here...
const pig = document.getElementById('pig');
const monkey = document.getElementById('monkey');
const sheep = document.getElementById('sheep');

// hide all in beginning
[pig, monkey, sheep].forEach((agent) => {
  agent.setAttribute('visibility', 'hidden');
});

// save the original position of the eyes of agents
const agentsNames = ['pig', 'monkey', 'sheep'];
const eyeCenters = [];
for (let i = 0; i < agentsNames.length; i++) {
  eyeCenters[`${agentsNames[i]}`] = {
    left: getEyeCenter(document.getElementById(`${agentsNames[i]}-pupil-left`)),
    right: getEyeCenter(document.getElementById(`${agentsNames[i]}-pupil-right`)),
  };
}

// NOTE: we believe that all target objects are the same size here!!
const balloonBlue = document.getElementById('balloon-blue');
const balloonRed = document.getElementById('balloon-red');
const balloonYellow = document.getElementById('balloon-yellow');
const balloonGreen = document.getElementById('balloon-green');

// hide all in beginning
[balloonBlue, balloonRed, balloonYellow, balloonGreen].forEach((target) => {
  target.setAttribute('visibility', 'hidden');
});

// get position on the very right (as constraint) and mid of the screen
const targetPositionRight = origViewBoxWidth - balloonBlue.getBBox().width;
const targetPositionMid = origViewBoxWidth / 2 - balloonBlue.getBBox().width / 2;
// eslint-disable-next-line max-len
const targetViewBoxCenter = `-${targetPositionMid} -${origViewBoxHeight / 2.8} ${origViewBoxWidth} ${origViewBoxHeight}`;

// calculate from which coordinates the balloons are hidden behind the hedge
const hedgeback = document.getElementById('hedgeback');
// eslint-disable-next-line max-len
const targetViewBoxHidden = `-${targetPositionMid} -${origViewBoxHeight - hedgeback.getAttribute('height')} ${origViewBoxWidth} ${origViewBoxHeight}`;

// get hedge and middle Y of it
const hedge = document.getElementById('hedge');
// take y coordinate of hedge + half of the height. Then, subtract half of the balloon height.
const hedgeMidY = hedge.getBBox().y + hedge.getBBox().height / 2 - balloonBlue.getBBox().height / 2;

// ---------------------------------------------------------------------------------------------------------------------
// TRIAL NUMBER & RANDOMIZATION
// ---------------------------------------------------------------------------------------------------------------------
// trialType saves whether we want to display hedge (test) or not (fam)
// first new Array() number specifies how many fam trials, second how many test trials
// instead of trialNumber: trialType.length specifies our number of trials!
const famNr = 5;
const testNr = 0;
const trialType = [].concat(new Array(famNr).fill('fam'), new Array(testNr).fill('test'));

// calculate how many times each agent should be repeated, based on trialNumber
const agentsDiv = divideWithRemainder(trialType.length, agentsNames.length);

let agents = shuffleArray([]
  .concat(new Array(agentsDiv.quotient).fill(pig),
    new Array(agentsDiv.quotient).fill(sheep),
    new Array(agentsDiv.quotient).fill(monkey)));

// if our trialNumber is not divisable by number of agents, put random agents for remainder number:
// create random array with agents
// keep only as many entries in array as we need (remove rest)
// combine with list of repeated agents
if (agentsDiv.remainder > 0) {
  const agentsTmp = shuffleArray([pig, sheep, monkey]);
  agentsTmp.splice(0, agentsTmp.length - agentsDiv.remainder);
  agents = agents.concat(agentsTmp);
}
console.log('agents', agents);

// SAME FOR TARGET
const targetsNr = 4; // here, save number of balloons
const targetsDiv = divideWithRemainder(trialType.length, targetsNr);

let targets = shuffleArray([]
  .concat(new Array(targetsDiv.quotient).fill(balloonRed),
    new Array(targetsDiv.quotient).fill(balloonBlue),
    new Array(targetsDiv.quotient).fill(balloonYellow),
    new Array(targetsDiv.quotient).fill(balloonGreen)));

if (targetsDiv.remainder > 0) {
  const targetsTmp = shuffleArray([balloonRed, balloonBlue, balloonYellow, balloonGreen]);
  targetsTmp.splice(0, targetsTmp.length - targetsDiv.remainder);
  targets = targets.concat(targetsTmp);
}
console.log('targets', targets);

// ---------------------------------------------------------------------------------------------------------------------
// CALCULATE POSITIONS OF TARGET
// TODO function for this?
// TODO pick random so viele sections aus sectionArray wie trialNumbers
// ---------------------------------------------------------------------------------------------------------------------
// range of possible values to move the target: 0 - targetPositionRight. divide this range into ten
// for each of these ten categories, pick a random number for each trial
const section1 = { min: 0, max: targetPositionRight / 10 };
const section2 = { min: section1.max, max: (targetPositionRight / 10) * 2 };
const section3 = { min: section2.max, max: (targetPositionRight / 10) * 3 };
const section4 = { min: section3.max, max: (targetPositionRight / 10) * 4 };
const section5 = { min: section4.max, max: (targetPositionRight / 10) * 5 };
const section6 = { min: section5.max, max: (targetPositionRight / 10) * 6 };
const section7 = { min: section6.max, max: (targetPositionRight / 10) * 7 };
const section8 = { min: section7.max, max: (targetPositionRight / 10) * 8 };
const section9 = { min: section8.max, max: (targetPositionRight / 10) * 9 };
const section10 = { min: section9.max, max: targetPositionRight };

// eslint-disable-next-line max-len
const sectionArray = shuffleArray([section1, section2, section3, section4, section5, section6, section7, section8, section9, section10]);
console.log('sectionArray', sectionArray);

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR BREAK
// ---------------------------------------------------------------------------------------------------------------------
async function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR BEGINNING NEW TRIAL (back to starting point)
//
// TODO function needed for showing/hiding hedge? or okay here?
// ---------------------------------------------------------------------------------------------------------------------
// NOTE: async functions return promise, so we can wait for them (await)
async function startTrial(agents, trialCount) {
  const currentAgent = `${agents[trialCount].getAttribute('id')}`;

  // show agent and target of the current trial only, hide the other ones
  showElement(agents, trialCount);
  showElement(targets, trialCount);

  const pupilLeft = document.getElementById(`${currentAgent}-pupil-left`);
  const pupilRight = document.getElementById(`${currentAgent}-pupil-right`);
  const irisLeft = document.getElementById(`${currentAgent}-iris-left`);
  const irisRight = document.getElementById(`${currentAgent}-iris-right`);

  // get the center/ middle position of eye of currentAgent
  const midEyeLeft = { x: eyeCenters[`${currentAgent}`].left.x, y: eyeCenters[`${currentAgent}`].left.y };
  const midEyeRight = { x: eyeCenters[`${currentAgent}`].right.x, y: eyeCenters[`${currentAgent}`].right.y };

  // set target to center
  setTargetCenter(targets[trialCount], targetViewBoxCenter);
  targets[trialCount].setAttribute('viewBox', targetViewBoxCenter);

  // set eyes to center
  setEyeCenter(pupilLeft, midEyeLeft);
  setEyeCenter(pupilRight, midEyeRight);
  setEyeCenter(irisLeft, midEyeLeft);
  setEyeCenter(irisRight, midEyeRight);

  pupilLeft.setAttribute('cx', midEyeLeft.x);
  pupilLeft.setAttribute('cy', midEyeLeft.y);
  pupilRight.setAttribute('cx', midEyeLeft.x);
  pupilRight.setAttribute('cy', midEyeLeft.y);
  irisLeft.setAttribute('cx', midEyeLeft.x);
  irisLeft.setAttribute('cy', midEyeLeft.y);
  irisRight.setAttribute('cx', midEyeLeft.x);
  irisRight.setAttribute('cy', midEyeLeft.y);

  // depending on trial type, show or hide hedge
  if (trialType[trialCount] === 'fam') {
    hedge.setAttribute('visibility', 'hidden');
  } else if (trialType[trialCount] === 'test') {
    hedge.setAttribute('visibility', 'visible');
  }

  // always start the target in the middle again
  targets[trialCount].setAttribute('viewBox', `${targetViewBoxCenter}`);
}

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR CHANGING GAZE
//
// TODO might need to add target as function argument
// TODO ${agents[trialCount].getAttribute('id')} for just getting 'pig' necessary?!
// ---------------------------------------------------------------------------------------------------------------------
// NOTE: async functions return promise, so we can wait for them (await)
async function changeGaze(agents, trialCount) {
  const currentAgent = `${agents[trialCount].getAttribute('id')}`;
  // get IDs of eye
  const pupilLeft = document.getElementById(`${currentAgent}-pupil-left`);
  const pupilRight = document.getElementById(`${currentAgent}-pupil-right`);
  const irisLeft = document.getElementById(`${currentAgent}-iris-left`);
  const irisRight = document.getElementById(`${currentAgent}-iris-right`);
  const eyelineLeft = document.getElementById(`${currentAgent}-eyeline-left`);
  const eyelineRight = document.getElementById(`${currentAgent}-eyeline-right`);

  // define where the target will move
  // WE NEED MINUS! SINCE WE MOVE THE COORDINATE SYSTEM TO THE LEFT / UP in order to let the balloon move right / down
  // eslint-disable-next-line max-len
  const targetViewBoxRandom = `-${randomNumber(sectionArray[trialCount].min, sectionArray[trialCount].max)} -${hedgeMidY} ${origViewBoxWidth} ${origViewBoxHeight}`;

  // animate target and set target viewBox to the value where it just moved
  // if fam: how whole path of target. if test: let balloon hide first
  if (trialType[trialCount] === 'fam') {
    // BACK TO RANDOM: next two lines
    animateViewBox(targets[trialCount], targetViewBoxRandom);
    targets[trialCount].setAttribute('viewBox', targetViewBoxRandom);
  } else if (trialType[trialCount] === 'test') {
    animateViewBox(targets[trialCount], targetViewBoxRandom);
    targets[trialCount].setAttribute('viewBox', targetViewBoxRandom);
  }

  // calculate positions for both eyes (AFTER target viewBox value has changed)
  const gazeCoordsLeft = getGazeCoords(targets[trialCount], pupilLeft, eyelineLeft);
  const gazeCoordsRight = getGazeCoords(targets[trialCount], pupilRight, eyelineRight);

  // animate eyes and set eye viewBoxes to the value where it just moved
  animateCoord(pupilLeft, gazeCoordsLeft);
  animateCoord(pupilRight, gazeCoordsRight);
  animateCoord(irisLeft, gazeCoordsLeft);
  animateCoord(irisRight, gazeCoordsRight);

  pupilLeft.setAttribute('cx', gazeCoordsLeft.x);
  pupilLeft.setAttribute('cy', gazeCoordsLeft.y);
  pupilRight.setAttribute('cx', gazeCoordsRight.x);
  pupilRight.setAttribute('cy', gazeCoordsRight.y);
  irisLeft.setAttribute('cx', gazeCoordsLeft.x);
  irisLeft.setAttribute('cy', gazeCoordsLeft.y);
  irisRight.setAttribute('cx', gazeCoordsRight.x);
  irisRight.setAttribute('cy', gazeCoordsRight.y);
}

// ---------------------------------------------------------------------------------------------------------------------
// EVENTLISTENER
// ---------------------------------------------------------------------------------------------------------------------
let nrClicks = 0;
const responseLog = [];
let next = false; // this is to be changed on user input

outerSVG.onclick = () => { next = true; };

async function waitForClick() {
  while (next === false) await pause(50); // pause script but avoid browser to freeze ;)
  next = false; // reset var
}

// ---------------------------------------------------------------------------------------------------------------------
// SPECIFY ORDER OF EVENTS
//
// TODO for now, you can end trial by clicking before balloon landed!
// ---------------------------------------------------------------------------------------------------------------------
// https://stackoverflow.com/questions/51374649/using-async-functions-to-await-user-input-from-onclick
async function runTrial(agents, trialCount) {
  // wait for user response
  // on user click, runs clickDistanceFromTarget function
  const doClick = (event) => clickDistanceFromTarget(event, targets[trialCount], outerSVG, responseLog);
  outerSVG.addEventListener('click', doClick, false);

  // actual sequence of the trial
  await startTrial(agents, trialCount);
  await pause(1000);
  await changeGaze(agents, trialCount);

  // wait for user response and log response time and accuracy
  const t0 = new Date().getTime();
  await waitForClick();
  const responseTime = new Date().getTime() - t0;
  responseLog[trialCount].responseTime = responseTime;
  console.log('response log', responseLog[trialCount]);

  nrClicks += 1;
  console.log(`user has clicked ${nrClicks} time(s)`);

  // in order to save only current click values, we always need new eventListener
  outerSVG.removeEventListener('click', doClick, false);

  // recursion anchor
  if (trialCount + 1 < trialType.length) {
    runTrial(agents, trialCount + 1);
  }
}

// CAUTION: trialCount start at zero, ie. first trial = 0
// (because we need first element in array, that's at position 0)
runTrial(agents, 0);

import getGazeCoords from './js/getGazeCoords';
import randomNumber from './js/randomNumber';
import shuffleArray from './js/shuffleArray';
import animateViewBox from './js/animateViewBox';
import animateCoord from './js/animateCoord';
import showElement from './js/showElement';
import divideWithRemainder from './js/divideWithRemainder';
import getEyeCenter from './js/getEyeCenter';

// ---------------------------------------------------------------------------------------------------------------------
// SVG & SCREEN SIZE

// TODO find more elegant solution to tell user to view on fullscreen
// if (clientWidth < 600 || clientHeight < 200) alert('Please view on bigger screen!');
// ---------------------------------------------------------------------------------------------------------------------
const { clientWidth } = document.body;
const { clientHeight } = document.body;
console.log('client browser size', { clientWidth, clientHeight });

// get viewBox size from whole SVG
const origViewBox = document.getElementById('outer-svg').getAttribute('viewBox');
const origViewBoxX = parseFloat(origViewBox.split(' ')[0]);
const origViewBoxY = parseFloat(origViewBox.split(' ')[1]);
const origViewBoxWidth = parseFloat(origViewBox.split(' ')[2]);
const origViewBoxHeight = parseFloat(origViewBox.split(' ')[3]);
console.log('viewbox size', {
  origViewBoxX, origViewBoxY, origViewBoxWidth, origViewBoxHeight,
});

// ---------------------------------------------------------------------------------------------------------------------
// GET ALL RELEVANT ELEMENTS IN SVG
// ---------------------------------------------------------------------------------------------------------------------
// if you change animal agents or targets, then change ID here...
const pig = document.getElementById('pig');
const monkey = document.getElementById('monkey');
const sheep = document.getElementById('sheep');
const agentsNames = ['pig', 'monkey', 'sheep'];

// save the original position of the eyes of agents
const eyeCenters = [];
for (let i = 0; i < agentsNames.length; i++) {
  eyeCenters[`${agentsNames[i]}`] = {
    left: getEyeCenter(document.getElementById(`${agentsNames[i]}-pupil-left`)),
    right: getEyeCenter(document.getElementById(`${agentsNames[i]}-pupil-right`)),
  };
}
console.log('eyeCenters', eyeCenters);

// NOTE: we believe that all target objects are the same size here!!
const balloonBlue = document.getElementById('balloon-blue');
const balloonRed = document.getElementById('balloon-red');
const balloonYellow = document.getElementById('balloon-yellow');
const balloonGreen = document.getElementById('balloon-green');

// get position on the very right (as constraint) and mid of the screen
const targetPositionRight = origViewBoxWidth - balloonBlue.getBBox().width;
const targetPositionMid = origViewBoxWidth / 2 - balloonBlue.getBBox().width / 2;
const midTargetViewBox = `-${targetPositionMid} -${origViewBoxHeight / 2.8} ${origViewBoxWidth} ${origViewBoxHeight}`;

// get hedge and middle Y of it
const hedge = document.getElementById('hedge');
// take y coordinate of hedge + half of the height. Then, subtract half of the balloon height.
const hedgeMidY = hedge.getBBox().y + hedge.getBBox().height / 2 - balloonBlue.getBBox().height / 2;

// ---------------------------------------------------------------------------------------------------------------------
// TRIAL NUMBER & RANDOMIZATION
//
// TODO if trials < 4 then some balloons are still visible in the corner
// TODO agent list genauso lang wie trialNumber?
// TODO pick random so viele sections aus sectionArray wie trialNumbers
// ---------------------------------------------------------------------------------------------------------------------
// trialType saves whether we want to display hedge (test) or not (fam)
// first new Array() number specifies how many fam trials, second how many test trials
// instead of trialNumber: trialType.length specifies our number of trials!
const trialType = [].concat(new Array(1).fill('fam'), new Array(2).fill('test'));

// calculate how many times each agent should be repeated, based on trialNumber
const agentsDiv = divideWithRemainder(trialType.length, agentsNames.length);

// repeat each agent as often as just calculated. then shuffle the array for randomization.
let agentsChar = shuffleArray([].concat(new Array(agentsDiv.quotient).fill('pig'), new Array(agentsDiv.quotient).fill('sheep'), new Array(agentsDiv.quotient).fill('monkey')));

// if our trialNumber is not divisable by number of agents, put random agents for remainder number
if (agentsDiv.remainder > 0) {
  // create random array with agents
  const agentsTmp = shuffleArray(['pig', 'sheep', 'monkey']);
  // keep only as many entries in array as we need (remove rest)
  for (let i = 0; i < (agentsNames.length - agentsDiv.remainder); i++) {
    agentsTmp.splice(i, 1);
  }
  agentsChar = agentsChar.concat(agentsTmp);
}

// save the SVG objects by ids in agents array
let agents = [];
for (let i = 0; i < agentsChar.length; i++) {
  agents = agents.concat(eval(agentsChar[i]));
}

// SAME FOR TARGET
const targetsNr = 4;
const targetsDiv = divideWithRemainder(trialType.length, targetsNr);
let targetsChar = shuffleArray([].concat(new Array(targetsDiv.quotient).fill('balloonRed'), new Array(targetsDiv.quotient).fill('balloonBlue'), new Array(targetsDiv.quotient).fill('balloonYellow'), new Array(targetsDiv.quotient).fill('balloonGreen')));

if (targetsDiv.remainder > 0) {
  const targetsTmp = shuffleArray(['balloonRed', 'balloonBlue', 'balloonYellow', 'balloonGreen']);
  for (let i = 0; i < (targetsNr - targetsDiv.remainder); i++) {
    targetsTmp.splice(i, 1);
  }
  targetsChar = targetsChar.concat(targetsTmp);
}

let targets = [];
for (let i = 0; i < targetsChar.length; i++) {
  targets = targets.concat(eval(targetsChar[i]));
}
console.log('targets', targets);

// we need to save original eye location and set them back there!!
// TODO hide all balloons and agents in the beginning, then only show relevants.
// otherwise problem for 4 balloons but only 3 trials
console.log('agents', agents);

// ---------------------------------------------------------------------------------------------------------------------
// CALCULATE POSITIONS OF TARGET

// TODO function for this?
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

const sectionArray = shuffleArray([section1, section2, section3, section4, section5, section6, section7, section8, section9, section10]);
console.log('sectionArray', sectionArray);

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR BREAK
// ---------------------------------------------------------------------------------------------------------------------
function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR BEGINNING NEW TRIAL (back to starting point)
//
// TODO function needed for showing/hiding hede? or okay here?
// ---------------------------------------------------------------------------------------------------------------------
function startTrial(agents, trialCount) {
  return new Promise((resolve) => {
    const currentAgent = `${agents[trialCount].getAttribute('id')}`;
    console.log('currentAgent', currentAgent);
    console.log(`eyeCenters.${currentAgent}.right.x`, eval(`eyeCenters.${currentAgent}.right.x`));

    const pupilLeft = document.getElementById(`${currentAgent}-pupil-left`);
    const pupilRight = document.getElementById(`${currentAgent}-pupil-right`);
    const irisLeft = document.getElementById(`${currentAgent}-iris-left`);
    const irisRight = document.getElementById(`${currentAgent}-iris-right`);

    pupilLeft.setAttribute('cx', eval(`eyeCenters.${currentAgent}.left.x`));
    pupilLeft.setAttribute('cy', eval(`eyeCenters.${currentAgent}.left.y`));
    pupilRight.setAttribute('cx', eval(`eyeCenters.${currentAgent}.right.x`));
    pupilRight.setAttribute('cy', eval(`eyeCenters.${currentAgent}.right.y`));

    irisLeft.setAttribute('cx', eval(`eyeCenters.${currentAgent}.left.x`));
    irisLeft.setAttribute('cy', eval(`eyeCenters.${currentAgent}.left.y`));
    irisRight.setAttribute('cx', eval(`eyeCenters.${currentAgent}.right.x`));
    irisRight.setAttribute('cy', eval(`eyeCenters.${currentAgent}.right.y`));

    // show agent and target of the current trial only, hide the other ones
    showElement(agents, trialCount);
    showElement(targets, trialCount);

    // depending on trial type, show or hide hedge
    if (trialType[trialCount] === 'fam') {
      hedge.setAttribute('visibility', 'hidden');
    } else if (trialType[trialCount] === 'test') {
      hedge.setAttribute('visibility', 'visible');
    }

    // always start the target in the middle again
    targets[trialCount].setAttribute('viewBox', `${midTargetViewBox}`);
    resolve('end of startTrial');
  });
}

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR CHANGING GAZE
//
// TODO might need to add target as function argument
// TODO ${agents[trialCount].getAttribute('id')} for just getting 'pig' necessary?!
// ---------------------------------------------------------------------------------------------------------------------
function changeGaze(agents, trialCount) {
  return new Promise((resolve) => {
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
    const newTargetViewBox = `-${randomNumber(sectionArray[trialCount].min, sectionArray[trialCount].max)} -${hedgeMidY} ${origViewBoxWidth} ${origViewBoxHeight}`;

    // animate target and set target viewBox to the value where it just moved
    animateViewBox(targets[trialCount], midTargetViewBox, newTargetViewBox);
    targets[trialCount].setAttribute('viewBox', newTargetViewBox);

    // calculate positions for both eyes (AFTER target viewBox value has changed)
    const gazeCoordsLeft = getGazeCoords(targets[trialCount], pupilLeft, eyelineLeft);
    const gazeCoordsRight = getGazeCoords(targets[trialCount], pupilRight, eyelineRight);

    // animate eyes and set eye viewBoxes to the value where it just moved
    animateCoord(pupilLeft, gazeCoordsLeft);
    animateCoord(irisLeft, gazeCoordsLeft);
    animateCoord(pupilRight, gazeCoordsRight);
    animateCoord(irisRight, gazeCoordsRight);
    pupilLeft.setAttribute('cx', gazeCoordsLeft.x);
    pupilLeft.setAttribute('cy', gazeCoordsLeft.y);
    pupilRight.setAttribute('cx', gazeCoordsRight.x);
    pupilRight.setAttribute('cy', gazeCoordsRight.y);
    irisLeft.setAttribute('cx', gazeCoordsLeft.x);
    irisLeft.setAttribute('cy', gazeCoordsLeft.y);
    irisRight.setAttribute('cx', gazeCoordsRight.x);
    irisRight.setAttribute('cy', gazeCoordsRight.y);

    resolve('end of changeGaze');
  });
}

// ---------------------------------------------------------------------------------------------------------------------
// SPECIFY ORDER OF EVENTS
// ---------------------------------------------------------------------------------------------------------------------
async function runAllTrials(agents) {
  // CAUTION: trialCount start at zero, ie. first trial = 0 (because we need first element in array, that's at position 0)
  for (let trialCount = 0; trialCount < trialType.length; trialCount++) {
    await startTrial(agents, trialCount);
    await pause(2000);
    await changeGaze(agents, trialCount);
    await pause(2000);
  }
}
runAllTrials(agents);

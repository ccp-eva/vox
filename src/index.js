import getGazeCoords from './js/getGazeCoords';
import randomNumber from './js/randomNumber';
import shuffleArray from './js/shuffleArray';
import animateViewBox from './js/animateViewBox';
import animateCoord from './js/animateCoord';
import showElement from './js/showElement';
import sleep from './js/sleep';
// import sleep from './js/sleep';

// check screen size of user
const { clientWidth } = document.body;
const { clientHeight } = document.body;
console.log('client browser size', { clientWidth, clientHeight });
// TODO find more elegant solution to tell user to view on fullscreen
// if (clientWidth < 600 || clientHeight < 200) alert('Please view on bigger screen!');

// get viewBox size from whole SVG
const origViewBox = document.getElementById('outer-svg').getAttribute('viewBox');
const origViewBoxX = parseFloat(origViewBox.split(' ')[0]);
const origViewBoxY = parseFloat(origViewBox.split(' ')[1]);
const origViewBoxWidth = parseFloat(origViewBox.split(' ')[2]);
const origViewBoxHeight = parseFloat(origViewBox.split(' ')[3]);
console.log('viewbox size', {
  origViewBoxX, origViewBoxY, origViewBoxWidth, origViewBoxHeight,
});

// get target and agents
// if you change animal agents or targets, then change ID here...
const pig = document.getElementById('pig');
const monkey = document.getElementById('monkey');
const sheep = document.getElementById('sheep');
const agents = shuffleArray([pig, monkey, sheep]);
console.log('agents', agents);

const ballonBlue = document.getElementById('balloon-blue');
const ballonRed = document.getElementById('balloon-red');
const ballonYellow = document.getElementById('balloon-yellow');
const ballonGreen = document.getElementById('balloon-green');
// NOTE: we believe that all target objects are the same size here!!
const targets = shuffleArray([ballonBlue, ballonRed, ballonYellow, ballonGreen]);
console.log('targets', targets);

const hedge = document.getElementById('hedge');
// TODO create variable for trial type
// then do sth like this:
// if (trialType === 'fam') {
//   hedge.setAttribute('visibility', 'hidden');
// }

// get middle Y of the hedge background
// take y coordinate of hedge + half of the height. Then, subtract half of the balloon height.
const hedgeMidY = hedge.getBBox().y + hedge.getBBox().height / 2 - targets[0].getBBox().height / 2;

// get position on the very right of the screen
const targetPositionRight = origViewBoxWidth - targets[0].getBBox().width;
const targetPositionMid = origViewBoxWidth / 2 - targets[0].getBBox().width / 2;

// put target in middle (target needs to be last in the SVG => on top level/foreground)
const midTargetViewBox = `-${targetPositionMid} -${origViewBoxHeight / 2.8} ${origViewBoxWidth} ${origViewBoxHeight}`;
targets[0].setAttribute('viewBox', `${midTargetViewBox}`);

// range of possible values to move the target: 0 - targetPositionRight
// divide this range into ten
// for each of these ten categories, pick a random number
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

// CAUTION: trialCount starts at zero, ie. first trial = 0
// eslint-disable-next-line prefer-const
// let trialCount = 0;
const trialNumber = 3;

// TODO agent list genauso lang wie trialNumber?
// TODO pick random so viele sections aus sectionArray wie trialNumbers

// function for breaks
function pause(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// function for setting everything to start state
function startTrial(agents, trialCount) {
  return new Promise((resolve) => {
    // show agent and target of the current trial only, hide the other ones
    showElement(agents, trialCount);
    showElement(targets, trialCount);
    // always start the target in the middle again
    targets[trialCount].setAttribute('viewBox', `${midTargetViewBox}`);
    resolve('end of startTrial');
  });
}

// function for changing gaze
// TODO might need to add target as function argument
function changeGaze(agents, trialCount) {
  return new Promise((resolve) => {
    // get IDs of eye
    // TODO ${agents[trialCount].getAttribute('id')} for just getting 'pig' necessary?!
    const irisLeft = document.getElementById(`${agents[trialCount].getAttribute('id')}-iris-left`);
    const pupilLeft = document.getElementById(`${agents[trialCount].getAttribute('id')}-pupil-left`);
    const eyelineLeft = document.getElementById(`${agents[trialCount].getAttribute('id')}-eyeline-left`);
    const irisRight = document.getElementById(`${agents[trialCount].getAttribute('id')}-iris-right`);
    const pupilRight = document.getElementById(`${agents[trialCount].getAttribute('id')}-pupil-right`);
    const eyelineRight = document.getElementById(`${agents[trialCount].getAttribute('id')}-eyeline-right`);

    // define where the target will move; use template literal to access values
    // WE NEED MINUS! SINCE WE MOVE THE COORDINATE SYSTEM TO THE LEFT / UP in order to let the balloon move right / down
    // eslint-disable-next-line max-len
    const newTargetViewBox = `-${randomNumber(sectionArray[trialCount].min, sectionArray[trialCount].max)} -${hedgeMidY} ${origViewBoxWidth} ${origViewBoxHeight}`;

    // eslint-disable-next-line max-len
    animateViewBox(targets[trialCount], midTargetViewBox, newTargetViewBox);

    // set target viewBox to the value where it just moved
    targets[trialCount].setAttribute('viewBox', newTargetViewBox);

    // calculate positions for both eyes (AFTER target viewBox value has changed)
    const gazeCoordsLeft = getGazeCoords(targets[trialCount], pupilLeft, eyelineLeft);
    const gazeCoordsRight = getGazeCoords(targets[trialCount], pupilRight, eyelineRight);

    animateCoord(pupilLeft, gazeCoordsLeft);
    animateCoord(irisLeft, gazeCoordsLeft);
    animateCoord(pupilRight, gazeCoordsRight);
    animateCoord(irisRight, gazeCoordsRight);

    // set target viewBox to the value where it just moved
    // should be on intersection line / circle
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

// order of events with breaks inbetween
async function runAllTrials(agents) {
  for (let trialCount = 0; trialCount < trialNumber; trialCount++) {
    await startTrial(agents, trialCount);
    await pause(2000);
    await changeGaze(agents, trialCount);
    await pause(2000);
  }
}
runAllTrials(agents);

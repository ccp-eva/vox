import clickDistanceFromTarget from './js/clickDistanceFromTarget';
import checkForTouchscreen from './js/checkForTouchscreen';
import prepareTrial from './js/prepareTrial';
import changeGaze from './js/changeGaze';
import pause from './js/pause';
import randomizeTrials from './randomizeTrials';

// ---------------------------------------------------------------------------------------------------------------------
// SVG & SCREEN SIZE

// TODO find more elegant solution to tell user to view on fullscreen
// if (clientWidth < 600 || clientHeight < 200) alert('Please view on bigger screen!');
// ---------------------------------------------------------------------------------------------------------------------
const { offsetWidth } = document.body;
const { offsetHeight } = document.body;
console.log('client browser size', { offsetWidth, offsetHeight });
console.log('checkForTouchscreen', checkForTouchscreen());

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
const clickBubble = document.getElementById('click-bubble');
const coverBlurr = document.getElementById('cover-blurr');

// if you change animal agents or targets, then change ID here...
const pig = document.getElementById('pig');
const monkey = document.getElementById('monkey');
const sheep = document.getElementById('sheep');
// eslint-disable-next-line prefer-const
let agentsSingle = [pig, monkey, sheep];

// NOTE: we believe that all target objects are the same size here!!
const balloonBlue = document.getElementById('balloon-blue');
const balloonRed = document.getElementById('balloon-red');
const balloonYellow = document.getElementById('balloon-yellow');
const balloonGreen = document.getElementById('balloon-green');
// eslint-disable-next-line prefer-const
let targetsSingle = [balloonBlue, balloonRed, balloonYellow, balloonGreen];

// hide all in beginning
[balloonBlue, balloonRed, balloonYellow, balloonGreen,
  pig, monkey, sheep,
  button, clickBubble, coverBlurr,
].forEach((element) => {
  element.setAttribute('visibility', 'hidden');
});

// for all agents, save the original pupil/iris positions as attributes in svg elements
['pig', 'monkey', 'sheep'].forEach((agent) => {
  const pupilLeft = document.getElementById(`${agent}-pupil-left`);
  const irisLeft = document.getElementById(`${agent}-iris-left`);
  const pupilRight = document.getElementById(`${agent}-pupil-right`);
  const irisRight = document.getElementById(`${agent}-iris-right`);

  pupilLeft.setAttribute('cxOrig', `${pupilLeft.getAttribute('cx')}`);
  pupilLeft.setAttribute('cyOrig', `${pupilLeft.getAttribute('cy')}`);
  irisLeft.setAttribute('cxOrig', `${irisLeft.getAttribute('cx')}`);
  irisLeft.setAttribute('cyOrig', `${irisLeft.getAttribute('cy')}`);
  pupilRight.setAttribute('cxOrig', `${pupilRight.getAttribute('cx')}`);
  pupilRight.setAttribute('cyOrig', `${pupilRight.getAttribute('cy')}`);
  irisRight.setAttribute('cxOrig', `${irisRight.getAttribute('cx')}`);
  irisRight.setAttribute('cyOrig', `${irisRight.getAttribute('cy')}`);
});

// calculate some target positions:
// get position on the very right (as constraint) and mid of the screen
const targetPositionRight = origViewBoxWidth - balloonBlue.getBBox().width;
const targetPositionMid = origViewBoxWidth / 2 - balloonBlue.getBBox().width / 2;
// eslint-disable-next-line max-len
const targetViewBoxCenter = `-${targetPositionMid} -${origViewBoxHeight / 2.8} ${origViewBoxWidth} ${origViewBoxHeight}`;

// get hedge
const hedge = document.getElementById('hedge');
// take y coordinate of hedge + half of the height. Then, subtract half of the balloon height.
const hedgeMidY = hedge.getBBox().y + hedge.getBBox().height / 2 - balloonBlue.getBBox().height / 2;
// define from which point onwards the balloon is hidden behind hedge
// BBox of hedge is a bit too high to hide balloon, therefore / 1.1
// eslint-disable-next-line max-len
const targetViewBoxHidden = `-${targetPositionMid} -${origViewBoxHeight - hedge.getBBox().height / 1.1} ${origViewBoxWidth} ${origViewBoxHeight}`;
// placeholder x for random horizontal position. y value and width, height always stays same
const targetViewBoxRandom = `-x -${hedgeMidY} ${origViewBoxWidth} ${origViewBoxHeight}`;

targetsSingle.forEach((target) => {
  target.setAttribute('viewBoxCenter', `${targetViewBoxCenter}`);
  target.setAttribute('viewBoxHidden', `${targetViewBoxHidden}`);
  target.setAttribute('viewBoxRandom', `${targetViewBoxRandom}`);
});

// ---------------------------------------------------------------------------------------------------------------------
// TRIAL NUMBER & RANDOMIZATION OF AGENTS, TARGETS AND TARGET POSITIONS
// ---------------------------------------------------------------------------------------------------------------------
const famNr = 10;
const testNr = 10;
const {
  trialType, agents, targets, positions,
} = randomizeTrials(famNr, testNr, agentsSingle, targetsSingle, targetPositionRight);

// ---------------------------------------------------------------------------------------------------------------------
// EVENTLISTENER
// ---------------------------------------------------------------------------------------------------------------------
let nrClicks = 0;
const responseLog = [];

// https://stackoverflow.com/questions/51374649/using-async-functions-to-await-user-input-from-onclick
let next = false; // this is to be changed on user input
outerSVG.onclick = () => { next = true; };
async function waitForClick() {
  while (next === false) await pause(50); // pause script but avoid browser to freeze ;)
  next = false; // reset var
}

let buttonNext = false;
button.onclick = () => { buttonNext = true; };
async function waitForButtonClick() {
  while (next === false) await pause(50); // pause script but avoid browser to freeze ;)
  next = false; // reset var
}
// ---------------------------------------------------------------------------------------------------------------------
// SPECIFY ORDER OF EVENTS
//
// TODO for now, you can end trial by clicking before balloon landed!
// ---------------------------------------------------------------------------------------------------------------------
async function runTrial(agents, trialCount) {
  // before trial starts, prepare it and hide underneath blurr
  prepareTrial(agents, targets, trialCount, trialType);
  // start trial on buttonClick
  await waitForButtonClick();

  // define what to do on user click
  // button: start trial/changeGaze
  button.addEventListener('click', changeGaze(agents, targets, positions, trialCount, trialType), false);

  // response logging in changegaze
  // handleClick hands over clickEvent parameter to clickDistanceFromTarget function
  const handleClick = (event) => clickDistanceFromTarget(event, targets[trialCount], outerSVG, responseLog);
  outerSVG.addEventListener('click', handleClick, false);
  // wait for user response and log response time and accuracy
  const t0 = new Date().getTime(); // TODO
  await waitForClick();
  const responseTime = new Date().getTime() - t0;

  // log all important trial infos
  // TODO apparently has to be underneath await waitForClick(). don't know why!?
  responseLog[trialCount].responseTime = responseTime;
  responseLog[trialCount].trialNr = trialCount + 1;
  responseLog[trialCount].agent = `${agents[trialCount].getAttribute('id')}`;
  responseLog[trialCount].target = `${targets[trialCount].getAttribute('id')}`;
  responseLog[trialCount].trialType = trialType[trialCount];

  console.log('responseLog', responseLog[trialCount]);
  nrClicks += 1;
  console.log(`user has clicked ${nrClicks} time(s)`);

  // in order to save only current click values, we always need new eventListener
  outerSVG.removeEventListener('click', handleClick, false);

  // recursion anchor
  if (trialCount + 1 < trialType.length) {
    runTrial(agents, trialCount + 1);
  }
}

// CAUTION: trialCount start at zero, ie. first trial = 0
// (because we need first element in array, that's at position 0)
runTrial(agents, 0);

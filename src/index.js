import clickDistanceFromTarget from './js/clickDistanceFromTarget';
import checkForTouchscreen from './js/checkForTouchscreen';
import prepareTrial from './js/prepareTrial';
import changeGaze from './js/changeGaze';
import pause from './js/pause';
import randomizeTrials from './js/randomizeTrials';

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
console.log('viewBox size', {
  origViewBoxX, origViewBoxY, origViewBoxWidth, origViewBoxHeight,
});

// ---------------------------------------------------------------------------------------------------------------------
// GET ALL RELEVANT ELEMENTS IN SVG
// ---------------------------------------------------------------------------------------------------------------------
const instructions = document.getElementById('instructions');
const transition = document.getElementById('transition');
const goodbye = document.getElementById('goodbye');
const experiment = document.getElementById('experiment');

const instructionsButton = document.getElementById('instructions-button');
const transitionButton = document.getElementById('transition-button');
const goodbyeButton = document.getElementById('goodbye-button');
const experimentButton = document.getElementById('experiment-button');
const clickBubble = document.getElementById('click-bubble');
const clickArea = document.getElementById('click-area');
const fiveBoxes = document.getElementById('five-boxes');
const sevenBoxes = document.getElementById('seven-boxes');
const hedge = document.getElementById('hedge');

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

// [instructions, transition, goodbye,
//   clickBubble, fiveBoxes, sevenBoxes,
//   pig, monkey, sheep,
//   balloonBlue, balloonRed, balloonYellow, balloonGreen,
// ].forEach((element) => {
//   element.setAttribute('visibility', 'hidden');
// });

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

// calculate y coords for balloon (-10 for little distance from border)
const hedgeMidY = origViewBoxHeight - balloonBlue.getBBox().height - 10;

// define from which point onwards the balloon is hidden behind hedge
// BBox of hedge is a bit too high to hide balloon, therefore / 1.1
// eslint-disable-next-line max-len
const targetViewBoxHidden = `-${targetPositionMid} -${origViewBoxHeight - hedge.getBBox().height / 1.1} ${origViewBoxWidth} ${origViewBoxHeight}`;
// placeholder x for random horizontal position. y value and width, height always stays same
const targetViewBoxRandom = `-x -${hedgeMidY} ${origViewBoxWidth} ${origViewBoxHeight}`;

// save target viewbox values in svg attribute (this way we have to save less variables)
targetsSingle.forEach((target) => {
  target.setAttribute('viewBoxCenter', `${targetViewBoxCenter}`);
  target.setAttribute('viewBoxHidden', `${targetViewBoxHidden}`);
  target.setAttribute('viewBoxRandom', `${targetViewBoxRandom}`);
});

// ---------------------------------------------------------------------------------------------------------------------
// TRIAL NUMBER & RANDOMIZATION OF AGENTS, TARGETS AND TARGET POSITIONS
// ---------------------------------------------------------------------------------------------------------------------
const famNr = 2;
const testNr = 2;
const {
  trialType, agents, targets, positions,
} = randomizeTrials(famNr, testNr, agentsSingle, targetsSingle, targetPositionRight);

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR WAITING FOR CLICKS, HANDLING CLICKS
// ---------------------------------------------------------------------------------------------------------------------
const responseLog = [];

let buttonNext = false;
async function waitForClick() {
  while (buttonNext === false) await pause(50);
  buttonNext = false;
}
const handleClick = (event) => {
  event.preventDefault();
  buttonNext = true;
};

const handleWrongClick = (event) => {
  event.preventDefault();
  const screenScalingHeight = origViewBoxHeight / offsetHeight;
  const clickY = event.clientY - outerSVG.getBoundingClientRect().top;
  const clickScaledY = screenScalingHeight * clickY;
  if (clickScaledY < (origViewBoxHeight - hedge.getBBox().height)) {
    document.getElementById('negative-sound').play();
  }
};

// ---------------------------------------------------------------------------------------------------------------------
// SPECIFY ORDER OF ONE TRIAL
// ---------------------------------------------------------------------------------------------------------------------
async function runTrial(agents, trialCount) {
  console.log(' ');

  // before trial starts, prepare it and hide underneath blurr
  prepareTrial(agents, targets, trialCount, trialType);

  // wait for user to start trial
  experimentButton.addEventListener('click', handleClick, { capture: false, once: true });
  await waitForClick();
  experimentButton.removeEventListener('click', handleClick);

  outerSVG.addEventListener('click', handleWrongClick, false);

  // animate target and eye movements
  // during trial presentation, nothing can be clicked
  // function resolves promise with pupil & animation values which we log later
  const {
    pupilLeft,
    pupilRight,
    durationAnimation,
  } = await changeGaze(agents, targets, positions, trialCount, trialType);

  // wait for user response and log response time
  const t0 = new Date().getTime();

  // wait for target click of user (can only click where hedge is/would be)
  // in htlm, <g id="hedge" pointer-events="all">, so that you can click on it even if hidden
  hedge.addEventListener('click', handleClick, { capture: false, once: true });

  // log where the user clicked
  // logTargetClick hands over clickEvent parameter to clickDistanceFromTarget function
  const logTargetClick = (event) => { clickDistanceFromTarget(event, targets[trialCount], outerSVG, responseLog); };
  hedge.addEventListener('click', logTargetClick, { capture: false, once: true });
  await waitForClick();
  hedge.removeEventListener('click', handleClick);
  hedge.removeEventListener('click', logTargetClick);
  outerSVG.removeEventListener('click', handleWrongClick, false);

  // after click, save response time
  const responseTime = new Date().getTime() - t0;

  // log all important trial infos
  responseLog[trialCount].responseTime = responseTime;
  responseLog[trialCount].trialNr = trialCount + 1;
  responseLog[trialCount].agent = `${agents[trialCount].getAttribute('id')}`;
  responseLog[trialCount].target = `${targets[trialCount].getAttribute('id')}`;
  responseLog[trialCount].trialType = trialType[trialCount];
  responseLog[trialCount].positionBin = positions[trialCount].bin;
  responseLog[trialCount].pupilLeftOrigX = parseFloat(pupilLeft.getAttribute('cxOrig'));
  responseLog[trialCount].pupilLeftOrigY = parseFloat(pupilLeft.getAttribute('cyOrig'));
  responseLog[trialCount].pupilLeftRandomX = parseFloat(pupilLeft.getAttribute('cx'));
  responseLog[trialCount].pupilLeftRandomY = parseFloat(pupilLeft.getAttribute('cy'));
  responseLog[trialCount].pupilRightOrigX = parseFloat(pupilRight.getAttribute('cxOrig'));
  responseLog[trialCount].pupilRightOrigY = parseFloat(pupilRight.getAttribute('cyOrig'));
  responseLog[trialCount].pupilRightRandomX = parseFloat(pupilRight.getAttribute('cx'));
  responseLog[trialCount].pupilRightRandomY = parseFloat(pupilRight.getAttribute('cy'));
  // NOTE: durationAnimation does NOT include 1 sec delay in beginning. Value in msec.
  responseLog[trialCount].durationAnimation = durationAnimation * 1000;
  console.log('responseLog', responseLog[trialCount]);

  // so that we don't rush to the next trial/startscreen but have a little time
  await pause(1000);
}

// ---------------------------------------------------------------------------------------------------------------------
// SPECIFY ORDER OF ALL EVENTS
// ---------------------------------------------------------------------------------------------------------------------
async function runAll(trialCount) {
  // INSTRUCTION PHASE
  [transition, experiment, goodbye].forEach((element) => {
    element.setAttribute('visibility', 'hidden');
  });
  instructions.setAttribute('visibility', 'visible');

  // wait for user to continue
  instructionsButton.addEventListener('click', handleClick, { capture: false, once: true });
  await waitForClick();
  instructionsButton.removeEventListener('click', handleClick);

  // FAM PHASE
  [instructions, transition, goodbye,
    clickBubble, fiveBoxes, sevenBoxes,
    pig, monkey, sheep,
    balloonBlue, balloonRed, balloonYellow, balloonGreen,
  ].forEach((element) => {
    element.setAttribute('visibility', 'hidden');
  });
  experiment.setAttribute('visibility', 'visible');

  while (trialCount < famNr) {
    // eslint-disable-next-line no-await-in-loop
    await runTrial(agents, trialCount);
    // eslint-disable-next-line no-param-reassign
    trialCount += 1;
  }

  // TRANSITION PHASE
  [experiment,
    pig, monkey, sheep,
    balloonBlue, balloonRed, balloonYellow, balloonGreen,
  ].forEach((element) => {
    element.setAttribute('visibility', 'hidden');
  });
  transition.setAttribute('visibility', 'visible');

  // wait for user to continue
  transitionButton.addEventListener('click', handleClick, { capture: false, once: true });
  await waitForClick();
  transitionButton.removeEventListener('click', handleClick);

  // TEST PHASE
  transition.setAttribute('visibility', 'hidden');
  experiment.setAttribute('visibility', 'visible');

  while (trialCount < trialType.length) {
    // eslint-disable-next-line no-await-in-loop
    await runTrial(agents, trialCount);
    // eslint-disable-next-line no-param-reassign
    trialCount += 1;
  }
  console.log('test phase completed');

  // GOODBYE
  [experiment, hedge,
    pig, monkey, sheep,
    balloonBlue, balloonRed, balloonYellow, balloonGreen,
  ].forEach((element) => {
    element.setAttribute('visibility', 'hidden');
  });
  goodbye.setAttribute('visibility', 'visible');

  // wait for user to continue
  goodbyeButton.addEventListener('click', handleClick, { capture: false, once: true });
  await waitForClick();
  goodbyeButton.removeEventListener('click', handleClick);
}

// CAUTION: trialCount start at zero, ie. first trial = 0
// (because we need first element in array, that's at position 0)
runAll(0);

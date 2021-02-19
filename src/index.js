import logResponse from './js/logResponse';
import prepareTrial from './js/prepareTrial';
import changeGaze from './js/changeGaze';
import pause from './js/pause';
import randomizeTrials from './js/randomizeTrials';
import downloadData from './js/downloadData';
import checkForTouchscreen from './js/checkForTouchscreen';
import showSlide from './js/showSlide';

// TODO: Liste Manuel
// TODO: response time logging
// ---------------------------------------------------------------------------------------------------------------------
// PARTICIPANT ID
// ---------------------------------------------------------------------------------------------------------------------
const subjData = {};
subjData.subjID = 'testID';
subjData.touchScreen = checkForTouchscreen();

// ---------------------------------------------------------------------------------------------------------------------
// SVG & SCREEN SIZE
// TODO find more elegant solution to tell user to view on fullscreen
// if (clientWidth < 600 || clientHeight < 200) alert('Please view on bigger screen!');
// ---------------------------------------------------------------------------------------------------------------------
subjData.offsetWidth = document.body.offsetWidth;
subjData.offsetHeight = document.body.offsetHeight;

// get viewBox size from whole SVG
const elemSpecs = {
  outerSVG: {
    ID: document.getElementById('outer-svg'),
    origViewBoxX: parseFloat(document.getElementById('outer-svg').getAttribute('viewBox').split(' ')[0]),
    origViewBoxY: parseFloat(document.getElementById('outer-svg').getAttribute('viewBox').split(' ')[1]),
    origViewBoxWidth: parseFloat(document.getElementById('outer-svg').getAttribute('viewBox').split(' ')[2]),
    origViewBoxHeight: parseFloat(document.getElementById('outer-svg').getAttribute('viewBox').split(' ')[3]),
  },
};

// ---------------------------------------------------------------------------------------------------------------------
// GET ALL RELEVANT ELEMENTS IN SVG
// ---------------------------------------------------------------------------------------------------------------------
const instructionSlide = document.getElementById('instructions');
const transitionSlide = document.getElementById('transition');
const goodbyeSlide = document.getElementById('goodbye');
const experimentSlide = document.getElementById('experiment');

const instructionButton = document.getElementById('instructions-button');
const transitionButton = document.getElementById('transition-button');
const goodbyeButton = document.getElementById('goodbye-button');
const losgehtsButton = document.getElementById('experiment-button');
const clickBubble = document.getElementById('click-bubble');
const fiveBoxes = document.getElementById('five-boxes');
const hedge = document.getElementById('hedge');

// if you change animal agents or targets, then change ID here...
const pig = document.getElementById('pig');
const monkey = document.getElementById('monkey');
const sheep = document.getElementById('sheep');
const agentsSingle = [pig, monkey, sheep];

// NOTE: we believe that all target objects are the same size here!!
const balloonBlue = document.getElementById('balloon-blue');
const balloonRed = document.getElementById('balloon-red');
const balloonYellow = document.getElementById('balloon-yellow');
const balloonGreen = document.getElementById('balloon-green');
const targetsSingle = [balloonBlue, balloonRed, balloonYellow, balloonGreen];

elemSpecs.eyes = {};
const agentsChar = ['pig', 'monkey', 'sheep'];
agentsChar.forEach((agent) => {
  elemSpecs.eyes[agent] = {
    radius: document.getElementById(`${agent}-pupil-left`).getAttribute('r'),
    left: {
      center: {
        x: document.getElementById(`${agent}-pupil-left`).getAttribute('cx'),
        y: document.getElementById(`${agent}-pupil-left`).getAttribute('cy'),
      },
    },
    right: {
      center: {
        x: document.getElementById(`${agent}-pupil-right`).getAttribute('cx'),
        y: document.getElementById(`${agent}-pupil-right`).getAttribute('cy'),
      },
    },
  };
});
// calculate some target positions:
// get position on the very right (as constraint) and mid of the screen
const borderRight = elemSpecs.outerSVG.origViewBoxWidth - balloonBlue.getBBox().width;
const positionMid = elemSpecs.outerSVG.origViewBoxWidth / 2 - balloonBlue.getBBox().width / 2;
// eslint-disable-next-line max-len
const viewBoxCenter = `-${positionMid} -${elemSpecs.outerSVG.origViewBoxHeight / 2.8} ${elemSpecs.outerSVG.origViewBoxWidth} ${elemSpecs.outerSVG.origViewBoxHeight}`;

// calculate y coords for balloon (-10 for little distance from border)
const hedgeMidY = elemSpecs.outerSVG.origViewBoxHeight - balloonBlue.getBBox().height - 25;

// define from which point onwards the balloon is hidden behind hedge
// BBox of hedge is a bit too high to hide balloon, therefore / 1.1
// eslint-disable-next-line max-len
const viewBoxHidden = `-${positionMid} -${elemSpecs.outerSVG.origViewBoxHeight - hedge.getBBox().height / 1.1} ${elemSpecs.outerSVG.origViewBoxWidth} ${elemSpecs.outerSVG.origViewBoxHeight}`;
// placeholder x for random horizontal position. y value and width, height always stays same
const viewBoxRandom = `-x -${hedgeMidY} ${elemSpecs.outerSVG.origViewBoxWidth} ${elemSpecs.outerSVG.origViewBoxHeight}`;

elemSpecs.targets = {
  viewBoxCenter,
  viewBoxHidden,
  viewBoxRandom,
  borderRight,
};

// ---------------------------------------------------------------------------------------------------------------------
// TRIAL NUMBER & RANDOMIZATION OF AGENTS, TARGETS AND TARGET POSITIONS
// ---------------------------------------------------------------------------------------------------------------------
const famNr = 2;
const testNr = 2;
let trialCount = 0;
const exp = randomizeTrials(famNr, testNr, agentsSingle, targetsSingle, elemSpecs, subjData);
console.log('exp object', exp);

// ---------------------------------------------------------------------------------------------------------------------
// DEFINE EVENTLISTENER FUNCTIONS
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN INSTRUCTION BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
// in order to pass on event to function
const handleInstructionClick = (event) => {
  event.preventDefault();

  showSlide([experimentSlide],
    [instructionSlide, transitionSlide, goodbyeSlide, clickBubble, fiveBoxes]);

  prepareTrial(exp, trialCount);
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN TRANSITION BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
const handleTransitionClick = (event) => {
  event.preventDefault();

  showSlide([experimentSlide, fiveBoxes],
    [instructionSlide, transitionSlide, goodbyeSlide, clickBubble]);

  prepareTrial(exp, trialCount);
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN GOODBYE BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
const handleGoodbyeClick = (event) => {
  event.preventDefault();

  showSlide([],
    [goodbyeSlide]);

  downloadData(exp.responseLog, subjData.subjID);
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN TARGET IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
const handleTargetClick = async function tmp(event) {
  exp.elemSpecs.outerSVG.ID.removeEventListener('click', handleWrongClick, false);
  event.preventDefault();
  // exp.responseLog[trialCount].responseTime = new Date().getTime() - t0;
  logResponse(event, exp, trialCount);
  console.log('responseLog: ', exp.responseLog[trialCount]);
  await pause(1000);

  // prepare next trial
  trialCount += 1;
  // still in fam trials
  if (trialCount < famNr) {
    prepareTrial(exp, trialCount);
    // transition between fam and test trials
  } else if (trialCount === famNr) {
    showSlide([transitionSlide],
      [experimentSlide, pig, monkey, sheep, balloonBlue, balloonRed, balloonYellow, balloonGreen]);
    // test trials
  } else if (trialCount < exp.trialType.length) {
    prepareTrial(exp, trialCount);
    // all trials done
  } else if (trialCount === exp.trialType.length) {
    showSlide([goodbyeSlide],
      [experimentSlide, hedge, pig, monkey, sheep, balloonBlue, balloonRed, balloonYellow, balloonGreen, fiveBoxes]);
  }
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN WRONG CLICK
// ---------------------------------------------------------------------------------------------------------------------
const handleWrongClick = (event) => {
  event.preventDefault();
  const screenScalingHeight = elemSpecs.outerSVG.origViewBoxHeight / subjData.offsetHeight;
  const clickY = event.clientY - exp.elemSpecs.outerSVG.ID.getBoundingClientRect().top;
  const clickScaledY = screenScalingHeight * clickY;
  if (clickScaledY < (elemSpecs.outerSVG.origViewBoxHeight - hedge.getBBox().height)) {
    document.getElementById('negative-sound').play();
  }
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN "los geht's" BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
const handleLosgehtsClick = async function tmp(event) {
  event.preventDefault();
  console.log('');
  console.log('trial: ', trialCount);
  await changeGaze(exp, trialCount);
  // TODO log response time => how to pass on parameter?
  // maybe this helps?:
  // const handleClick = (event) => clickDistanceFromTarget(event, targets[trialCount], outerSVG, responseLog);
  // const t0 = new Date().getTime();
  if (exp.subjData.touchScreen || exp.trialType[trialCount] === 'fam') {
    hedge.addEventListener('click', handleTargetClick, { capture: false, once: true });
  } else if (!exp.subjData.touchScreen) {
    hedge.setAttribute('pointer-events', 'none');
    fiveBoxes.addEventListener('click', handleTargetClick, { capture: false, once: true });
  }
  exp.elemSpecs.outerSVG.ID.addEventListener('click', handleWrongClick, false);
};
// ---------------------------------------------------------------------------------------------------------------------
// ACTUALLY RUNNING:
// ---------------------------------------------------------------------------------------------------------------------
// INSTRUCTION: show slide
showSlide([instructionSlide],
  [transitionSlide, experimentSlide, goodbyeSlide]);

// add event listeners
instructionButton.addEventListener('click', handleInstructionClick, { capture: false, once: true });
losgehtsButton.addEventListener('click', handleLosgehtsClick, { capture: false });
transitionButton.addEventListener('click', handleTransitionClick, { capture: false, once: true });
goodbyeButton.addEventListener('click', handleGoodbyeClick, { capture: false, once: true });

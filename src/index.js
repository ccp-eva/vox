import logResponse from './js/logResponse';
import prepareTrial from './js/prepareTrial';
import changeGaze from './js/changeGaze';
import pause from './js/pause';
import randomizeTrials from './js/randomizeTrials';
import downloadData from './js/downloadData';
import checkForTouchscreen from './js/checkForTouchscreen';
import showSlide from './js/showSlide';

// ---------------------------------------------------------------------------------------------------------------------
// EXP OBJECT
// in this object, we save all of our variables, easier to pass on to functions
// NOTE: we do manipulate this object in our functions!
// ---------------------------------------------------------------------------------------------------------------------
const exp = {};

// ---------------------------------------------------------------------------------------------------------------------
// PARTICIPANT ID
// ---------------------------------------------------------------------------------------------------------------------
exp.subjData = {};
exp.subjData.subjID = 'testID';

// ---------------------------------------------------------------------------------------------------------------------
// SVG & SCREEN SIZE
// TODO find more elegant solution to tell user to view on fullscreen
// if (clientWidth < 600 || clientHeight < 200) alert('Please view on bigger screen!');
// ---------------------------------------------------------------------------------------------------------------------
exp.subjData.touchScreen = checkForTouchscreen();
exp.subjData.offsetWidth = document.body.offsetWidth;
exp.subjData.offsetHeight = document.body.offsetHeight;

// get viewBox size from whole SVG
exp.elemSpecs = {
  outerSVG: {
    ID: document.getElementById('outer-svg'),
    origViewBox: document.getElementById('outer-svg').getAttribute('viewBox'),
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

// save the original eye positions (so when eye is in the center)
exp.elemSpecs.eyes = {};
const agentsChar = ['pig', 'monkey', 'sheep'];
agentsChar.forEach((agent) => {
  exp.elemSpecs.eyes[agent] = {
    radius: document.getElementById(`${agent}-eyeline-left`).getAttribute('r'),
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

// calculate some positions of the targets
// get position on the mid of the screen
const positionMid = exp.elemSpecs.outerSVG.origViewBoxWidth / 2 - balloonBlue.getBBox().width / 2;
// calculate y coords for balloon (-25 for little distance from lower border)
const hedgeMidY = exp.elemSpecs.outerSVG.origViewBoxHeight - balloonBlue.getBBox().height - 25;

exp.elemSpecs.targets = {
  // 2.8, so that we can still see our agents and they don't get covered by balloons
  viewBoxCenter: `-${positionMid} -${exp.elemSpecs.outerSVG.origViewBoxHeight / 2.8} ${exp.elemSpecs.outerSVG.origViewBoxWidth} ${exp.elemSpecs.outerSVG.origViewBoxHeight}`,
  // define from which point onwards the balloon is hidden behind hedge
  // BBox of hedge is a bit too high to hide balloon (because of single grass halms), therefore / 1.1
  viewBoxHidden: `-${positionMid} -${exp.elemSpecs.outerSVG.origViewBoxHeight - hedge.getBBox().height / 1.1} ${exp.elemSpecs.outerSVG.origViewBoxWidth} ${exp.elemSpecs.outerSVG.origViewBoxHeight}`,
  // placeholder x for random horizontal position. y value and width, height always stays same
  viewBoxRandom: `-x -${hedgeMidY} ${exp.elemSpecs.outerSVG.origViewBoxWidth} ${exp.elemSpecs.outerSVG.origViewBoxHeight}`,
  // right side of screen as upper boundary
  borderRight: exp.elemSpecs.outerSVG.origViewBoxWidth - balloonBlue.getBBox().width,
};

// ---------------------------------------------------------------------------------------------------------------------
// TRIAL NUMBER & RANDOMIZATION OF AGENTS, TARGETS AND TARGET POSITIONS
// ---------------------------------------------------------------------------------------------------------------------
exp.trials = {};
exp.trials.famNr = 1;
exp.trials.testNr = 2;
exp.trials.totalNr = exp.trials.famNr + exp.trials.testNr;
// this variable stores in which trial we currently are!
exp.trials.count = 0;

// create arrays with agents, targets, positions etc. for all the trials
randomizeTrials(exp, agentsSingle, targetsSingle);
console.log('exp object', exp);

// ---------------------------------------------------------------------------------------------------------------------
// DEFINE EVENTLISTENER FUNCTIONS
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN INSTRUCTION BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
// save in const variables in order to pass on event to function
const handleInstructionClick = (event) => {
  event.preventDefault();

  // showSlide: first array gets shown, second array gets hidden
  showSlide([experimentSlide, fiveBoxes],
    [instructionSlide, transitionSlide, goodbyeSlide, clickBubble]);

  // shows only relevant elements etc.
  prepareTrial(exp);
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN TRANSITION BUTTON IS CLICKED (between fam and test trials)
// (nearly same as instruction click!)
// ---------------------------------------------------------------------------------------------------------------------
const handleTransitionClick = (event) => {
  event.preventDefault();

  showSlide([experimentSlide, fiveBoxes],
    [instructionSlide, transitionSlide, goodbyeSlide, clickBubble]);

  prepareTrial(exp);
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN GOODBYE BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
const handleGoodbyeClick = (event) => {
  event.preventDefault();

  showSlide([],
    [goodbyeSlide]);

  downloadData(exp.responseLog, exp.subjData.subjID);
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN TARGET IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
// async so we can await animation!
const handleTargetClick = async function tmp(event) {
  // we save current time, so that we can calculate response time
  exp.responseLog[exp.trials.count].responseTime.t1 = new Date().getTime();
  // remove eventListener that was responsible for "wrong input" sound
  exp.elemSpecs.outerSVG.ID.removeEventListener('click', handleWrongClick, false);
  event.preventDefault();

  // function to save all relevant information
  logResponse(event, exp);
  console.log('responseLog: ', exp.responseLog[exp.trials.count]);

  // so that we don't rush into next trial
  await pause(1000);

  // prepare next trial
  exp.trials.count += 1;

  // then depending on trialcount, decide what happens next...
  // if still in fam trials, prepare trial
  if (exp.trials.count < exp.trials.famNr) {
    prepareTrial(exp);

  // if transition between fam and test trials, show that transition slide
  } else if (exp.trials.count === exp.trials.famNr) {
    showSlide([transitionSlide],
      [experimentSlide, pig, monkey, sheep, balloonBlue, balloonRed, balloonYellow, balloonGreen, fiveBoxes]);

  // if test trial, prepare trial
  } else if (exp.trials.count < exp.trials.totalNr) {
    prepareTrial(exp);

  // if all trials done, show goodbye slide
  } else if (exp.trials.count === exp.trials.totalNr) {
    showSlide([goodbyeSlide],
      [experimentSlide, hedge, pig, monkey, sheep, balloonBlue, balloonRed, balloonYellow, balloonGreen, fiveBoxes]);
  }
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN WRONG CLICK
// ---------------------------------------------------------------------------------------------------------------------
const handleWrongClick = (event) => {
  event.preventDefault();
  // from user screen size, calculate where there was a click
  const screenScalingHeight = exp.elemSpecs.outerSVG.origViewBoxHeight / exp.subjData.offsetHeight;
  const clickY = event.clientY - exp.elemSpecs.outerSVG.ID.getBoundingClientRect().top;
  const clickScaledY = screenScalingHeight * clickY;
  // if that is somewhere above the hedge (e.g. on the agents), play "negative" feedback sound
  if (clickScaledY < (exp.elemSpecs.outerSVG.origViewBoxHeight - hedge.getBBox().height)) {
    document.getElementById('negative-sound').play();
  }
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN "los geht's" BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
const handleLosgehtsClick = async function tmp(event) {
  event.preventDefault();
  console.log('');
  console.log('trial: ', exp.trials.count);

  // animate balloon & eye movement to randomized positions
  await changeGaze(exp);

  // save current time to calculate response time later
  exp.responseLog[exp.trials.count].responseTime = {
    t0: new Date().getTime(),
    t1: 0,
  };

  // debugging frozen animation
  console.log('current targetViewBox', exp.targets[exp.trials.count].getAttribute('viewBox'));
  console.log('center targetViewBox', exp.elemSpecs.targets.viewBoxCenter);
  console.log('changed targetViewBox?',
    !(exp.elemSpecs.targets.viewBoxCenter === exp.targets[exp.trials.count].getAttribute('viewBox')));

  // depending on experiment version, users click on hedge or boxes
  if (exp.subjData.touchScreen || exp.trials.type[exp.trials.count] === 'fam') {
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
  [transitionSlide, experimentSlide, goodbyeSlide, pig, monkey, sheep, balloonBlue, balloonRed, balloonYellow, balloonGreen]);

// add event listeners
instructionButton.addEventListener('click', handleInstructionClick, { capture: false, once: true });
losgehtsButton.addEventListener('click', handleLosgehtsClick, { capture: false });
transitionButton.addEventListener('click', handleTransitionClick, { capture: false, once: true });
goodbyeButton.addEventListener('click', handleGoodbyeClick, { capture: false, once: true });

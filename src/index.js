import clickDistanceFromTarget from './js/clickDistanceFromTarget';
import prepareTrial from './js/prepareTrial';
import changeGaze from './js/changeGaze';
import pause from './js/pause';
import randomizeTrials from './js/randomizeTrials';
import downloadData from './js/downloadData';
import checkForTouchscreen from './js/checkForTouchscreen';

// TODO response logging in exp object?
// ---------------------------------------------------------------------------------------------------------------------
// PARTICIPANT ID
// ---------------------------------------------------------------------------------------------------------------------
const subjData = {};
subjData.participantID = 'testID';
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
const experimentButton = document.getElementById('experiment-button');
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
    leftCX: document.getElementById(`${agent}-pupil-left`).getAttribute('cx'),
    leftCY: document.getElementById(`${agent}-pupil-left`).getAttribute('cy'),
    rightCX: document.getElementById(`${agent}-pupil-right`).getAttribute('cx'),
    rightCY: document.getElementById(`${agent}-pupil-right`).getAttribute('cy'),
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
const famNr = 5;
const testNr = 5;
const exp = randomizeTrials(famNr, testNr, agentsSingle, targetsSingle, elemSpecs, subjData);
console.log('exp object', exp);
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
  const screenScalingHeight = elemSpecs.outerSVG.origViewBoxHeight / subjData.offsetHeight;
  const clickY = event.clientY - exp.elemSpecs.outerSVG.ID.getBoundingClientRect().top;
  const clickScaledY = screenScalingHeight * clickY;
  if (clickScaledY < (elemSpecs.outerSVG.origViewBoxHeight - hedge.getBBox().height)) {
    document.getElementById('negative-sound').play();
  }
};

// ---------------------------------------------------------------------------------------------------------------------
// SPECIFY ORDER OF ONE TRIAL
// ---------------------------------------------------------------------------------------------------------------------
async function runTrial(exp, trialCount) {
  console.log(' ');
  console.log('trial Nr: ', trialCount);

  // before trial starts, prepare it and hide underneath blurr
  prepareTrial(exp, trialCount);

  // wait for user to start trial
  experimentButton.addEventListener('click', handleClick, { capture: false, once: true });
  await waitForClick();
  experimentButton.removeEventListener('click', handleClick);

  // animate target and eye movements
  // during trial presentation, nothing can be clicked
  // function resolves promise with pupil & animation values which we log later
  const {
    pupilLeft,
    pupilRight,
    durationAnimation,
  } = await changeGaze(exp, trialCount);

  // wait for user response and log response time
  const t0 = new Date().getTime();

  exp.elemSpecs.outerSVG.ID.addEventListener('click', handleWrongClick, false);

  // wait for target click of user (can only click where hedge is/would be)
  // in htlm, <g id="hedge" pointer-events="all">, so that you can click on it even if hidden
  if (exp.subjData.touchScreen || exp.trialType[trialCount] === 'fam') {
    hedge.addEventListener('click', handleClick, { capture: false, once: true });
  } else if (!exp.subjData.touchScreen) {
    hedge.setAttribute('pointer-events', 'none');
    fiveBoxes.addEventListener('click', handleClick, { capture: false, once: true });
  }

  // log where the user clicked
  // logTargetClick hands over clickEvent parameter to clickDistanceFromTarget function
  const logTargetClick = (event) => {
    // (event, target, trialType, outerSVG, responseLog)
    clickDistanceFromTarget(event, exp, trialCount, responseLog);
  };
  if (exp.subjData.touchScreen || exp.trialType[trialCount] === 'fam') {
    hedge.addEventListener('click', logTargetClick, { capture: false, once: true });
  } else if (!exp.subjData.touchScreen) {
    fiveBoxes.addEventListener('click', logTargetClick, { capture: false, once: true });
  }

  await waitForClick();

  hedge.removeEventListener('click', handleClick);
  hedge.removeEventListener('click', logTargetClick);
  fiveBoxes.removeEventListener('click', handleClick);
  fiveBoxes.removeEventListener('click', logTargetClick);
  exp.elemSpecs.outerSVG.ID.removeEventListener('click', handleWrongClick, false);

  // after click, save response time
  const responseTime = new Date().getTime() - t0;

  // log all important trial infos
  responseLog[trialCount].touchScreen = exp.subjData.touchScreen;
  responseLog[trialCount].responseTime = responseTime;
  responseLog[trialCount].trialNr = trialCount + 1;
  responseLog[trialCount].agent = `${exp.agents[trialCount].getAttribute('id')}`;
  responseLog[trialCount].target = `${exp.targets[trialCount].getAttribute('id')}`;
  responseLog[trialCount].trialType = exp.trialType[trialCount];
  responseLog[trialCount].positionBin = exp.positions[trialCount].bin;
  responseLog[trialCount].pupilLeftOrigX = exp.elemSpecs.eyes[responseLog[trialCount].agent].leftCX;
  responseLog[trialCount].pupilLeftOrigY = exp.elemSpecs.eyes[responseLog[trialCount].agent].leftCY;
  responseLog[trialCount].pupilLeftRandomX = parseFloat(pupilLeft.getAttribute('cx'));
  responseLog[trialCount].pupilLeftRandomY = parseFloat(pupilLeft.getAttribute('cy'));
  responseLog[trialCount].pupilRightOrigX = exp.elemSpecs.eyes[responseLog[trialCount].agent].rightCX;
  responseLog[trialCount].pupilRightOrigY = exp.elemSpecs.eyes[responseLog[trialCount].agent].rightCY;
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
async function runAll(exp, trialCount) {
  // INSTRUCTION PHASE
  [transitionSlide, experimentSlide, goodbyeSlide].forEach((element) => {
    element.setAttribute('visibility', 'hidden');
  });
  instructionSlide.setAttribute('visibility', 'visible');

  // wait for user to continue
  instructionButton.addEventListener('click', handleClick, { capture: false, once: true });
  await waitForClick();
  instructionButton.removeEventListener('click', handleClick);

  // FAM PHASE
  [instructionSlide, transitionSlide, goodbyeSlide,
    clickBubble, fiveBoxes,
  ].forEach((element) => {
    element.setAttribute('visibility', 'hidden');
  });
  experimentSlide.setAttribute('visibility', 'visible');

  while (trialCount < famNr) {
    // eslint-disable-next-line no-await-in-loop
    await runTrial(exp, trialCount);
    // eslint-disable-next-line no-param-reassign
    trialCount += 1;
  }

  // TRANSITION PHASE
  [experimentSlide,
    pig, monkey, sheep,
    balloonBlue, balloonRed, balloonYellow, balloonGreen,
  ].forEach((element) => {
    element.setAttribute('visibility', 'hidden');
  });
  transitionSlide.setAttribute('visibility', 'visible');

  // wait for user to continue
  transitionButton.addEventListener('click', handleClick, { capture: false, once: true });
  await waitForClick();
  transitionButton.removeEventListener('click', handleClick);

  // TEST PHASE
  transitionSlide.setAttribute('visibility', 'hidden');
  [experimentSlide, fiveBoxes].forEach((element) => {
    element.setAttribute('visibility', 'visible');
  });

  while (trialCount < exp.trialType.length) {
    // eslint-disable-next-line no-await-in-loop
    await runTrial(exp, trialCount);
    // eslint-disable-next-line no-param-reassign
    trialCount += 1;
  }
  console.log('test phase completed');

  // GOODBYE
  [experimentSlide, hedge,
    pig, monkey, sheep,
    balloonBlue, balloonRed, balloonYellow, balloonGreen,
    fiveBoxes,
  ].forEach((element) => {
    element.setAttribute('visibility', 'hidden');
  });
  goodbyeSlide.setAttribute('visibility', 'visible');

  // wait for user to continue
  goodbyeButton.addEventListener('click', handleClick, { capture: false, once: true });
  await waitForClick();
  goodbyeButton.removeEventListener('click', handleClick);

  // end with blank page
  goodbyeSlide.setAttribute('visibility', 'hidden');

  // locally download data
  downloadData(responseLog, participantID);
}

// CAUTION: trialCount start at zero, ie. first trial = 0
// (because we need first element in array, that's at position 0)
runAll(exp, 0);

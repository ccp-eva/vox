import { gsap } from 'gsap';
import logResponse from './js/logResponse';
import prepareTrial from './js/prepareTrial';
import changeGaze from './js/changeGaze';
import pause from './js/pause';
import randomizeTrials from './js/randomizeTrials';
import downloadData from './js/downloadData';
import checkForTouchscreen from './js/checkForTouchscreen';
import showSlide from './js/showSlide';
import openFullscreen from './js/openFullscreen';
import closeFullscreen from './js/closeFullscreen';
import convertToForeignObject from './js/convertToForeignObject';
import experimentalInstructions from './js/experimentalInstructions';

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
// TRIAL NUMBER
// ---------------------------------------------------------------------------------------------------------------------
exp.trials = {};
exp.trials.famNr = 3;
exp.trials.testNr = 3;
exp.trials.totalNr = exp.trials.famNr + exp.trials.testNr;
// this variable stores in which trial we currently are!
exp.trials.count = 0;

// ---------------------------------------------------------------------------------------------------------------------
// TOUCHSCREEN & SCREEN SIZE
// if (clientWidth < 600 || clientHeight < 200) alert('Please view on bigger screen!');
// ---------------------------------------------------------------------------------------------------------------------
exp.subjData.touchScreen = !checkForTouchscreen();
exp.subjData.offsetWidth = document.body.offsetWidth;
exp.subjData.offsetHeight = document.body.offsetHeight;

// ---------------------------------------------------------------------------------------------------------------------
// ADD INSTRUCTIONS TEXT
// ---------------------------------------------------------------------------------------------------------------------
// add text via rect => foreignObject => innerHTML
const foreignObjects = Array.from(document.querySelectorAll('[id^="foreign-object"]'));
foreignObjects.forEach((elem) => {
  convertToForeignObject(elem);
});

const {
  instructionsHeading,
  instructionsParagraph,
  transitionHeading,
  transitionParagraph,
  goodbyeHeading,
  goodbyeParagraph,
} = experimentalInstructions(exp);

// ---------------------------------------------------------------------------------------------------------------------
// SAVE VIEWBOX VALUES
// ---------------------------------------------------------------------------------------------------------------------
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
const textSlide = document.getElementById('text-slide');
const experimentSlide = document.getElementById('experiment-slide');

const instructionsImgPC = document.getElementById('instructions-img-PC');
const instructionsImgTablet = document.getElementById('instructions-img-tablet');
const transitionImgPC = document.getElementById('transition-img-PC');
const transitionImgTablet = document.getElementById('transition-img-tablet');
const goodbyeImg = document.getElementById('goodbye-img');

const instructionsButton = document.getElementById('instructions-button');
const transitionButton = document.getElementById('transition-button');
const goodbyeButton = document.getElementById('goodbye-button');
const losgehtsButton = document.getElementById('experiment-button');
const clickBubble = document.getElementById('click-bubble');
const clickableArea = document.getElementById('clickable-area');
const hedge = document.getElementById('hedge');

const boxes1Front = document.getElementById('boxes1-front');
const boxes1Back = document.getElementById('boxes1-back');
const boxes2Front = document.getElementById('boxes2-front');
const boxes2Back = document.getElementById('boxes2-back');
const boxes3Front = document.getElementById('boxes3-front');
const boxes3Back = document.getElementById('boxes3-back');
const boxes4Front = document.getElementById('boxes4-front');
const boxes4Back = document.getElementById('boxes4-back');
const boxes5Front = document.getElementById('boxes5-front');
const boxes5Back = document.getElementById('boxes5-back');
const boxes6Front = document.getElementById('boxes6-front');
const boxes6Back = document.getElementById('boxes6-back');
const boxes7Front = document.getElementById('boxes7-front');
const boxes7Back = document.getElementById('boxes7-back');

[boxes1Front, boxes1Back,
  boxes2Front, boxes2Back,
  boxes3Front, boxes3Back,
  boxes4Front, boxes4Back,
  boxes5Front, boxes5Back,
  boxes6Front, boxes6Back,
  boxes7Front, boxes7Back]
  .forEach((box) => {
    box.setAttribute('visibility', 'hidden');
  });
const boxes8Front = document.getElementById('boxes8-front');
const boxes8Back = document.getElementById('boxes8-back');

// boxes8Front.setEnabled

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
      bbox: {
        x: document.getElementById(`${agent}-pupil-left`).getBBox().x, // same as cx - r
        y: document.getElementById(`${agent}-pupil-left`).getBBox().y, // same as cy - r
      },
    },
    right: {
      center: {
        x: document.getElementById(`${agent}-pupil-right`).getAttribute('cx'),
        y: document.getElementById(`${agent}-pupil-right`).getAttribute('cy'),
      },
      bbox: {
        x: document.getElementById(`${agent}-pupil-right`).getBBox().x, // same as cx - r
        y: document.getElementById(`${agent}-pupil-right`).getBBox().y, // same as cy - r
      },
    },
  };
});

// calculate some positions of the targets
exp.elemSpecs.targets = {
  center: {
    x: balloonBlue.getBBox().x,
    y: balloonBlue.getBBox().y,
  },
  // define coords from which point onwards the balloon is hidden behind hedge
  halfway: {
    // position mid, same as in center.x
    x: balloonBlue.getBBox().x,
    // BBox of hedge is a bit too high to hide balloon (because of single grass halms), therefore / 1.1
    y: exp.elemSpecs.outerSVG.origViewBoxHeight - hedge.getBBox().height / 1.1,
  },
  // right side of screen as upper boundary
  borderRight: exp.elemSpecs.outerSVG.origViewBoxWidth - balloonBlue.getBBox().width,
  // calculate y coords for balloon (-20 for little distance from lower border)
  groundY: exp.elemSpecs.outerSVG.origViewBoxHeight - balloonBlue.getBBox().height - 20,
  // define y coord for target to be right above the boxes
  aboveBoxesY: boxes8Front.getBBox().y - balloonBlue.getBBox().height,
  partlyInBoxesY: boxes8Front.getBBox().y - balloonBlue.getBBox().height / 3,
};

// ---------------------------------------------------------------------------------------------------------------------
// RANDOMIZATION OF AGENTS, TARGETS AND TARGET POSITIONS
// ---------------------------------------------------------------------------------------------------------------------
// create arrays with agents, targets, positions etc. for all the trials
randomizeTrials(exp, agentsSingle, targetsSingle);
console.log('exp object', exp);

// gsap timeline that will save our animation specifications
let timeline = null;

// ---------------------------------------------------------------------------------------------------------------------
// DEFINE EVENTLISTENER FUNCTIONS
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN INSTRUCTIONS BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
// save in const variables in order to pass on event to function
const handleInstructionsClick = (event) => {
  event.preventDefault();
  // openFullscreen();

  // showSlide: first array gets shown, second array gets hidden
  showSlide([experimentSlide],
    [textSlide, clickBubble, clickableArea,
      instructionsButton, instructionsImgTablet, instructionsImgPC]);

  // shows only relevant elements etc.
  prepareTrial(exp);
  timeline = gsap.timeline({ paused: true });
  timeline.add(changeGaze(exp));
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN TRANSITION BUTTON IS CLICKED (between fam and test trials)
// (nearly same as instructions click!)
// ---------------------------------------------------------------------------------------------------------------------
const handleTransitionClick = (event) => {
  event.preventDefault();

  showSlide([experimentSlide],
    [textSlide, clickBubble,
      transitionButton, transitionImgTablet, transitionImgPC]);

  prepareTrial(exp);
  timeline = gsap.timeline({ paused: true });
  timeline.add(changeGaze(exp));
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN GOODBYE BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
const handleGoodbyeClick = (event) => {
  event.preventDefault();

  showSlide([],
    [textSlide]);

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
  await pause(500);

  // prepare next trial
  exp.trials.count += 1;

  // then depending on trialcount, decide what happens next...
  // if still in fam trials, prepare trial
  if (exp.trials.count < exp.trials.famNr) {
    prepareTrial(exp);
    timeline = gsap.timeline({ paused: true });
    timeline.add(changeGaze(exp));

  // if transition between fam and test trials, show that transition slide
  } else if (exp.trials.count === exp.trials.famNr) {
    document.getElementById('foreign-object-heading').replaceChild(transitionHeading, instructionsHeading);
    document.getElementById('foreign-object-center-left').replaceChild(transitionParagraph, instructionsParagraph);
    showSlide([textSlide],
      [experimentSlide, instructionsImgPC, instructionsImgTablet,
        hedge, boxes8Front, boxes8Back,
        pig, monkey, sheep,
        balloonBlue, balloonRed, balloonYellow, balloonGreen]);
    if (exp.subjData.touchScreen) {
      transitionImgTablet.setAttribute('visibility', 'visible');
    } else if (!exp.subjData.touchScreen) {
      transitionImgPC.setAttribute('visibility', 'visible');
    }

  // if test trial, prepare trial
  } else if (exp.trials.count < exp.trials.totalNr) {
    prepareTrial(exp);
    timeline = gsap.timeline({ paused: true });
    timeline.add(changeGaze(exp));

  // if all trials done, show goodbye slide
  } else if (exp.trials.count === exp.trials.totalNr) {
    // closeFullscreen();
    document.getElementById('foreign-object-heading').replaceChild(goodbyeHeading, transitionHeading);
    document.getElementById('foreign-object-center-left').replaceChild(goodbyeParagraph, transitionParagraph);
    showSlide([textSlide, goodbyeImg],
      [experimentSlide,
        hedge, boxes8Front, boxes8Back,
        pig, monkey, sheep,
        balloonBlue, balloonRed, balloonYellow, balloonGreen]);
  }
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN WRONG CLICK
// ---------------------------------------------------------------------------------------------------------------------
const handleWrongClick = (event) => {
  event.preventDefault();
  // from participant screen size, calculate where there was a click
  const screenScalingHeight = exp.elemSpecs.outerSVG.origViewBoxHeight / exp.subjData.offsetHeight;
  const clickY = event.clientY - exp.elemSpecs.outerSVG.ID.getBoundingClientRect().top;
  const clickScaledY = screenScalingHeight * clickY;
  // if participant clicked above hedge, play negative feedback sound
  if (clickScaledY < clickableArea.getBBox().y) {
    // count how often a participant clicked in the wrong area
    exp.responseLog[exp.trials.count].wrongClick++;
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

  // hide blurr canvas and button
  document.getElementById('experiment-button').setAttribute('visibility', 'hidden');
  document.getElementById('cover-blurr').setAttribute('visibility', 'hidden');

  // animate balloon & eye movement to randomized positions
  await timeline.play();

  // save current time to calculate response time later
  exp.responseLog[exp.trials.count].responseTime = {
    t0: new Date().getTime(),
    t1: 0,
  };

  // depending on experiment version, participants click on hedge or boxes
  if (exp.subjData.touchScreen) {
    if (exp.trials.type[exp.trials.count] === 'fam') {
      clickableArea.setAttribute('pointer-events', 'all');
      clickableArea.addEventListener('click', handleTargetClick, { capture: false, once: true });
    } else if (exp.trials.type[exp.trials.count] === 'test') {
      clickableArea.setAttribute('pointer-events', 'none');
      hedge.setAttribute('pointer-events', 'all');
      hedge.addEventListener('click', handleTargetClick, { capture: false, once: true });
    }
  } else if (!exp.subjData.touchScreen) {
    clickableArea.setAttribute('pointer-events', 'none');
    hedge.setAttribute('pointer-events', 'none');
    exp.targets[exp.trials.count].addEventListener('click', handleTargetClick, { capture: false, once: true });
    boxes8Front.addEventListener('click', handleTargetClick, { capture: false, once: true });
    boxes8Back.addEventListener('click', handleTargetClick, { capture: false, once: true });

    // if (exp.trials.type[exp.trials.count] === 'fam') {
    //   clickableArea.setAttribute('pointer-events', 'all');
    //   clickableArea.addEventListener('click', handleTargetClick, { capture: false, once: true });
    // } else if (exp.trials.type[exp.trials.count] === 'test') {
    //   clickableArea.setAttribute('pointer-events', 'none');
    //   hedge.setAttribute('pointer-events', 'none');
    //   boxes8Front.addEventListener('click', handleTargetClick, { capture: false, once: true });
    //   boxes8Back.addEventListener('click', handleTargetClick, { capture: false, once: true });
    // }
  }
  exp.elemSpecs.outerSVG.ID.addEventListener('click', handleWrongClick, false);
};
// ---------------------------------------------------------------------------------------------------------------------
// ACTUALLY RUNNING:
// ---------------------------------------------------------------------------------------------------------------------
// INSTRUCTIONS: show slide
document.getElementById('foreign-object-heading').appendChild(instructionsHeading);
document.getElementById('foreign-object-center-left').appendChild(instructionsParagraph);
showSlide([textSlide],
  [experimentSlide, instructionsImgTablet, instructionsImgPC, transitionImgTablet, transitionImgPC, goodbyeImg]);
if (exp.subjData.touchScreen) {
  instructionsImgTablet.setAttribute('visibility', 'visible');
} else if (!exp.subjData.touchScreen) {
  instructionsImgPC.setAttribute('visibility', 'visible');
}

// add event listeners
instructionsButton.addEventListener('click', handleInstructionsClick, { capture: false, once: true });
losgehtsButton.addEventListener('click', handleLosgehtsClick, { capture: false });
transitionButton.addEventListener('click', handleTransitionClick, { capture: false, once: true });
goodbyeButton.addEventListener('click', handleGoodbyeClick, { capture: false, once: true });

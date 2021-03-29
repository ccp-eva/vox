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
import experimentalInstructions from './js/experimentalInstructions';
import playFullAudio from './js/playFullAudio';
// import calculateBoxPositions from './js/calculateBoxPositions';

// TODO hedge!!

// ---------------------------------------------------------------------------------------------------------------------
// EXP OBJECT
// in this object, we save all of our variables, easier to pass on to functions
// NOTE: we do manipulate this object in our functions!
// ---------------------------------------------------------------------------------------------------------------------
const exp = {};

// ---------------------------------------------------------------------------------------------------------------------
// PARTICIPANT ID & TOUCH
// ---------------------------------------------------------------------------------------------------------------------
exp.subjData = {};
exp.subjData.subjID = 'testID';
// just for developing: turn off fullscreen mode
const fullscreen = false;
exp.subjData.touchScreen = !checkForTouchscreen();

// ---------------------------------------------------------------------------------------------------------------------
// TRIAL SPECIFICATIONS
// ---------------------------------------------------------------------------------------------------------------------
exp.trials = {};
exp.trials.trainNr = 2;
exp.trials.famNr = 2;
exp.trials.testNr = 2;
exp.trials.totalNr = exp.trials.trainNr + exp.trials.famNr + exp.trials.testNr;
// this variable stores in which trial we currently are!
exp.trials.count = 0;
// NOTE: make sure, that the number of voice over fits to the nr of training, fam and test trials!!
exp.trials.voiceoverNr = 1;

// ---------------------------------------------------------------------------------------------------------------------
// SCREEN SIZE
// if (clientWidth < 600 || clientHeight < 200) alert('Please view on bigger screen!');
// ---------------------------------------------------------------------------------------------------------------------
exp.subjData.offsetWidth = document.body.offsetWidth;
exp.subjData.offsetHeight = document.body.offsetHeight;

// ---------------------------------------------------------------------------------------------------------------------
// ADD INSTRUCTIONS TEXT
// ---------------------------------------------------------------------------------------------------------------------
// add text via rect => foreignObject => innerHTML
const foreignObjects = Array.from(document.querySelectorAll('[id^="foreign-object"]'));
foreignObjects.forEach((elem) => {
  const obj = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'foreignObject',
  );
  [...elem.attributes].map(({ name, value }) => obj.setAttribute(name, value));
  elem.replaceWith(obj);
});

const {
  instructionsTrainHeading,
  instructionsTrainParagraph,
  instructionsTrainImage,

  instructionsFamHeading,
  instructionsFamParagraph,
  instructionsFamImage,

  instructionsTestHeading,
  instructionsTestParagraph,
  instructionsTestImage,

  goodbyeHeading,
  goodbyeParagraph,
  goodbyeImage,
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

const instructionsTrainButton = document.getElementById('instructions-train-button');
const instructionsFamButton = document.getElementById('instructions-fam-button');
const instructionsTestButton = document.getElementById('instructions-test-button');
const goodbyeButton = document.getElementById('goodbye-button');
const losgehtsButton = document.getElementById('experiment-button');
const clickBubble = document.getElementById('click-bubble');
const clickableArea = document.getElementById('clickable-area');

const speaker = document.getElementById('speaker');
const audioWelcome = document.getElementById('audio-welcome');

const audioInstructionsTablet = document.getElementById('audio-instructions-tablet');
const audioInstructionsPC = document.getElementById('audio-instructions-PC');
const audioTransitionTablet = document.getElementById('audio-transition-tablet');
const audioTransitionPC = document.getElementById('audio-transition-PC');
const audioGoodbye = document.getElementById('audio-goodbye');
const audioGeneralPrompt = document.getElementById('audio-general-prompt');
const audioTrainingPrompt = document.getElementById('audio-train-prompt');

const audioReminderTablet = document.getElementById('audio-reminder-tablet');
const audioReminderPC = document.getElementById('audio-reminder-PC');

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

exp.elemSpecs.boxes = {
  width: boxes1Front.getBBox().width,
  height: boxes1Front.getBBox().height,
};

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
  // partlyInBoxesY: boxes8Front.getBBox().y - balloonBlue.getBBox().height / 3,
};

// ---------------------------------------------------------------------------------------------------------------------
// RANDOMIZATION OF AGENTS, TARGETS AND TARGET POSITIONS
// ---------------------------------------------------------------------------------------------------------------------
// create arrays with agents, targets, positions etc. for all the trials
randomizeTrials(exp, agentsSingle, targetsSingle);
console.log('exp object', exp);

// gsap timeline that will save our animation specifications
let timeline = null;
let targetClickTimer5sec = null;
// const targetClickTimer10sec = null;

// ---------------------------------------------------------------------------------------------------------------------
// DEFINE EVENTLISTENER FUNCTIONS
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN INSTRUCTIONS BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
// save in const variables in order to pass on event to function
const handleInstructionsClick = (event) => {
  event.preventDefault();
  if (fullscreen) openFullscreen();

  // showSlide: first array gets shown, second array gets hidden
  showSlide([experimentSlide],
    [textSlide, clickBubble, clickableArea]);

  // shows only relevant elements etc.
  prepareTrial(exp);
  timeline = gsap.timeline({ paused: true });
  timeline.add(changeGaze(exp));
  exp.responseLog[exp.trials.count].durationAnimationComplete = timeline.duration();
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN TRANSITION BUTTON IS CLICKED (between fam and test trials)
// (nearly same as instructions click!)
// ---------------------------------------------------------------------------------------------------------------------
const handleTransitionClick = (event) => {
  event.preventDefault();

  showSlide([experimentSlide],
    [textSlide, clickBubble]);

  prepareTrial(exp);
  timeline = gsap.timeline({ paused: true });
  timeline.add(changeGaze(exp));
  exp.responseLog[exp.trials.count].durationAnimationComplete = timeline.duration();
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
// RUNS WHEN "los geht's" BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
const handleLosgehtsClick = async function tmp(event) {
  event.preventDefault();
  console.log('');
  console.log('trial: ', exp.trials.count);

  // hide blurr canvas and button
  showSlide([], [document.getElementById('experiment-button'), document.getElementById('cover-blurr')]);

  // animate balloon & eye movement to randomized positions
  await timeline.play();
  await pause(200);
  audioTrainingPrompt.play();

  // save current time to calculate response time later
  exp.responseLog[exp.trials.count].responseTime = {
    t0: new Date().getTime(),
    t1: 0,
  };

  targetClickTimer5sec = window.setTimeout(noTargetClickWithin5sec, 5000);

  switch (true) {
    case exp.trials.type[exp.trials.count] === 'train':
      clickableArea.setAttribute('pointer-events', 'all');
      clickableArea.addEventListener('click', handleTargetClick, { capture: false, once: true });
      break;
    case exp.trials.boxesNr[exp.trials.count] === 0:
      clickableArea.setAttribute('pointer-events', 'none');
      hedge.addEventListener('click', handleTargetClick, { capture: false, once: true });
      break;
    case exp.trials.boxesNr[exp.trials.count] > 0:
      clickableArea.setAttribute('pointer-events', 'none');
      boxes8Front.addEventListener('click', handleTargetClick, { capture: false, once: true });
      boxes8Back.addEventListener('click', handleTargetClick, { capture: false, once: true });
      break;
    default:
      console.error('Error in setting event listeners');
  }
  exp.elemSpecs.outerSVG.ID.addEventListener('click', handleWrongClick, false);
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN TARGET (HEDGE OR BOX) IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
// async so we can await animation!
const handleTargetClick = async function tmp(event) {
  // stop audio that is potentially playing
  audioTrainingPrompt.pause();
  audioTrainingPrompt.currentTime = 0;
  audioReminderTablet.pause();
  audioReminderTablet.currentTime = 0;
  audioReminderPC.pause();
  audioReminderPC.currentTime = 0;

  // we save current time, so that we can calculate response time
  exp.responseLog[exp.trials.count].responseTime.t1 = new Date().getTime();

  // clear timer that awaits participant's click
  // otherwise, it will run even after target click
  clearTimeout(targetClickTimer5sec);
  // clearTimeout(targetClickTimer10sec);

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
  console.log('trialnr', exp.trials.count);

  // then depending on trialcount, decide what happens next...
  switch (true) {
    // for training trials
    case exp.trials.count < exp.trials.trainNr:
      prepareTrial(exp);
      timeline = gsap.timeline({ paused: true });
      timeline.add(changeGaze(exp));
      exp.responseLog[exp.trials.count].durationAnimationComplete = timeline.duration();
      break;

    // for transition from training into familiarization
    case exp.trials.count === exp.trials.trainNr:
      document.getElementById('foreign-object-heading').replaceChild(instructionsFamHeading, instructionsTrainHeading);
      document.getElementById('foreign-object-center-left').replaceChild(instructionsFamParagraph, instructionsTrainParagraph);
      document.getElementById('foreign-object-center-right').replaceChild(instructionsFamImage, instructionsTrainImage);

      showSlide([textSlide],
        [experimentSlide,
          hedge, boxes8Front, boxes8Back,
          pig, monkey, sheep,
          balloonBlue, balloonRed, balloonYellow, balloonGreen, instructionsTrainButton]);

      break;

    // for familiarization trials
    case exp.trials.count < exp.trials.trainNr + exp.trials.famNr:
      prepareTrial(exp);
      timeline = gsap.timeline({ paused: true });
      timeline.add(changeGaze(exp));
      exp.responseLog[exp.trials.count].durationAnimationComplete = timeline.duration();
      break;

    // for transition from familiarization to test trials
    case exp.trials.count === exp.trials.trainNr + exp.trials.famNr:
      document.getElementById('foreign-object-heading').replaceChild(instructionsTestHeading, instructionsFamHeading);
      document.getElementById('foreign-object-center-left').replaceChild(instructionsTestParagraph, instructionsFamParagraph);
      document.getElementById('foreign-object-center-right').replaceChild(instructionsTestImage, instructionsFamImage);

      showSlide([textSlide],
        [experimentSlide,
          hedge, boxes8Front, boxes8Back,
          pig, monkey, sheep,
          balloonBlue, balloonRed, balloonYellow, balloonGreen, instructionsFamButton]);
      break;

    // for test trials
    case exp.trials.count < exp.trials.totalNr:
      prepareTrial(exp);
      timeline = gsap.timeline({ paused: true });
      timeline.add(changeGaze(exp));
      exp.responseLog[exp.trials.count].durationAnimationComplete = timeline.duration();
      break;

    // for goodbye after test trials
    case exp.trials.count === exp.trials.totalNr:
      if (fullscreen) closeFullscreen();
      document.getElementById('foreign-object-heading').replaceChild(goodbyeHeading, instructionsTestHeading);
      document.getElementById('foreign-object-center-left').replaceChild(goodbyeParagraph, instructionsTestParagraph);
      document.getElementById('foreign-object-center-right').replaceChild(goodbyeImage, instructionsTestImage);

      showSlide([textSlide],
        [experimentSlide,
          hedge, boxes8Front, boxes8Back,
          pig, monkey, sheep,
          balloonBlue, balloonRed, balloonYellow, balloonGreen, instructionsTestButton]);
      break;

    // error handling
    default:
      console.error('Error in specifying next trial');
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
  if (clickScaledY < hedge.getBBox().y) {
    // count how often a participant clicked in the wrong area
    exp.responseLog[exp.trials.count].wrongClick++;
    // IF WANTED: NEGATIVE FEEDBACK FOR NOT CLICKING IN THE HEDGE/BOX AREA
    // audioNegativeFeedback.play();
  }
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN SPEAKER IN INSTRUCTIONS HAS BEEN CLICKED
// ---------------------------------------------------------------------------------------------------------------------
// TODO switch? audio for new transition!
const handleSpeakerClick = async function tmp(event) {
  event.preventDefault();
  switch (true) {
    // for training trials
    case exp.trials.count === 0:
      await playFullAudio(audioWelcome, instructionsTrainButton);
      showSlide([instructionsTrainButton], []);
      break;

    // for tablet hedge version fam trials
    case exp.trials.boxesNr[exp.trials.count] === 0 && exp.trials.count === exp.trials.trainNr:
      await playFullAudio(audioInstructionsTablet, instructionsFamButton);
      showSlide([instructionsFamButton], []);
      break;

    // for tablet hedge version test trials
    case exp.trials.boxesNr[exp.trials.count] === 0 && exp.trials.count === exp.trials.trainNr + exp.trials.famNr:
      await playFullAudio(audioTransitionTablet, instructionsTestButton);
      showSlide([instructionsTestButton], []);
      break;

    // for PC box version fam trials
    case exp.trials.boxesNr[exp.trials.count] > 0 && exp.trials.count === exp.trials.trainNr:
      await playFullAudio(audioInstructionsPC, instructionsFamButton);
      showSlide([instructionsFamButton], []);
      break;

    // for PC box version test trials
    case exp.trials.boxesNr[exp.trials.count] > 0 && exp.trials.count === exp.trials.trainNr + exp.trials.famNr:
      await playFullAudio(audioTransitionPC, instructionsTestButton);
      showSlide([instructionsTestButton], []);
      break;

    default:
      console.error('Error in playing instructions');
  }
};

// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN PARTICIPANT HASN'T CLICKED WITHIN CERTAIN AMOUNT OF TIME
// ---------------------------------------------------------------------------------------------------------------------
// TODO one audio for hedge, one for boxes
let noTargetClickWithin5sec = () => {
  if (exp.trials.boxesNr[exp.trials.count] === 0) {
    audioGeneralPrompt.play();
  } else if (exp.trials.boxesNr[exp.trials.count] > 0) {
    audioGeneralPrompt.play();
  }
};
// ---------------------------------------------------------------------------------------------------------------------
// ACTUALLY RUNNING:
// ---------------------------------------------------------------------------------------------------------------------
// INSTRUCTIONS: show slide
document.getElementById('foreign-object-heading').appendChild(instructionsTrainHeading);
document.getElementById('foreign-object-center-left').appendChild(instructionsTrainParagraph);
document.getElementById('foreign-object-center-right').appendChild(instructionsTrainImage);
showSlide([textSlide],
  // first hide buttons, participants can only start once they listened to the instructions
  // [experimentSlide, instructionsTrainButton, instructionsFamButton, instructionsTestButton, goodbyeButton]);
  // dev mode: show buttons to jump ahead audio instructions
  [experimentSlide]);

// add event listeners
instructionsTrainButton.addEventListener('click', handleInstructionsClick, { capture: false, once: true });
instructionsFamButton.addEventListener('click', handleTransitionClick, { capture: false, once: true });
instructionsTestButton.addEventListener('click', handleTransitionClick, { capture: false, once: true });
goodbyeButton.addEventListener('click', handleGoodbyeClick, { capture: false, once: true });
losgehtsButton.addEventListener('click', handleLosgehtsClick, { capture: false });
speaker.addEventListener('click', handleSpeakerClick, { capture: false, once: false });

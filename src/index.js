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

// get url object
const url = new URL(window.location.href);

// use id parameter’s value if available else use 'testID'
exp.subjData.subjID = url.searchParams.get('id') || 'testID';

// just for developing: turn off fullscreen mode
const fullscreen = true;
exp.subjData.touchScreen = checkForTouchscreen();

// ---------------------------------------------------------------------------------------------------------------------
// TRIAL SPECIFICATIONS
// ---------------------------------------------------------------------------------------------------------------------
exp.trials = {};
exp.trials.trainNr = 1;
exp.trials.famNr = 2;
exp.trials.testNr = 11;
exp.trials.totalNr = exp.trials.trainNr + exp.trials.famNr + exp.trials.testNr;
// this variable stores in which trial we currently are!
exp.trials.count = 0;
// NOTE: make sure, that the number of voice over fits to the nr of training, fam and test trials!!
exp.trials.voiceoverNr = 1;
// constant number of boxes for PC version
exp.trials.boxVersion = 3;

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
const audioAll = document.getElementsByTagName('audio');
const audioWelcome = document.getElementById('audio-welcome');
const audioGoodbye = document.getElementById('audio-goodbye');

const audioGeneralPrompt = document.getElementById('audio-general-prompt');
const audioPromptHedge = document.getElementById('audio-prompt-hedge');
const audioPromptBox = document.getElementById('audio-prompt-box');

const audioPromptTrain = document.getElementById('audio-prompt-train');
const audioPromptTrainLong = document.getElementById('audio-prompt-train-long');

const audioTestHedge3 = document.getElementById('audio-test-hedge-3');
const audioTestBox3 = document.getElementById('audio-test-box-3');

const hedge = document.getElementById('hedge');
const boxes1Front = document.getElementById('boxes1-front');

// console.log('boxes8-test'.replace(/\d+/, 'test'));
const boxesAllFront = Array.from(document.querySelectorAll('[id$=-front]'));
const boxesAllBack = Array.from(document.querySelectorAll('[id$=-back]'));

boxesAllFront.forEach((box) => {
  box.setAttribute('visibility', 'hidden');
});
boxesAllBack.forEach((box) => {
  box.setAttribute('visibility', 'hidden');
});

// take first box as reference for box measurements
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
  aboveBoxesY: boxes1Front.getBBox().y - balloonBlue.getBBox().height,
  // partlyInBoxesY: boxes1Front.getBBox().y - balloonBlue.getBBox().height / 3,
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

// ---------------------------------------------------------------------------------------------------------------------
// DEFINE EVENTLISTENER FUNCTIONS
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN INSTRUCTIONS BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
// save in const variables in order to pass on event to function
const handleInstructionsTrainClick = (event) => {
  event.preventDefault();

  // showSlide: first array gets shown, second array gets hidden
  showSlide([experimentSlide],
    [textSlide, clickBubble, clickableArea, instructionsTrainButton]);

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
    [textSlide, clickBubble, instructionsFamButton, instructionsTestButton]);

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
  if (fullscreen) closeFullscreen();

  showSlide([],
    [textSlide, speaker, goodbyeButton]);

  // downloadData(exp.responseLog, exp.subjData.subjID);
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

  // set event listener to see whether participants click too early
  exp.elemSpecs.outerSVG.ID.addEventListener('click', handleEarlyClick, false);

  // animate balloon & eye movement to randomized positions
  await timeline.play();
  await pause(200);

  switch (true) {
    // for any trial without voiceover
    case !exp.trials.voiceover[exp.trials.count]:
      audioGeneralPrompt.play();
      break;

    // for train trials with voiceover
    case exp.trials.type[exp.trials.count] === 'train':
      await playFullAudio(audioPromptTrainLong, null);
      break;

    // for tablet hedge version fam trials with voiceover
    case exp.trials.type[exp.trials.count] === 'fam'
            && exp.trials.boxesNr[exp.trials.count] === 0:
      await playFullAudio(audioPromptHedge, null);
      break;

    // for tablet hedge version test trials with voiceover
    case exp.trials.type[exp.trials.count] === 'test'
      && exp.trials.boxesNr[exp.trials.count] === 0:
      await playFullAudio(audioTestHedge3, null);
      break;

    // for PC box version fam trials with voice over
    case exp.trials.type[exp.trials.count] === 'fam'
      && exp.trials.boxesNr[exp.trials.count] > 0:
      await playFullAudio(audioPromptBox, null);
      break;

    // for PC box version test trials with voice over
    case exp.trials.type[exp.trials.count] === 'test'
      && exp.trials.boxesNr[exp.trials.count] > 0:
      await playFullAudio(audioTestBox3, null);
      break;

    default:
      console.error('Error in playing audio prompts');
  }

  // save current time to calculate response time later
  exp.responseLog[exp.trials.count].responseTime = {
    t0: new Date().getTime(),
    t1: 0,
  };

  targetClickTimer5sec = window.setTimeout(noTargetClickWithin5sec, 5000);

  // remove event listener that checks whether participants clicked too early
  exp.elemSpecs.outerSVG.ID.removeEventListener('click', handleEarlyClick, false);

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
      const boxesCurrentFront = document.querySelector(`[id$= "boxes${exp.trials.boxesNr[exp.trials.count]}-front"]`);
      const boxesCurrentBack = document.querySelector(`[id$= "boxes${exp.trials.boxesNr[exp.trials.count]}-back"]`);

      clickableArea.setAttribute('pointer-events', 'none');
      boxesCurrentFront.addEventListener('click', handleTargetClick, { capture: false, once: true });
      boxesCurrentBack.addEventListener('click', handleTargetClick, { capture: false, once: true });
      break;
    default:
      console.error('Error in setting event listeners');
  }
  exp.elemSpecs.outerSVG.ID.addEventListener('click', handleWrongAreaClick, false);
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN TARGET (HEDGE OR BOX) IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
// async so we can await animation!
const handleTargetClick = async function tmp(event) {
  // stop audio that is potentially playing
  for (let i = 0; i < audioAll.length; i++) {
    audioAll[i].pause();
    audioAll[i].currentTime = 0;
  }

  // we save current time, so that we can calculate response time
  exp.responseLog[exp.trials.count].responseTime.t1 = new Date().getTime();

  // clear timer that awaits participant's click
  // otherwise, it will run even after target click
  clearTimeout(targetClickTimer5sec);

  // remove eventListener that was responsible for "wrong input" sound
  exp.elemSpecs.outerSVG.ID.removeEventListener('click', handleWrongAreaClick, false);
  event.preventDefault();

  // function to save all relevant information
  logResponse(event, exp);
  console.log('responseLog: ', exp.responseLog[exp.trials.count]);

  // so that we don't rush into next trial
  await pause(500);

  // prepare next trial
  exp.trials.count += 1;

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

      showSlide([textSlide, instructionsFamButton],
        [experimentSlide,
          hedge, pig, monkey, sheep,
          balloonBlue, balloonRed, balloonYellow, balloonGreen, instructionsTrainButton, speaker]);

      // if last trial had boxes, then hide them!
      if (exp.trials.boxesNr[exp.trials.count - 1] > 0) {
        const boxesCurrentFront = document.querySelector(`[id$= "boxes${exp.trials.boxesNr[exp.trials.count - 1]}-front"]`);
        const boxesCurrentBack = document.querySelector(`[id$= "boxes${exp.trials.boxesNr[exp.trials.count - 1]}-back"]`);
        showSlide([], [boxesCurrentFront, boxesCurrentBack]);
      }

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

      showSlide([textSlide, instructionsTestButton],
        [experimentSlide,
          hedge, pig, monkey, sheep,
          balloonBlue, balloonRed, balloonYellow, balloonGreen, instructionsFamButton, speaker]);

      // if last trial had boxes, then hide them!
      if (exp.trials.boxesNr[exp.trials.count - 1] > 0) {
        const boxesCurrentFront = document.querySelector(`[id$= "boxes${exp.trials.boxesNr[exp.trials.count - 1]}-front"]`);
        const boxesCurrentBack = document.querySelector(`[id$= "boxes${exp.trials.boxesNr[exp.trials.count - 1]}-back"]`);
        showSlide([], [boxesCurrentFront, boxesCurrentBack]);
      }

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
      // save data, upload to server
      downloadData(exp.responseLog, exp.subjData.subjID);

      document.getElementById('foreign-object-heading').replaceChild(goodbyeHeading, instructionsTestHeading);
      document.getElementById('foreign-object-center-left').replaceChild(goodbyeParagraph, instructionsTestParagraph);
      document.getElementById('foreign-object-center-right').replaceChild(goodbyeImage, instructionsTestImage);

      showSlide([textSlide, speaker, goodbyeButton],
        [experimentSlide,
          hedge, pig, monkey, sheep,
          balloonBlue, balloonRed, balloonYellow, balloonGreen, instructionsTestButton]);

      // if last trial had boxes, then hide them!
      if (exp.trials.boxesNr[exp.trials.count - 1] > 0) {
        const boxesCurrentFront = document.querySelector(`[id$= "boxes${exp.trials.boxesNr[exp.trials.count - 1]}-front"]`);
        const boxesCurrentBack = document.querySelector(`[id$= "boxes${exp.trials.boxesNr[exp.trials.count - 1]}-back"]`);
        showSlide([], [boxesCurrentFront, boxesCurrentBack]);
      }

      break;

    // error handling
    default:
      console.error('Error in specifying next trial');
  }
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN WRONG CLICK
// ---------------------------------------------------------------------------------------------------------------------
const handleEarlyClick = (event) => {
  event.preventDefault();
  exp.responseLog[exp.trials.count].earlyClick++;
};

const handleWrongAreaClick = (event) => {
  event.preventDefault();
  // from participant screen size, calculate where there was a click
  const screenScalingHeight = exp.elemSpecs.outerSVG.origViewBoxHeight / exp.subjData.offsetHeight;
  const clickY = event.clientY - exp.elemSpecs.outerSVG.ID.getBoundingClientRect().top;
  const clickScaledY = screenScalingHeight * clickY;
  if (clickScaledY < hedge.getBBox().y) {
    // count how often a participant clicked in the wrong area
    exp.responseLog[exp.trials.count].wrongAreaClick++;
    // IF WANTED: NEGATIVE FEEDBACK FOR NOT CLICKING IN THE HEDGE/BOX AREA
    // audioNegativeFeedback.play();
  }
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN SPEAKER IN INSTRUCTIONS HAS BEEN CLICKED
// ---------------------------------------------------------------------------------------------------------------------
const handleSpeakerClick = async function tmp(event) {
  event.preventDefault();
  switch (true) {
    // welcome
    case exp.trials.count === 0:
      if (fullscreen) openFullscreen();
      await playFullAudio(audioWelcome, instructionsTrainButton);
      showSlide([instructionsTrainButton], []);
      break;

    // goodbye
    case exp.trials.count === exp.trials.totalNr:
      await playFullAudio(audioGoodbye, null);
      // showSlide([goodbyeButton], []);
      break;

    default:
      console.error('Error in playing instructions');
  }
};

// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN PARTICIPANT HASN'T CLICKED WITHIN CERTAIN AMOUNT OF TIME
// ---------------------------------------------------------------------------------------------------------------------
let noTargetClickWithin5sec = () => {
  switch (true) {
    case exp.trials.type[exp.trials.count] === 'train':
      audioPromptTrain.play();
      break;

    case exp.trials.type[exp.trials.count] !== 'train'
          && exp.trials.boxesNr[exp.trials.count] === 0:
      audioPromptHedge.play();
      break;

    case exp.trials.type[exp.trials.count] !== 'train'
      && exp.trials.boxesNr[exp.trials.count] > 0:
      audioPromptBox.play();
      break;

    default:
      console.error('Error in playing audio prompt');
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
  [experimentSlide, instructionsTrainButton, instructionsFamButton, instructionsTestButton, goodbyeButton]);
// dev mode: show buttons to jump ahead audio instructions
// [experimentSlide]);

// add event listeners
instructionsTrainButton.addEventListener('click', handleInstructionsTrainClick, { capture: false, once: true });
instructionsFamButton.addEventListener('click', handleTransitionClick, { capture: false, once: true });
instructionsTestButton.addEventListener('click', handleTransitionClick, { capture: false, once: true });
goodbyeButton.addEventListener('click', handleGoodbyeClick, { capture: false, once: true });
losgehtsButton.addEventListener('click', handleLosgehtsClick, { capture: false });
speaker.addEventListener('click', handleSpeakerClick, { capture: false, once: false });

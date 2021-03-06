// import animation library
import { gsap } from 'gsap';
import sR from '@ccp-eva/silent-recorder';

// import audio sources
import welcomeSrc from 'url:./sounds/welcome.mp3';
import goodbyeSrc from 'url:./sounds/goodbye.mp3';
import promptGeneralSrc from 'url:./sounds/prompt-general.mp3';
import promptHedgeSrc from 'url:./sounds/prompt-hedge.mp3';
import promptBoxSrc from 'url:./sounds/prompt-box.mp3';
import promptTouchSrc from 'url:./sounds/prompt-touch.mp3';
import promptTouchLongSrc from 'url:./sounds/prompt-touch-long.mp3';
import testHedge3Src from 'url:./sounds/test-hedge-3.mp3';
import testBox3Src from 'url:./sounds/test-box-3.mp3';

// these, we need in our animation function. here, we'll calculate duration
import touch1Src from 'url:./sounds/touch-1.mp3';
import famHedge1Src from 'url:./sounds/fam-hedge-1.mp3';
import testHedge1Src from 'url:./sounds/test-hedge-1.mp3';
import testHedge2Src from 'url:./sounds/test-hedge-2.mp3';
import famBox1Src from 'url:./sounds/fam-box-1.mp3';
import testBox1Src from 'url:./sounds/test-box-1.mp3';
import testBox2Src from 'url:./sounds/test-box-2.mp3';

// import self-written functions
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

// use id parameter???s value if available else use 'testID'
exp.subjData.subjID = url.searchParams.get('id') || 'testID';

// just for developing: turn off fullscreen mode
const devmode = false;
exp.subjData.touchScreen = checkForTouchscreen();

// ---------------------------------------------------------------------------------------------------------------------
// TRIAL SPECIFICATIONS
// ---------------------------------------------------------------------------------------------------------------------
exp.trials = {};
exp.trials.touchNr = 1;
exp.trials.famNr = devmode ? 1 : 2;
exp.trials.testNr = devmode ? 2 : 16;
exp.trials.totalNr = exp.trials.touchNr + exp.trials.famNr + exp.trials.testNr;
// this variable stores in which trial we currently are!
exp.trials.count = 0;
// NOTE: make sure, that the number of voice over fits to the nr of touch training, fam and test trials!!
exp.trials.voiceoverNr = devmode ? 0 : 1;
// constant number of boxes for PC version
exp.trials.boxVersion = 5;

// ---------------------------------------------------------------------------------------------------------------------
// SCREEN SIZE
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

const txt = experimentalInstructions(exp);

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
// SAVE DURATION OF AUDIO FILES
// ---------------------------------------------------------------------------------------------------------------------
exp.elemSpecs.animAudioDur = {};
const animAudioSrcs = [
  touch1Src, famHedge1Src, testHedge1Src, testHedge2Src, famBox1Src, testBox1Src, testBox2Src,
];

animAudioSrcs.forEach((src) => {
  const audioTmp = new Audio();
  audioTmp.src = src;
  audioTmp.onloadedmetadata = () => {
    exp.elemSpecs.animAudioDur[src] = audioTmp.duration;
  };
});

// ---------------------------------------------------------------------------------------------------------------------
// GET ALL RELEVANT ELEMENTS IN SVG
// ---------------------------------------------------------------------------------------------------------------------
const textslide = document.getElementById('textslide');
const textslideButton = document.getElementById('textslide-button');
const textslideButtonText = document.getElementById('textslide-button-text');
const experimentslide = document.getElementById('experimentslide');
const experimentslideButton = document.getElementById('experimentslide-button');
const clickBubble = document.getElementById('click-bubble');
const clickableArea = document.getElementById('clickable-area');
const speaker = document.getElementById('speaker');
const hedge = document.getElementById('hedge');
const boxes1Front = document.getElementById('boxes1-front');
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
if (devmode) console.log('exp object', exp);

// gsap timeline that will save our animation specifications
let timeline = null;
let targetClickTimer5sec = null;

// ---------------------------------------------------------------------------------------------------------------------
// UNLOCK AUDIOS
// ---------------------------------------------------------------------------------------------------------------------
exp.soundEffect = new Audio();

// event touchstart only works for touchscreens
// on first user interaction, later we adjust the source
document.body.addEventListener('touchstart', () => {
  exp.soundEffect.play();
}, { capture: false, once: true });

// ---------------------------------------------------------------------------------------------------------------------
// DEFINE EVENTLISTENER FUNCTIONS
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN WELCOME BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
// save in const variables in order to pass on event to function
const handleWelcomeClick = (event) => {
  event.preventDefault();
  document.getElementById('foreign-object-heading').replaceChild(txt.instructionsTouchHeading, txt.welcomeHeading);
  document.getElementById('foreign-object-center-left').replaceChild(txt.instructionsTouchParagraph, txt.welcomeParagraph);
  document.getElementById('foreign-object-center-right').replaceChild(txt.instructionsTouchImage, txt.familyImage);

  textslideButtonText.innerHTML = 'los geht\'s';
  if (devmode) {
    showSlide([speaker], []);
  } else {
    showSlide([speaker], [textslideButton]);
    // enable fullscreen mode
    openFullscreen();
    sR.startRecorder();
  }
  textslideButton.addEventListener('click', handleTransitionClick, { capture: false, once: true });
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN TRANSITION BUTTON IS CLICKED (between touch, fam and test trials)
// ---------------------------------------------------------------------------------------------------------------------
const handleTransitionClick = (event) => {
  event.preventDefault();

  showSlide([experimentslide],
    [textslide, textslideButton, clickBubble, speaker]);

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

  // pause audio
  exp.soundEffect.pause();
  exp.soundEffect.currentTime = 0;

  // disable fullscreen mode
  if (!devmode) {
    closeFullscreen();
    sR.stopRecorder();
    sR.uploadVideo(exp.subjData.subjID);
  }

  showSlide([],
    [textslide, speaker, textslideButton]);
};
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN "los geht's" BUTTON IS CLICKED
// ---------------------------------------------------------------------------------------------------------------------
const handleExperimentslideButtonClick = async function tmp(event) {
  event.preventDefault();
  if (devmode) console.log('');
  if (devmode) console.log('trial: ', exp.trials.count);

  // hide blurr canvas and button
  showSlide([], [experimentslideButton, document.getElementById('cover-blurr')]);

  // set event listener to see whether participants click too early
  exp.elemSpecs.outerSVG.ID.addEventListener('click', handleEarlyClick, false);

  // animate balloon & eye movement to randomized positions
  await timeline.play();
  await pause(200);

  switch (true) {
    // for any trial without voiceover
    case !exp.trials.voiceover[exp.trials.count]:
      exp.soundEffect.src = promptGeneralSrc;
      exp.soundEffect.play();
      break;

    // for touch trials with voiceover
    case exp.trials.type[exp.trials.count] === 'touch':
      await playFullAudio(exp.soundEffect, promptTouchLongSrc);
      break;

    // for tablet hedge version fam trials with voiceover
    case exp.trials.type[exp.trials.count] === 'fam'
            && exp.trials.boxesNr[exp.trials.count] === 0:
      await playFullAudio(exp.soundEffect, promptHedgeSrc);
      break;

    // for tablet hedge version test trials with voiceover
    case exp.trials.type[exp.trials.count] === 'test'
      && exp.trials.boxesNr[exp.trials.count] === 0:
      await playFullAudio(exp.soundEffect, testHedge3Src);
      break;

    // for PC box version fam trials with voice over
    case exp.trials.type[exp.trials.count] === 'fam'
      && exp.trials.boxesNr[exp.trials.count] > 0:
      await playFullAudio(exp.soundEffect, promptBoxSrc);
      break;

    // for PC box version test trials with voice over
    case exp.trials.type[exp.trials.count] === 'test'
      && exp.trials.boxesNr[exp.trials.count] > 0:
      await playFullAudio(exp.soundEffect, testBox3Src);
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
    case exp.trials.type[exp.trials.count] === 'touch':
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
  exp.soundEffect.pause();
  exp.soundEffect.currentTime = 0;

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
  if (devmode) console.log('responseLog: ', exp.responseLog[exp.trials.count]);

  // just for safety: upload data to server already
  // if participants passed touch+fam training and at least 4 test trials
  if (exp.trials.count >= exp.trials.touchNr + exp.trials.famNr + 4) {
    devmode ? console.log('download data for safety') : downloadData(exp.responseLog, exp.subjData.subjID);
  }

  // so that we don't rush into next trial
  await pause(500);

  // prepare next trial
  exp.trials.count += 1;

  // then depending on trialcount, decide what happens next...
  switch (true) {
    // for touching trials
    case exp.trials.count < exp.trials.touchNr:
      prepareTrial(exp);
      timeline = gsap.timeline({ paused: true });
      timeline.add(changeGaze(exp));
      exp.responseLog[exp.trials.count].durationAnimationComplete = timeline.duration();
      break;

    // for transition from touching into familiarization
    case exp.trials.count === exp.trials.touchNr:
      document.getElementById('foreign-object-heading').replaceChild(txt.instructionsFamHeading, txt.instructionsTouchHeading);
      document.getElementById('foreign-object-center-left').replaceChild(txt.instructionsFamParagraph, txt.instructionsTouchParagraph);
      document.getElementById('foreign-object-center-right').replaceChild(txt.instructionsFamImage, txt.instructionsTouchImage);

      textslideButton.addEventListener('click', handleTransitionClick, { capture: false, once: true });

      showSlide([textslide, textslideButton],
        [experimentslide,
          hedge, pig, monkey, sheep,
          balloonBlue, balloonRed, balloonYellow, balloonGreen, speaker]);

      // if last trial had boxes, then hide them!
      if (exp.trials.boxesNr[exp.trials.count - 1] > 0) {
        const boxesCurrentFront = document.querySelector(`[id$= "boxes${exp.trials.boxesNr[exp.trials.count - 1]}-front"]`);
        const boxesCurrentBack = document.querySelector(`[id$= "boxes${exp.trials.boxesNr[exp.trials.count - 1]}-back"]`);
        showSlide([], [boxesCurrentFront, boxesCurrentBack]);
      }

      break;

    // for familiarization trials
    case exp.trials.count < exp.trials.touchNr + exp.trials.famNr:
      prepareTrial(exp);
      timeline = gsap.timeline({ paused: true });
      timeline.add(changeGaze(exp));
      exp.responseLog[exp.trials.count].durationAnimationComplete = timeline.duration();
      break;

    // for transition from familiarization to test trials
    case exp.trials.count === exp.trials.touchNr + exp.trials.famNr:
      document.getElementById('foreign-object-heading').replaceChild(txt.instructionsTestHeading, txt.instructionsFamHeading);
      document.getElementById('foreign-object-center-left').replaceChild(txt.instructionsTestParagraph, txt.instructionsFamParagraph);
      document.getElementById('foreign-object-center-right').replaceChild(txt.instructionsTestImage, txt.instructionsFamImage);

      textslideButton.addEventListener('click', handleTransitionClick, { capture: false, once: true });

      showSlide([textslide, textslideButton],
        [experimentslide,
          hedge, pig, monkey, sheep,
          balloonBlue, balloonRed, balloonYellow, balloonGreen, speaker]);

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
      // when participants complete experiment, this is the one and only responseLog we need
      devmode ? console.log('download data at the end') : downloadData(exp.responseLog, exp.subjData.subjID);

      document.getElementById('foreign-object-heading').replaceChild(txt.goodbyeHeading, txt.instructionsTestHeading);
      document.getElementById('foreign-object-center-left').replaceChild(txt.goodbyeParagraph, txt.instructionsTestParagraph);
      document.getElementById('foreign-object-center-right').replaceChild(txt.familyImage, txt.instructionsTestImage);

      textslideButton.addEventListener('click', handleGoodbyeClick, { capture: false, once: true });

      textslideButtonText.innerHTML = 'tsch??ss';

      showSlide([textslide, speaker, textslideButton],
        [experimentslide,
          hedge, pig, monkey, sheep,
          balloonBlue, balloonRed, balloonYellow, balloonGreen]);

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
      // play instructions audio, only show button once audio is finished playing
      showSlide([], [textslideButton]);
      await playFullAudio(exp.soundEffect, welcomeSrc);
      showSlide([textslideButton], []);
      break;

    // goodbye
    case exp.trials.count === exp.trials.totalNr:
      await playFullAudio(exp.soundEffect, goodbyeSrc);
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
    case exp.trials.type[exp.trials.count] === 'touch':
      exp.soundEffect.src = promptTouchSrc;
      exp.soundEffect.play();
      break;

    case exp.trials.type[exp.trials.count] !== 'touch'
          && exp.trials.boxesNr[exp.trials.count] === 0:
      exp.soundEffect.src = promptHedgeSrc;
      exp.soundEffect.play();
      break;

    case exp.trials.type[exp.trials.count] !== 'touch'
      && exp.trials.boxesNr[exp.trials.count] > 0:
      exp.soundEffect.src = promptBoxSrc;
      exp.soundEffect.play();
      break;

    default:
      console.error('Error in playing audio prompt');
  }
};
// ---------------------------------------------------------------------------------------------------------------------
// ACTUALLY RUNNING:
// ---------------------------------------------------------------------------------------------------------------------
// INSTRUCTIONS: show slide
document.getElementById('foreign-object-heading').appendChild(txt.welcomeHeading);
document.getElementById('foreign-object-center-left').appendChild(txt.welcomeParagraph);
document.getElementById('foreign-object-center-right').appendChild(txt.familyImage);
textslideButtonText.innerHTML = 'weiter';

showSlide([textslide],
  // first hide buttons, participants can only start once they listened to the instructions
  [experimentslide, speaker, clickableArea]);

// add event listeners
textslideButton.addEventListener('click', handleWelcomeClick, { capture: false, once: true });
experimentslideButton.addEventListener('click', handleExperimentslideButtonClick, { capture: false });
speaker.addEventListener('click', handleSpeakerClick, { capture: false, once: false });

// initially check device orientation
if (window.innerHeight > window.innerWidth) {
  // eslint-disable-next-line no-alert
  alert('Bitte benutzen Sie Ihr Ger??t im Querformat!');
}

// detect device orientation changes and alert, if portrait mode is used instead of landscape
window.addEventListener('orientationchange', () => {
  const afterOrientationChange = () => {
    // eslint-disable-next-line no-alert
    if (window.innerHeight > window.innerWidth) alert('Bitte benutzen Sie Ihr Ger??t im Querformat!');
  };
  // the orientationchange event is triggered before the rotation is complete.
  // therefore, await resize and then evaluate innerHeight & innerWidth
  window.addEventListener('resize', afterOrientationChange, { capture: false, once: true });
});

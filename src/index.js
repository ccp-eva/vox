import { gsap } from 'gsap';
import prepareTrial from './js/prepareTrial';
import changeGaze from './js/changeGaze';

// ---------------------------------------------------------------------------------------------------------------------
// EXP OBJECT
// in this object, we save all of our variables, easier to pass on to functions
// NOTE: we do manipulate this object in our functions!
// ---------------------------------------------------------------------------------------------------------------------
const exp = {};

// ---------------------------------------------------------------------------------------------------------------------
// SVG & SCREEN SIZE
// ---------------------------------------------------------------------------------------------------------------------
exp.subjData = {};
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
const losgehtsButton = document.getElementById('experiment-button');
const clickBubble = document.getElementById('click-bubble');
const hedge = document.getElementById('hedge');
const monkey = document.getElementById('monkey');
const balloon = document.getElementById('balloon-green');

clickBubble.setAttribute('visibility', 'hidden');

// save the original eye positions (so when eye is in the center)
exp.elemSpecs.eyes = {
  radius: document.getElementById('monkey-eyeline-left').getAttribute('r'),
  left: {
    center: {
      x: document.getElementById('monkey-pupil-left').getAttribute('cx'),
      y: document.getElementById('monkey-pupil-left').getAttribute('cy'),
    },
  },
  right: {
    center: {
      x: document.getElementById('monkey-pupil-right').getAttribute('cx'),
      y: document.getElementById('monkey-pupil-right').getAttribute('cy'),
    },
  },
};

// calculate some positions of the balloon
const positionMid = exp.elemSpecs.outerSVG.origViewBoxWidth / 2 - balloon.getBBox().width / 2;
const hedgeMidY = exp.elemSpecs.outerSVG.origViewBoxHeight - balloon.getBBox().height - 25;

exp.elemSpecs.balloons = {
  viewBoxCenter: `-${positionMid} -${exp.elemSpecs.outerSVG.origViewBoxHeight / 2.8} ${exp.elemSpecs.outerSVG.origViewBoxWidth} ${exp.elemSpecs.outerSVG.origViewBoxHeight}`,
  viewBoxHidden: `-${positionMid} -${exp.elemSpecs.outerSVG.origViewBoxHeight - hedge.getBBox().height} ${exp.elemSpecs.outerSVG.origViewBoxWidth} ${exp.elemSpecs.outerSVG.origViewBoxHeight}`,
  viewBoxRandom: `-x -${hedgeMidY} ${exp.elemSpecs.outerSVG.origViewBoxWidth} ${exp.elemSpecs.outerSVG.origViewBoxHeight}`,
  borderRight: exp.elemSpecs.outerSVG.origViewBoxWidth - balloon.getBBox().width,
};

// ---------------------------------------------------------------------------------------------------------------------
// TRIAL NUMBER & RANDOMIZATION OF AGENTS, BALLOON AND BALLOON POSITIONS
// ---------------------------------------------------------------------------------------------------------------------
exp.trials = {};
exp.trials.totalNr = 10;
// this variable stores in which trial we currently are!
exp.trials.count = 0;

exp.agents = Array(10).fill(monkey);
exp.balloons = Array(10).fill(balloon);
exp.positions = [];
// calculate ten positions where balloon can land
for (let i = 1; i <= 10; i++) {
  const viewBoxRandom = exp.elemSpecs.balloons.viewBoxRandom.replace('x', (180 * i));
  const section = {
    bin: i,
    viewBoxRandom,
  };
  exp.positions.push(section);
}

// ---------------------------------------------------------------------------------------------------------------------
// DEFINE EVENTLISTENER FUNCTIONS
// ---------------------------------------------------------------------------------------------------------------------
// RUNS WHEN TARGET IS CLICKED
// async so we can await animation!

const handleTargetClick = async function tmp(event) {
  event.preventDefault();
  document.getElementById('positive-sound').play();

  // prepare next trial
  exp.trials.count += 1;
  if (exp.trials.count < exp.trials.totalNr) {
    prepareTrial(exp);
    timeline = gsap.timeline({paused: true});
    timeline.add(changeGaze(exp));
  }
};

// RUNS WHEN "los geht's" BUTTON IS CLICKED
const handleLosgehtsClick = async function tmp(event) {
  event.preventDefault();
  console.log('trial: ', exp.trials.count);
  // hide blurr canvas and button
  document.getElementById('experiment-button').setAttribute('visibility', 'hidden');
  document.getElementById('cover-blurr').setAttribute('visibility', 'hidden');

  await timeline.play();

  hedge.addEventListener('click', handleTargetClick, { capture: false, once: true });
};
// ---------------------------------------------------------------------------------------------------------------------
// ADD EVENT LISTENER
// ---------------------------------------------------------------------------------------------------------------------
// prepare first trial: next will be prepared after target click
// shows only relevant elements, calculate pupil locations etc.
prepareTrial(exp);
let timeline = null;
timeline = gsap.timeline({paused: true});
timeline.add(changeGaze(exp));

losgehtsButton.addEventListener('click', handleLosgehtsClick, { capture: false });

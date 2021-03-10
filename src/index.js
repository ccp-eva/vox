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

const textSlide = document.getElementById('text-slide');
const experimentSlide = document.getElementById('experiment-slide');
showSlide([textSlide], [experimentSlide]);

// ------------------------------------------------------------------------------------
// ADDING TEXT VIA RECT => FOREIGNOBJECT => INNERHTML
// ------------------------------------------------------------------------------------
// we created rects in our HTML, in which we want to type text
// for that, we need to convert rects into foreignObjects
const headingRect = document.getElementById('foreign-object-heading');
// remove filling color
headingRect.removeAttribute('fill');
// get HTML of rect
let rectHeadingHTML = headingRect.outerHTML;
// replace rect tag by foreign object tag
rectHeadingHTML = rectHeadingHTML.replace('<rect', '<foreignObject');
rectHeadingHTML = rectHeadingHTML.replace('</rect>', '</foreignObject>');
// replace html
headingRect.outerHTML = rectHeadingHTML;

// place text into foreignObject
const headingDiv = document.createElement('div');
headingDiv.innerHTML = '<h1> Text über foreign objects! </h1> <p> Hier gehts weiter </p>';
const headingFO = document.getElementById('foreign-object-heading');
headingFO.appendChild(headingDiv);
// ------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------
// ADDING TEXT VIA NEW CHILD TO SVG
// ------------------------------------------------------------------------------------
const ourSVG = document.getElementById('our-svg');
const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
text.setAttribute('x', 100);
text.setAttribute('y', 300);
text.setAttribute('width', 500);
text.setAttribute('height', 500);
text.setAttribute('font-weight', 'bold');
text.style.fontSize = '60';
text.innerHTML = 'Text über text nodes';
ourSVG.appendChild(text);

const instr = document.createElementNS('http://www.w3.org/2000/svg', 'text');
instr.setAttribute('x', 100);
instr.setAttribute('y', 400);
instr.setAttribute('width', 500);
instr.setAttribute('height', 500);
instr.style.fontSize = '60';
instr.innerHTML = 'Unsere Instruktionen stehen... <tspan x="100" y="500"> ...in einer neuen Zeile </tspan>';
ourSVG.appendChild(instr);
// ------------------------------------------------------------------------------------

// // ---------------------------------------------------------------------------------------------------------------------
// // EXP OBJECT
// // in this object, we save all of our variables, easier to pass on to functions
// // NOTE: we do manipulate this object in our functions!
// // TODO set attribute pointerevents = all
// // ---------------------------------------------------------------------------------------------------------------------
// const exp = {};

// // ---------------------------------------------------------------------------------------------------------------------
// // PARTICIPANT ID
// // ---------------------------------------------------------------------------------------------------------------------
// exp.subjData = {};
// exp.subjData.subjID = 'testID';

// // ---------------------------------------------------------------------------------------------------------------------
// // SVG & SCREEN SIZE
// // if (clientWidth < 600 || clientHeight < 200) alert('Please view on bigger screen!');
// // ---------------------------------------------------------------------------------------------------------------------
// exp.subjData.touchScreen = checkForTouchscreen();
// exp.subjData.offsetWidth = document.body.offsetWidth;
// exp.subjData.offsetHeight = document.body.offsetHeight;

// // get viewBox size from whole SVG
// exp.elemSpecs = {
//   outerSVG: {
//     ID: document.getElementById('outer-svg'),
//     origViewBox: document.getElementById('outer-svg').getAttribute('viewBox'),
//     origViewBoxX: parseFloat(document.getElementById('outer-svg').getAttribute('viewBox').split(' ')[0]),
//     origViewBoxY: parseFloat(document.getElementById('outer-svg').getAttribute('viewBox').split(' ')[1]),
//     origViewBoxWidth: parseFloat(document.getElementById('outer-svg').getAttribute('viewBox').split(' ')[2]),
//     origViewBoxHeight: parseFloat(document.getElementById('outer-svg').getAttribute('viewBox').split(' ')[3]),
//   },
// };

// // ---------------------------------------------------------------------------------------------------------------------
// // GET ALL RELEVANT ELEMENTS IN SVG
// // ---------------------------------------------------------------------------------------------------------------------
// const instructionSlide = document.getElementById('instructions');
// const transitionSlide = document.getElementById('transition');
// const goodbyeSlide = document.getElementById('goodbye');
// const experimentSlide = document.getElementById('experiment');

// const instructionButton = document.getElementById('instructions-button');
// const transitionButton = document.getElementById('transition-button');
// const goodbyeButton = document.getElementById('goodbye-button');
// const losgehtsButton = document.getElementById('experiment-button');
// const clickBubble = document.getElementById('click-bubble');
// const fiveBoxes = document.getElementById('five-boxes');
// const hedge = document.getElementById('hedge');

// // TODO see whether hedge animation is smoother without all the leave paths
// // const hedgeleaves = document.getElementById('hedgeleaves');
// // hedgeleaves.setAttribute('visibility', 'hidden');

// // if you change animal agents or targets, then change ID here...
// const pig = document.getElementById('pig');
// const monkey = document.getElementById('monkey');
// const sheep = document.getElementById('sheep');
// const agentsSingle = [pig, monkey, sheep];

// // NOTE: we believe that all target objects are the same size here!!
// const balloonBlue = document.getElementById('balloon-blue');
// const balloonRed = document.getElementById('balloon-red');
// const balloonYellow = document.getElementById('balloon-yellow');
// const balloonGreen = document.getElementById('balloon-green');
// const targetsSingle = [balloonBlue, balloonRed, balloonYellow, balloonGreen];

// // save the original eye positions (so when eye is in the center)
// exp.elemSpecs.eyes = {};
// const agentsChar = ['pig', 'monkey', 'sheep'];
// agentsChar.forEach((agent) => {
//   exp.elemSpecs.eyes[agent] = {
//     radius: document.getElementById(`${agent}-eyeline-left`).getAttribute('r'),
//     left: {
//       center: {
//         x: document.getElementById(`${agent}-pupil-left`).getAttribute('cx'),
//         y: document.getElementById(`${agent}-pupil-left`).getAttribute('cy'),
//       },
//       bbox: {
//         x: document.getElementById(`${agent}-pupil-left`).getBBox().x, // same as cx - r
//         y: document.getElementById(`${agent}-pupil-left`).getBBox().y, // same as cy - r
//       },
//     },
//     right: {
//       center: {
//         x: document.getElementById(`${agent}-pupil-right`).getAttribute('cx'),
//         y: document.getElementById(`${agent}-pupil-right`).getAttribute('cy'),
//       },
//       bbox: {
//         x: document.getElementById(`${agent}-pupil-right`).getBBox().x, // same as cx - r
//         y: document.getElementById(`${agent}-pupil-right`).getBBox().y, // same as cy - r
//       },
//     },
//   };
// });

// // calculate some positions of the targets
// exp.elemSpecs.targets = {
//   center: {
//     // position mid
//     x: exp.elemSpecs.outerSVG.origViewBoxWidth / 2 - balloonBlue.getBBox().width / 2,
//     // 2.8, so that we can still see our agents and they don't get covered by balloons
//     y: exp.elemSpecs.outerSVG.origViewBoxHeight / 2.8,
//   },
//   // define from which point onwards the balloon is hidden behind hedge
//   halfway: {
//     // position mid, same as in center.x
//     x: exp.elemSpecs.outerSVG.origViewBoxWidth / 2 - balloonBlue.getBBox().width / 2,
//     // BBox of hedge is a bit too high to hide balloon (because of single grass halms), therefore / 1.1
//     y: exp.elemSpecs.outerSVG.origViewBoxHeight - hedge.getBBox().height / 1.1,
//   },
//   // right side of screen as upper boundary
//   borderRight: exp.elemSpecs.outerSVG.origViewBoxWidth - balloonBlue.getBBox().width,
//   // calculate y coords for balloon (-30 for little distance from lower border)
//   groundY: exp.elemSpecs.outerSVG.origViewBoxHeight - balloonBlue.getBBox().height - 30,
// };

// // ---------------------------------------------------------------------------------------------------------------------
// // TRIAL NUMBER & RANDOMIZATION OF AGENTS, TARGETS AND TARGET POSITIONS
// // ---------------------------------------------------------------------------------------------------------------------
// exp.trials = {};
// exp.trials.famNr = 2;
// exp.trials.testNr = 2;
// exp.trials.totalNr = exp.trials.famNr + exp.trials.testNr;
// // this variable stores in which trial we currently are!
// exp.trials.count = 0;
// let timeline = null;

// // create arrays with agents, targets, positions etc. for all the trials
// randomizeTrials(exp, agentsSingle, targetsSingle);
// console.log('exp object', exp);

// // ---------------------------------------------------------------------------------------------------------------------
// // DEFINE EVENTLISTENER FUNCTIONS
// // ---------------------------------------------------------------------------------------------------------------------
// // ---------------------------------------------------------------------------------------------------------------------
// // RUNS WHEN INSTRUCTION BUTTON IS CLICKED
// // ---------------------------------------------------------------------------------------------------------------------
// // save in const variables in order to pass on event to function
// const handleInstructionClick = (event) => {
//   event.preventDefault();
//   openFullscreen();

//   // showSlide: first array gets shown, second array gets hidden
//   showSlide([experimentSlide],
//     [instructionSlide, transitionSlide, goodbyeSlide, clickBubble]);

//   // shows only relevant elements etc.
//   prepareTrial(exp);
//   timeline = gsap.timeline({ paused: true });
//   timeline.add(changeGaze(exp));
// };
// // ---------------------------------------------------------------------------------------------------------------------
// // RUNS WHEN TRANSITION BUTTON IS CLICKED (between fam and test trials)
// // (nearly same as instruction click!)
// // ---------------------------------------------------------------------------------------------------------------------
// const handleTransitionClick = (event) => {
//   event.preventDefault();

//   showSlide([experimentSlide, fiveBoxes],
//     [instructionSlide, transitionSlide, goodbyeSlide, clickBubble]);

//   prepareTrial(exp);
//   timeline = gsap.timeline({ paused: true });
//   timeline.add(changeGaze(exp));
// };
// // ---------------------------------------------------------------------------------------------------------------------
// // RUNS WHEN GOODBYE BUTTON IS CLICKED
// // ---------------------------------------------------------------------------------------------------------------------
// const handleGoodbyeClick = (event) => {
//   event.preventDefault();

//   showSlide([],
//     [goodbyeSlide]);

//   downloadData(exp.responseLog, exp.subjData.subjID);
// };
// // ---------------------------------------------------------------------------------------------------------------------
// // RUNS WHEN TARGET IS CLICKED
// // ---------------------------------------------------------------------------------------------------------------------
// // async so we can await animation!
// const handleTargetClick = async function tmp(event) {
//   // we save current time, so that we can calculate response time
//   exp.responseLog[exp.trials.count].responseTime.t1 = new Date().getTime();
//   // remove eventListener that was responsible for "wrong input" sound
//   exp.elemSpecs.outerSVG.ID.removeEventListener('click', handleWrongClick, false);
//   event.preventDefault();

//   // function to save all relevant information
//   logResponse(event, exp);
//   console.log('responseLog: ', exp.responseLog[exp.trials.count]);

//   // so that we don't rush into next trial
//   await pause(500);

//   // prepare next trial
//   exp.trials.count += 1;

//   // then depending on trialcount, decide what happens next...
//   // if still in fam trials, prepare trial
//   if (exp.trials.count < exp.trials.famNr) {
//     prepareTrial(exp);
//     timeline = gsap.timeline({ paused: true });
//     timeline.add(changeGaze(exp));

//   // if transition between fam and test trials, show that transition slide
//   } else if (exp.trials.count === exp.trials.famNr) {
//     showSlide([transitionSlide],
//       [experimentSlide, pig, monkey, sheep, balloonBlue, balloonRed, balloonYellow, balloonGreen, fiveBoxes]);

//   // if test trial, prepare trial
//   } else if (exp.trials.count < exp.trials.totalNr) {
//     prepareTrial(exp);
//     timeline = gsap.timeline({ paused: true });
//     timeline.add(changeGaze(exp));

//   // if all trials done, show goodbye slide
//   } else if (exp.trials.count === exp.trials.totalNr) {
//     closeFullscreen();
//     showSlide([goodbyeSlide],
//       [experimentSlide, hedge, pig, monkey, sheep, balloonBlue, balloonRed, balloonYellow, balloonGreen, fiveBoxes]);
//   }
// };
// // ---------------------------------------------------------------------------------------------------------------------
// // RUNS WHEN WRONG CLICK
// // ---------------------------------------------------------------------------------------------------------------------
// const handleWrongClick = (event) => {
//   event.preventDefault();
//   // from user screen size, calculate where there was a click
//   const screenScalingHeight = exp.elemSpecs.outerSVG.origViewBoxHeight / exp.subjData.offsetHeight;
//   const clickY = event.clientY - exp.elemSpecs.outerSVG.ID.getBoundingClientRect().top;
//   const clickScaledY = screenScalingHeight * clickY;
//   // if that is somewhere above the hedge (e.g. on the agents), play "negative" feedback sound
//   // this is how much we move the hedge down in changeGaze
//   const hedgeMoved = hedge.getBBox().height - exp.targets[exp.trials.count].getBBox().height - 75;
//   console.log('hedgeMoved', hedgeMoved);
//   // this is the y coord of the upper corner of the hedge after the animation
//   const hedgeDown = hedge.getBBox().y - hedgeMoved;
//   console.log('hedge.getBBox().y', hedge.getBBox().y);
//   console.log('hedgeDown', hedgeDown);
//   // then, we need to define what is above the hedge
//   const cornerHedge = exp.elemSpecs.outerSVG.origViewBoxHeight - hedgeDown;
//   // if user clicked above hedge, play negative feedback sound
//   if (clickScaledY < cornerHedge) {
//     // count how often a participant clicked in the wrong area
//     exp.responseLog[exp.trials.count].wrongClick++;
//     document.getElementById('negative-sound').play();
//   }
// };
// // ---------------------------------------------------------------------------------------------------------------------
// // RUNS WHEN "los geht's" BUTTON IS CLICKED
// // ---------------------------------------------------------------------------------------------------------------------
// const handleLosgehtsClick = async function tmp(event) {
//   event.preventDefault();
//   console.log('');
//   console.log('trial: ', exp.trials.count);

//   // hide blurr canvas and button
//   document.getElementById('experiment-button').setAttribute('visibility', 'hidden');
//   document.getElementById('cover-blurr').setAttribute('visibility', 'hidden');

//   // animate balloon & eye movement to randomized positions
//   await timeline.play();

//   // save current time to calculate response time later
//   exp.responseLog[exp.trials.count].responseTime = {
//     t0: new Date().getTime(),
//     t1: 0,
//   };

//   // depending on experiment version, users click on hedge or boxes
//   if (exp.subjData.touchScreen) {
//     hedge.setAttribute('pointer-events', 'all');
//     hedge.addEventListener('click', handleTargetClick, { capture: false, once: true });
//   } else if (!exp.subjData.touchScreen) {
//     hedge.setAttribute('pointer-events', 'none');
//     fiveBoxes.addEventListener('click', handleTargetClick, { capture: false, once: true });
//   }
//   exp.elemSpecs.outerSVG.ID.addEventListener('click', handleWrongClick, false);
// };
// // ---------------------------------------------------------------------------------------------------------------------
// // ACTUALLY RUNNING:
// // ---------------------------------------------------------------------------------------------------------------------
// // INSTRUCTION: show slide
// showSlide([instructionSlide],
//   [transitionSlide, experimentSlide, goodbyeSlide, pig, monkey, sheep, balloonBlue, balloonRed, balloonYellow, balloonGreen]);

// // add event listeners
// instructionButton.addEventListener('click', handleInstructionClick, { capture: false, once: true });
// losgehtsButton.addEventListener('click', handleLosgehtsClick, { capture: false });
// transitionButton.addEventListener('click', handleTransitionClick, { capture: false, once: true });
// goodbyeButton.addEventListener('click', handleGoodbyeClick, { capture: false, once: true });

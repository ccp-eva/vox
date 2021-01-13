import getGazeCoords from './js/getGazeCoords';
import randomNumber from './js/randomNumber';
import shuffleArray from './js/shuffleArray';
import animateViewBox from './js/animateViewBox';
import animateCoord from './js/animateCoord';
// import sleep from './js/sleep';

// AGENT PUPIL SETTINGS
// check screen size of user
const { clientWidth } = document.getElementById('outer-svg');
const { clientHeight } = document.getElementById('outer-svg');
console.log('client browser size', { clientWidth, clientHeight });
// TODO find more elegant solution to tell user to view on fullscreen
// if (clientWidth < 600 || clientHeight < 200) alert('Please view on bigger screen!');

// get viewBox size
const origViewBox = document.getElementById('outer-svg').getAttribute('viewBox');
const origViewBoxX = parseFloat(origViewBox.split(' ')[0]);
const origViewBoxY = parseFloat(origViewBox.split(' ')[1]);
const origViewBoxWidth = parseFloat(origViewBox.split(' ')[2]);
const origViewBoxHeight = parseFloat(origViewBox.split(' ')[3]);
console.log('view box size', {
  origViewBoxX, origViewBoxY, origViewBoxWidth, origViewBoxHeight,
});

// get target and agents
// if you change animal agents, then change ID here:
const target = document.getElementById('target');
const pig = document.getElementById('pig');
const monkey = document.getElementById('monkey');
const sheep = document.getElementById('sheep');
// and add agent to this list
const agents = shuffleArray(['pig', 'monkey', 'sheep']);
console.log('agents', agents);

// change which one is visible (right now, only first agent)
eval(agents[0]).setAttribute('visibility', 'visible');
eval(agents[1]).setAttribute('visibility', 'hidden');
eval(agents[2]).setAttribute('visibility', 'hidden');

// get middle Y of the grass background
// take y coordinate of grass + half of the height. Then, subtract half of the balloon height.
const grassMidY = document.getElementById('grass').getBBox().y + document.getElementById('grass').getBBox().height / 2 - target.getBBox().height / 2;

// set balloon to very left in grass section
// target.setAttribute('viewBox', `0 -${grassMidY} ${origViewBoxWidth} ${origViewBoxHeight}`);

// get position on the very right of the screen
const targetPositionRight = origViewBoxWidth - target.getBBox().width;
const targetPositionMid = origViewBoxWidth / 2 - target.getBBox().width / 2;

// put it in middle (target needs to be last in the SVG => on top level/foreground)
const midTargetViewBox = `-${targetPositionMid} -${origViewBoxHeight / 2.35} ${origViewBoxWidth} ${origViewBoxHeight}`;
target.setAttribute('viewBox', `${midTargetViewBox}`);
console.log('midTargetViewBox', midTargetViewBox);

// range of possible values to move the balloon: 0 - targetPositionRight
// divide this range into ten
// for each of these ten categories, pick a random number
const section1 = { min: 0, max: targetPositionRight / 10 };
const section2 = { min: section1.max, max: (targetPositionRight / 10) * 2 };
const section3 = { min: section2.max, max: (targetPositionRight / 10) * 3 };
const section4 = { min: section3.max, max: (targetPositionRight / 10) * 4 };
const section5 = { min: section4.max, max: (targetPositionRight / 10) * 5 };
const section6 = { min: section5.max, max: (targetPositionRight / 10) * 6 };
const section7 = { min: section6.max, max: (targetPositionRight / 10) * 7 };
const section8 = { min: section7.max, max: (targetPositionRight / 10) * 8 };
const section9 = { min: section8.max, max: (targetPositionRight / 10) * 9 };
const section10 = { min: section9.max, max: targetPositionRight };

const sectionArray = shuffleArray([section1, section2, section3, section4, section5, section6, section7, section8, section9, section10]);
console.log('sectionArray', sectionArray);

const newTargetViewBox = `-${randomNumber(sectionArray[0].min, sectionArray[0].max)} -${grassMidY} ${origViewBoxWidth} ${origViewBoxHeight}`;

// set target to random place; use template literal to access values
// WE NEED MINUS! SINCE WE MOVE THE COORDINATE SYSTEM TO THE LEFT / UP in order to let the balloon move right / down
// sleep(5000);

// move balloon after 5 seconds and change eye gaze
setTimeout(() => {
  // target.setAttribute('viewBox', `-${randomNumber(sectionArray[0].min, sectionArray[0].max)} -${grassMidY} ${origViewBoxWidth} ${origViewBoxHeight}`);
  animateViewBox(target, midTargetViewBox, newTargetViewBox);
  // set target viewBox to the value where it just moved
  target.setAttribute('viewBox', newTargetViewBox);
  // should be the same values now
  console.log('newTargetViewBox', newTargetViewBox);
  console.log('newTargetViewBox', target.getAttribute('viewBox'));

  // set eyes of the first agent, the one thats visible
  const irisLeft = document.getElementById(`${agents[0]}-iris-left`);
  const pupilLeft = document.getElementById(`${agents[0]}-pupil-left`);
  const eyelineLeft = document.getElementById(`${agents[0]}-eyeline-left`);

  const irisRight = document.getElementById(`${agents[0]}-iris-right`);
  const pupilRight = document.getElementById(`${agents[0]}-pupil-right`);
  const eyelineRight = document.getElementById(`${agents[0]}-eyeline-right`);

  // calculate positions for both eyes
  const gazeCoordsLeft = getGazeCoords(target, pupilLeft, eyelineLeft);
  const gazeCoordsRight = getGazeCoords(target, pupilRight, eyelineRight);

  console.log('OLD pupilLeftCX', pupilLeft.getAttribute('cx'));
  console.log('NEW CALC pupilLeftNew', gazeCoordsLeft.x);

  animateCoord(pupilLeft, gazeCoordsLeft);
  animateCoord(irisLeft, gazeCoordsLeft);
  animateCoord(pupilRight, gazeCoordsRight);
  animateCoord(irisRight, gazeCoordsRight);

  // set target viewBox to the value where it just moved
  // pupil should be on intersection line / circle
  pupilLeft.setAttribute('cx', gazeCoordsLeft.x);
  pupilLeft.setAttribute('cy', gazeCoordsLeft.y);
  pupilRight.setAttribute('cx', gazeCoordsRight.x);
  pupilRight.setAttribute('cy', gazeCoordsRight.y);
  // iris too
  irisLeft.setAttribute('cx', gazeCoordsLeft.x);
  irisLeft.setAttribute('cy', gazeCoordsLeft.y);
  irisRight.setAttribute('cx', gazeCoordsRight.x);
  irisRight.setAttribute('cy', gazeCoordsRight.y);

  // should be the same values now
  console.log('NEW pupilLeftCX', gazeCoordsLeft.x);
}, 3000);

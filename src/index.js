import getGazeCoords from './js/getGazeCoords';
import randomNumber from './js/randomNumber';

// AGENT PUPIL SETTINGS
// check screen size of user
const { clientWidth } = document.getElementById('outer-svg');
const { clientHeight } = document.getElementById('outer-svg');
console.log('client browser size', { clientWidth, clientHeight });
// TODO find more elegant solution to tell user to view on fullscreen
if (clientWidth < 600 || clientHeight < 200) alert('Please view on bigger screen!');

// get viewBox size
const viewBoxWidth = document.getElementById('outer-svg').getAttribute('viewBox').split(' ')[2];
const viewBoxHeight = document.getElementById('outer-svg').getAttribute('viewBox').split(' ')[3];
console.log('view box size', { viewBoxWidth, viewBoxHeight });

// get target and agents
const target = document.getElementById('target');
const pig = document.getElementById('pig');
const monkey = document.getElementById('monkey');
const sheep = document.getElementById('sheep');

// change which one is visible (right now, only sheep eyes will be manipulated)
sheep.setAttribute('visibility', 'visible');
monkey.setAttribute('visibility', 'hidden');
pig.setAttribute('visibility', 'hidden');

// set balloon to very left in grass section
target.setAttribute('viewBox', '0 -780 1920 1080');

console.log('target before transforming', target);
console.log('BBox width', target.getBBox().width);
console.log('BBox height', target.getBBox().height);
console.log('BBox x', target.getBBox().x);
console.log('BBox y', target.getBBox().y);
console.log('abs viewBox x', Math.abs(target.getAttribute('viewBox').split(' ')[0]));
console.log('abs viewBox y', Math.abs(target.getAttribute('viewBox').split(' ')[1]));

// get position on the very right of the screen
const targetPositionRight = viewBoxWidth - target.getBBox().width;
console.log('targetPositionRight', targetPositionRight);

// range of possible values to move the balloon: 0 - targetPositionRight
// divide this range into ten
// for each of these ten categories, pick a random number
const section1 = { min: 0, max: targetPositionRight / 10 };
console.log('section1', section1);
const section2 = { min: section1.max, max: (targetPositionRight / 10) * 2 };
const section3 = { min: section2.max, max: (targetPositionRight / 10) * 3 };
const section4 = { min: section3.max, max: (targetPositionRight / 10) * 4 };
const section5 = { min: section4.max, max: (targetPositionRight / 10) * 5 };
const section6 = { min: section5.max, max: (targetPositionRight / 10) * 6 };
const section7 = { min: section6.max, max: (targetPositionRight / 10) * 7 };
const section8 = { min: section7.max, max: (targetPositionRight / 10) * 8 };
const section9 = { min: section8.max, max: (targetPositionRight / 10) * 9 };
const section10 = { min: section9.max, max: targetPositionRight };

// set target to random place on very right; use template literal to access function's value
// target.setAttribute('transform', `translate(${randomNumber(section10.min, section10.max)}, 0)`);
// WE NEED MINUS! SINCE WE MOVE THE COORDINATE SYSTEM TO THE LEFT
target.setAttribute('viewBox', `-${randomNumber(section10.min, section10.max)} -780 1920 1080`);

// target.setAttribute('viewBox', '-1700 -780 1920 1080');

console.log('target after transforming', target);
console.log('BBox width', target.getBBox().width);
console.log('BBox height', target.getBBox().height);
console.log('BBox x', target.getBBox().x);
console.log('BBox y', target.getBBox().y);
console.log('abs viewBox x', Math.abs(target.getAttribute('viewBox').split(' ')[0]));
console.log('abs viewBox y', Math.abs(target.getAttribute('viewBox').split(' ')[1]));

const irisLeft = document.getElementById('sheep-iris-left');
const pupilLeft = document.getElementById('sheep-pupil-left');
const eyelineLeft = document.getElementById('sheep-eyeline-left');

const irisRight = document.getElementById('sheep-iris-right');
const pupilRight = document.getElementById('sheep-pupil-right');
const eyelineRight = document.getElementById('sheep-eyeline-right');

// calculate position for left eye
const gazeCoordsLeft = getGazeCoords(target, pupilLeft, eyelineLeft);

// pupil should be on intersection line / circle
pupilLeft.setAttribute('cx', gazeCoordsLeft.x);
pupilLeft.setAttribute('cy', gazeCoordsLeft.y);
// iris too
irisLeft.setAttribute('cx', gazeCoordsLeft.x);
irisLeft.setAttribute('cy', gazeCoordsLeft.y);

// calculate position for right eye
const gazeCoordsRight = getGazeCoords(target, pupilRight, eyelineRight);

// pupil should be on intersection line / circle
pupilRight.setAttribute('cx', gazeCoordsRight.x);
pupilRight.setAttribute('cy', gazeCoordsRight.y);
// iris too
irisRight.setAttribute('cx', gazeCoordsRight.x);
irisRight.setAttribute('cy', gazeCoordsRight.y);

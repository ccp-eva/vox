import getGazeCoords from './js/getGazeCoords';
import randomNumber from './js/randomNumber';

// check screen size of user
// eslint-disable-next-line prefer-destructuring
const clientWidth = document.getElementsByTagName('svg').svg.clientWidth;
// eslint-disable-next-line prefer-destructuring
const clientHeight = document.getElementsByTagName('svg').svg.clientHeight;
console.log('client browser size', { clientWidth, clientHeight });
// TODO find more elegant solution to tell user to view on fullscreen
if (clientWidth < 900 || clientHeight < 400) alert('Please view on bigger screen!');

// get viewBox size
const viewBoxWidth = document.getElementsByTagName('svg').svg.getAttribute('viewBox').split(' ')[2];
const viewBoxHeight = document.getElementsByTagName('svg').svg.getAttribute('viewBox').split(' ')[3];
console.log('view box size', { viewBoxWidth, viewBoxHeight });

// get agents
const pig = document.getElementById('pig');
const monkey = document.getElementById('monkey');
const sheep = document.getElementById('sheep');

// change which one is visible (right now, only sheep eyes will be manipulated)
sheep.setAttribute('visibility', 'visible');
monkey.setAttribute('visibility', 'hidden');
pig.setAttribute('visibility', 'hidden');

// get target object, play around with positioning
const target = document.getElementById('balloon');
console.log('target before transforming', target);
console.log('BBox width', target.getBBox().width);
console.log('BBox height', target.getBBox().height);
console.log('BBox x', target.getBBox().x);
console.log('BBox y', target.getBBox().y);

// in SVG, balloon is in the far left. so that's our: target.setAttribute('transform', 'translate(0, 0)');
// get position on the very right of the screen
const targetPositionRight = viewBoxWidth - target.getBBox().width;

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

// set target to random place on very right; use template literal to access function's value
// target.setAttribute('transform', `translate(${randomNumber(section10.min, section10.max)}, 0)`);

// TODO target.getBoundingClientRect();

// always first without, then with transform (see few lines above)
// targetBBox();
// SVGRect {x: 0.49694061279296875, y: 781.177734375, width: 192.3055419921875, height: 231.29241943359375}
// SVGRect {x: 0.49694061279296875, y: 781.177734375, width: 192.3055419921875, height: 231.29241943359375}
// target.getBoundingClientRect();
// DOMRect {x: 8.074023246765137, y: 124.36293029785156, width: 28.645511627197266, height: 34.45294189453125, top: 124.36293029785156, …}
// DOMRect {x: 252.37510681152344, y: 124.36293029785156, width: 28.645523071289062, height: 34.45294189453125, top: 124.36293029785156, …}

console.log('target after transforming', target);
console.log('BBox width', target.getBBox().width);
console.log('BBox height', target.getBBox().height);
console.log('BBox x', target.getBBox().x);
console.log('BBox y', target.getBBox().y);

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

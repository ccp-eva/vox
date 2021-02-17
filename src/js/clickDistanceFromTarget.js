import { gsap } from 'gsap';
import checkForTouchscreen from './checkForTouchscreen';

// (event, target, trialType, outerSVG, responseLog)
export default (event, exp, trialCount, responseLog) => {
  const touchScreen = checkForTouchscreen();
  // save all relevant properties in this empty object
  const clickLog = {};
  // in our context, offset and client same values
  clickLog.offsetWidth = document.body.offsetWidth;
  clickLog.offsetHeight = document.body.offsetHeight;

  // how much smaller/bigger is the SVG coordinate system wrt the screen size?
  clickLog.screenScalingWidth = exp.elemSpecs.outerSVG.origViewBoxWidth / clickLog.offsetWidth;
  clickLog.screenScalingHeight = exp.elemSpecs.outerSVG.origViewBoxHeight / clickLog.offsetHeight;

  // click coordinates (event.offset) * scaling
  // originally, we used offset. Didn't work in Firefox.
  clickLog.clickX = event.clientX - exp.elemSpecs.outerSVG.ID.getBoundingClientRect().left;
  clickLog.clickY = event.clientY - exp.elemSpecs.outerSVG.ID.getBoundingClientRect().top;

  clickLog.clickScaledX = clickLog.screenScalingWidth * clickLog.clickX;
  clickLog.clickScaledY = clickLog.screenScalingHeight * clickLog.clickY;

  const clickBubble = document.getElementById('click-bubble');
  clickBubble.setAttribute('cx', `${clickLog.clickScaledX}`);
  clickBubble.setAttribute('cy', `${clickLog.clickScaledY}`);
  // let clickBubble be visible only for 0.2 sec
  gsap.to(clickBubble, {
    duration: 0.5,
    attr: { visibility: 'visible' },
    onComplete() {
      clickBubble.setAttribute('visibility', 'hidden');
    },
  });

  document.getElementById('positive-sound').play();

  clickLog.targetX = parseFloat(exp.targets[trialCount].getAttribute('viewBox').split(' ')[0]) * -1;
  clickLog.targetY = parseFloat(exp.targets[trialCount].getAttribute('viewBox').split(' ')[1]) * -1;

  // define center of target
  clickLog.targetWidth = exp.targets[trialCount].getBBox().width;
  clickLog.targetHeight = exp.targets[trialCount].getBBox().height;
  clickLog.targetCenterX = clickLog.targetX + exp.targets[trialCount].getBBox().width / 2;
  clickLog.targetCenterY = clickLog.targetY + exp.targets[trialCount].getBBox().height / 2;

  // clicked on target?
  // for x: negative values mean too far left, positive values mean too far right
  // for y: negative values mean too low, positive values mean too high
  clickLog.clickDistFromTargetCenterX = clickLog.clickScaledX - clickLog.targetCenterX;
  clickLog.clickDistFromTargetCenterY = clickLog.targetCenterY - clickLog.clickScaledY;

  clickLog.hitBBTargetX = false;
  clickLog.hitBBTargetY = false;

  if (clickLog.targetX <= clickLog.clickScaledX && clickLog.clickScaledX <= (clickLog.targetX + clickLog.targetWidth)) {
    clickLog.hitBBTargetX = true;
  }
  if (clickLog.targetY <= clickLog.clickScaledY && clickLog.clickScaledY <= (clickLog.targetY + clickLog.targetHeight)) {
    clickLog.hitBBTargetY = true;
  }

  // for PC version of experiment, check which box was clicked
  if (touchScreen) {
    if (exp.trialType[trialCount] === 'fam') clickLog.clickedArea = 'clickable-area';
    if (exp.trialType[trialCount] === 'test') clickLog.clickedArea = 'hedge';
  }
  if (!touchScreen) {
    if (exp.trialType[trialCount] === 'fam') clickLog.clickedArea = 'clickable-area';
    if (exp.trialType[trialCount] === 'test') clickLog.clickedArea = event.path[1].getAttribute('id');
  }

  responseLog.push(clickLog);
};

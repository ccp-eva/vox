import { gsap } from 'gsap';

export default (event, target, outerSVG, responseLog) => {
  // save all relevant properties in this empty object
  const clickLog = {};
  // in our context, offset and client same values
  clickLog.offsetWidth = document.body.offsetWidth;
  clickLog.offsetHeight = document.body.offsetHeight;
  const origViewBoxWidth = parseFloat(outerSVG.getAttribute('viewBox').split(' ')[2]);
  const origViewBoxHeight = parseFloat(outerSVG.getAttribute('viewBox').split(' ')[3]);

  // how much smaller/bigger is the SVG coordinate system wrt the screen size?
  clickLog.screenScalingWidth = origViewBoxWidth / clickLog.offsetWidth;
  clickLog.screenScalingHeight = origViewBoxHeight / clickLog.offsetHeight;

  // click coordinates (event.offset) * scaling
  // originally, we used offset. Didn't work in Firefox.
  clickLog.clickX = event.clientX - outerSVG.getBoundingClientRect().left;
  clickLog.clickY = event.clientY - outerSVG.getBoundingClientRect().top;

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

  clickLog.targetX = parseFloat(target.getAttribute('viewBox').split(' ')[0]) * -1;
  clickLog.targetY = parseFloat(target.getAttribute('viewBox').split(' ')[1]) * -1;

  // define center of target
  clickLog.targetWidth = target.getBBox().width;
  clickLog.targetHeight = target.getBBox().height;
  clickLog.targetCenterX = clickLog.targetX + target.getBBox().width / 2;
  clickLog.targetCenterY = clickLog.targetY + target.getBBox().height / 2;

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

  responseLog.push(clickLog);
};

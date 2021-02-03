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
  clickLog.clickX = clickLog.screenScalingWidth * event.offsetX;
  clickLog.clickY = clickLog.screenScalingHeight * event.offsetY;

  const clickBubble = document.getElementById('click-bubble');
  clickBubble.setAttribute('cx', `${clickLog.clickX}`);
  clickBubble.setAttribute('cy', `${clickLog.clickY}`);
  // let clickBubble be visible only for 0.2 sec
  gsap.to(clickBubble, {
    duration: 0.5,
    attr: { visibility: 'visible' },
    onComplete() {
      clickBubble.setAttribute('visibility', 'hidden');
    },
  });

  document.getElementById('sound').play();

  const targetX = parseFloat(target.getAttribute('viewBox').split(' ')[0]);
  const targetY = parseFloat(target.getAttribute('viewBox').split(' ')[1]);

  // define center of target
  clickLog.targetCenterX = -(targetX - target.getBBox().width / 2);
  clickLog.targetCenterY = -(targetY - target.getBBox().height / 2);

  // clicked on target?
  clickLog.clickDeviationX = clickLog.clickX - clickLog.targetCenterX;
  clickLog.clickDeviationY = clickLog.clickY - clickLog.targetCenterY;

  responseLog.push(clickLog);
};

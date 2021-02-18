import { gsap } from 'gsap';

export default (event, exp, trialCount) => {
  // in our context, offset and client same values
  exp.responseLog[trialCount].offsetWidth = document.body.offsetWidth;
  exp.responseLog[trialCount].offsetHeight = document.body.offsetHeight;

  // how much smaller/bigger is the SVG coordinate system wrt the screen size?
  exp.responseLog[trialCount].screenScalingWidth = exp.elemSpecs.outerSVG.origViewBoxWidth / exp.responseLog[trialCount].offsetWidth;
  exp.responseLog[trialCount].screenScalingHeight = exp.elemSpecs.outerSVG.origViewBoxHeight / exp.responseLog[trialCount].offsetHeight;

  // click coordinates (event.offset) * scaling
  // originally, we used offset. Didn't work in Firefox.
  exp.responseLog[trialCount].clickX = event.clientX - exp.elemSpecs.outerSVG.ID.getBoundingClientRect().left;
  exp.responseLog[trialCount].clickY = event.clientY - exp.elemSpecs.outerSVG.ID.getBoundingClientRect().top;

  exp.responseLog[trialCount].clickScaledX = exp.responseLog[trialCount].screenScalingWidth * exp.responseLog[trialCount].clickX;
  exp.responseLog[trialCount].clickScaledY = exp.responseLog[trialCount].screenScalingHeight * exp.responseLog[trialCount].clickY;

  const clickBubble = document.getElementById('click-bubble');
  clickBubble.setAttribute('cx', `${exp.responseLog[trialCount].clickScaledX}`);
  clickBubble.setAttribute('cy', `${exp.responseLog[trialCount].clickScaledY}`);
  // let clickBubble be visible only for 0.2 sec
  gsap.to(clickBubble, {
    duration: 0.5,
    attr: { visibility: 'visible' },
    onComplete() {
      clickBubble.setAttribute('visibility', 'hidden');
    },
  });

  document.getElementById('positive-sound').play();

  exp.responseLog[trialCount].targetX = parseFloat(exp.targets[trialCount].getAttribute('viewBox').split(' ')[0]) * -1;
  exp.responseLog[trialCount].targetY = parseFloat(exp.targets[trialCount].getAttribute('viewBox').split(' ')[1]) * -1;

  // define center of target
  exp.responseLog[trialCount].targetWidth = exp.targets[trialCount].getBBox().width;
  exp.responseLog[trialCount].targetHeight = exp.targets[trialCount].getBBox().height;
  exp.responseLog[trialCount].targetCenterX = exp.responseLog[trialCount].targetX + exp.targets[trialCount].getBBox().width / 2;
  exp.responseLog[trialCount].targetCenterY = exp.responseLog[trialCount].targetY + exp.targets[trialCount].getBBox().height / 2;

  // clicked on target?
  // for x: negative values mean too far left, positive values mean too far right
  // for y: negative values mean too low, positive values mean too high
  exp.responseLog[trialCount].clickDistFromTargetCenterX = exp.responseLog[trialCount].clickScaledX - exp.responseLog[trialCount].targetCenterX;
  exp.responseLog[trialCount].clickDistFromTargetCenterY = exp.responseLog[trialCount].targetCenterY - exp.responseLog[trialCount].clickScaledY;

  exp.responseLog[trialCount].hitBBTargetX = false;
  exp.responseLog[trialCount].hitBBTargetY = false;

  if (exp.responseLog[trialCount].targetX <= exp.responseLog[trialCount].clickScaledX && exp.responseLog[trialCount].clickScaledX <= (exp.responseLog[trialCount].targetX + exp.responseLog[trialCount].targetWidth)) {
    exp.responseLog[trialCount].hitBBTargetX = true;
  }
  if (exp.responseLog[trialCount].targetY <= exp.responseLog[trialCount].clickScaledY && exp.responseLog[trialCount].clickScaledY <= (exp.responseLog[trialCount].targetY + exp.responseLog[trialCount].targetHeight)) {
    exp.responseLog[trialCount].hitBBTargetY = true;
  }

  // for PC version of experiment, check which box was clicked
  if (exp.subjData.touchScreen) {
    if (exp.trialType[trialCount] === 'fam') exp.responseLog[trialCount].clickedArea = 'clickable-area';
    if (exp.trialType[trialCount] === 'test') exp.responseLog[trialCount].clickedArea = 'hedge';
  }
  if (!exp.subjData.touchScreen) {
    if (exp.trialType[trialCount] === 'fam') exp.responseLog[trialCount].clickedArea = 'clickable-area';
    if (exp.trialType[trialCount] === 'test') exp.responseLog[trialCount].clickedArea = event.path[1].getAttribute('id');
  }
};

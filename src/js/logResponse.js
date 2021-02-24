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

  // user feedback where they clicked (with sound)
  const clickBubble = document.getElementById('click-bubble');
  clickBubble.setAttribute('cx', `${exp.responseLog[trialCount].clickScaledX}`);
  clickBubble.setAttribute('cy', `${exp.responseLog[trialCount].clickScaledY}`);
  // let clickBubble be visible only for 0.5 sec
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
  // NOTE: the SVG coord system starts with 0, 0 in upper left corner
  // for x: negative values mean too far left, positive values mean too far right
  // for y: negative values mean too high, positive values mean too low
  exp.responseLog[trialCount].clickDistFromTargetCenterX = exp.responseLog[trialCount].clickScaledX - exp.responseLog[trialCount].targetCenterX;
  exp.responseLog[trialCount].clickDistFromTargetCenterY = exp.responseLog[trialCount].clickScaledY - exp.responseLog[trialCount].targetCenterY;

  exp.responseLog[trialCount].hitBBTargetX = false;
  exp.responseLog[trialCount].hitBBTargetY = false;

  if (exp.responseLog[trialCount].targetX <= exp.responseLog[trialCount].clickScaledX && exp.responseLog[trialCount].clickScaledX <= (exp.responseLog[trialCount].targetX + exp.responseLog[trialCount].targetWidth)) {
    exp.responseLog[trialCount].hitBBTargetX = true;
  }
  if (exp.responseLog[trialCount].targetY <= exp.responseLog[trialCount].clickScaledY && exp.responseLog[trialCount].clickScaledY <= (exp.responseLog[trialCount].targetY + exp.responseLog[trialCount].targetHeight)) {
    exp.responseLog[trialCount].hitBBTargetY = true;
  }

  // calculate distance between click coords and target bounding box
  // for x axis
  if (exp.responseLog[trialCount].hitBBTargetX === true) {
    exp.responseLog[trialCount].clickDistFromTargetBBoxX = 0;
  } else if (exp.responseLog[trialCount].clickScaledX < exp.responseLog[trialCount].targetX) {
    exp.responseLog[trialCount].clickDistFromTargetBBoxX = (
      exp.responseLog[trialCount].clickScaledX - exp.responseLog[trialCount].targetX
    );
  } else if (exp.responseLog[trialCount].clickScaledX > exp.responseLog[trialCount].targetX) {
    exp.responseLog[trialCount].clickDistFromTargetBBoxX = (
      exp.responseLog[trialCount].clickScaledX
      - (exp.responseLog[trialCount].targetX + exp.responseLog[trialCount].targetWidth)
    );
  }
  // for y axis
  if (exp.responseLog[trialCount].hitBBTargetY === true) {
    exp.responseLog[trialCount].clickDistFromTargetBBoxY = 0;
  } else if (exp.responseLog[trialCount].clickScaledY < exp.responseLog[trialCount].targetY) {
    exp.responseLog[trialCount].clickDistFromTargetBBoxY = (
      exp.responseLog[trialCount].clickScaledY - exp.responseLog[trialCount].targetY
    );
  } else if (exp.responseLog[trialCount].clickScaledY > exp.responseLog[trialCount].targetY) {
    exp.responseLog[trialCount].clickDistFromTargetBBoxY = (
      exp.responseLog[trialCount].clickScaledY
      - (exp.responseLog[trialCount].targetY + exp.responseLog[trialCount].targetHeight)
    );
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

  // log all important trial infos
  exp.responseLog[trialCount].subjID = exp.subjData.subjID;
  exp.responseLog[trialCount].touchScreen = exp.subjData.touchScreen;
  exp.responseLog[trialCount].trialNr = trialCount + 1;
  exp.responseLog[trialCount].agent = `${exp.agents[trialCount].getAttribute('id')}`;
  exp.responseLog[trialCount].target = `${exp.targets[trialCount].getAttribute('id')}`;
  exp.responseLog[trialCount].trialType = exp.trialType[trialCount];
  exp.responseLog[trialCount].positionBin = exp.positions[trialCount].bin;
  exp.responseLog[trialCount].responseTime = exp.responseLog[trialCount].responseTime.t1 - exp.responseLog[trialCount].responseTime.t0;

  exp.responseLog[trialCount].eyeRadius = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[trialCount].agent].radius,
  );
  exp.responseLog[trialCount].eyeCenterLeftX = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[trialCount].agent].left.center.x,
  );
  exp.responseLog[trialCount].eyeCenterLeftY = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[trialCount].agent].left.center.y,
  );
  exp.responseLog[trialCount].pupilTargetLeftX = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[trialCount].agent].left.random.x,
  );
  exp.responseLog[trialCount].pupilTargetLeftY = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[trialCount].agent].left.random.y,
  );
  exp.responseLog[trialCount].eyeCenterRightX = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[trialCount].agent].right.center.x,
  );
  exp.responseLog[trialCount].eyeCenterRightY = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[trialCount].agent].right.center.y,
  );
  exp.responseLog[trialCount].pupilTargetRightX = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[trialCount].agent].right.random.x,
  );
  exp.responseLog[trialCount].pupilTargetRightY = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[trialCount].agent].right.random.y,
  );
};

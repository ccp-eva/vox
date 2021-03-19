import { gsap } from 'gsap';
// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR LOGGING ALL RELEVANT TRIAL INFOS
// ---------------------------------------------------------------------------------------------------------------------
export default (event, exp) => {
  // get user screen size
  // offset and client properties don't work, they include padding/borders etc. when we style our svg in the CSS
  exp.responseLog[exp.trials.count].clientScreenWidth = document.getElementById('experiment-slide').getBoundingClientRect().width;
  exp.responseLog[exp.trials.count].clientScreenHeight = document.getElementById('experiment-slide').getBoundingClientRect().height;

  // how much smaller/bigger is the SVG coordinate system wrt the screen size?
  // we could do the same with origViewBoxWidth / clientScreenWidth, will result in the same value
  exp.responseLog[exp.trials.count].clientScreenScaling = exp.responseLog[exp.trials.count].clientScreenHeight / exp.elemSpecs.outerSVG.origViewBoxHeight;

  // user feedback where they clicked (with sound)
  // create point (needed for transformation function later) and pass event coordinates
  const clickOriginal = exp.elemSpecs.outerSVG.ID.createSVGPoint();
  clickOriginal.x = event.clientX;
  clickOriginal.y = event.clientY;

  // transform client user coordinate system to SVG coordinates
  // see: https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
  const clickScaled = clickOriginal.matrixTransform(exp.elemSpecs.outerSVG.ID.getScreenCTM().inverse());

  // save original and transformed click coords in our response log
  exp.responseLog[exp.trials.count].clickOriginalX = clickOriginal.x;
  exp.responseLog[exp.trials.count].clickOriginalY = clickOriginal.y;
  exp.responseLog[exp.trials.count].clickScaledX = clickScaled.x;
  exp.responseLog[exp.trials.count].clickScaledY = clickScaled.y;

  // get the circle that we set on the click coordinates
  const clickBubble = document.getElementById('click-bubble');
  clickBubble.setAttribute('cx', exp.responseLog[exp.trials.count].clickScaledX);
  clickBubble.setAttribute('cy', exp.responseLog[exp.trials.count].clickScaledY);

  // let clickBubble be visible only for 0.5 sec
  gsap.to(clickBubble, {
    duration: 0.5,
    attr: { visibility: 'visible' },
    onComplete() {
      clickBubble.setAttribute('visibility', 'hidden');
    },
  });

  // play positive user feedback
  document.getElementById('positive-sound').play();

  // get upper left corner of target
  exp.responseLog[exp.trials.count].targetX = exp.positions[exp.trials.count].x;
  exp.responseLog[exp.trials.count].targetY = exp.positions[exp.trials.count].y;

  // define center of target
  exp.responseLog[exp.trials.count].targetWidth = exp.targets[exp.trials.count].getBBox().width;
  exp.responseLog[exp.trials.count].targetHeight = exp.targets[exp.trials.count].getBBox().height;
  exp.responseLog[exp.trials.count].targetCenterX = exp.responseLog[exp.trials.count].targetX + exp.targets[exp.trials.count].getBBox().width / 2;
  exp.responseLog[exp.trials.count].targetCenterY = exp.responseLog[exp.trials.count].targetY + exp.targets[exp.trials.count].getBBox().height / 2;

  // clicked on target?
  // NOTE: the SVG coord system starts with 0, 0 in upper left corner
  // for x: negative values mean too far left, positive values mean too far right
  // for y: negative values mean too high, positive values mean too low
  exp.responseLog[exp.trials.count].clickDistFromTargetCenterX = exp.responseLog[exp.trials.count].clickScaledX - exp.responseLog[exp.trials.count].targetCenterX;
  exp.responseLog[exp.trials.count].clickDistFromTargetCenterY = exp.responseLog[exp.trials.count].clickScaledY - exp.responseLog[exp.trials.count].targetCenterY;

  // did you click somewhere on the target?
  exp.responseLog[exp.trials.count].hitBBTargetX = false;
  exp.responseLog[exp.trials.count].hitBBTargetY = false;

  if (exp.responseLog[exp.trials.count].targetX <= exp.responseLog[exp.trials.count].clickScaledX && exp.responseLog[exp.trials.count].clickScaledX <= (exp.responseLog[exp.trials.count].targetX + exp.responseLog[exp.trials.count].targetWidth)) {
    exp.responseLog[exp.trials.count].hitBBTargetX = true;
  }
  if (exp.responseLog[exp.trials.count].targetY <= exp.responseLog[exp.trials.count].clickScaledY && exp.responseLog[exp.trials.count].clickScaledY <= (exp.responseLog[exp.trials.count].targetY + exp.responseLog[exp.trials.count].targetHeight)) {
    exp.responseLog[exp.trials.count].hitBBTargetY = true;
  }

  // calculate distance between click coords and target bounding box
  // for x axis
  if (exp.responseLog[exp.trials.count].hitBBTargetX === true) {
    exp.responseLog[exp.trials.count].clickDistFromTargetBBoxX = 0;
  } else if (exp.responseLog[exp.trials.count].clickScaledX < exp.responseLog[exp.trials.count].targetX) {
    exp.responseLog[exp.trials.count].clickDistFromTargetBBoxX = (
      exp.responseLog[exp.trials.count].clickScaledX - exp.responseLog[exp.trials.count].targetX
    );
  } else if (exp.responseLog[exp.trials.count].clickScaledX > exp.responseLog[exp.trials.count].targetX) {
    exp.responseLog[exp.trials.count].clickDistFromTargetBBoxX = (
      exp.responseLog[exp.trials.count].clickScaledX
      - (exp.responseLog[exp.trials.count].targetX + exp.responseLog[exp.trials.count].targetWidth)
    );
  }
  // for y axis
  if (exp.responseLog[exp.trials.count].hitBBTargetY === true) {
    exp.responseLog[exp.trials.count].clickDistFromTargetBBoxY = 0;
  } else if (exp.responseLog[exp.trials.count].clickScaledY < exp.responseLog[exp.trials.count].targetY) {
    exp.responseLog[exp.trials.count].clickDistFromTargetBBoxY = (
      exp.responseLog[exp.trials.count].clickScaledY - exp.responseLog[exp.trials.count].targetY
    );
  } else if (exp.responseLog[exp.trials.count].clickScaledY > exp.responseLog[exp.trials.count].targetY) {
    exp.responseLog[exp.trials.count].clickDistFromTargetBBoxY = (
      exp.responseLog[exp.trials.count].clickScaledY
      - (exp.responseLog[exp.trials.count].targetY + exp.responseLog[exp.trials.count].targetHeight)
    );
  }

  // for tablet version, just save which area was clicked (either clickable-area or hedge)
  if (exp.subjData.touchScreen) {
    exp.responseLog[exp.trials.count].clickedArea = event.currentTarget.id;

    // for PC version of experiment, check which box was clicked
  } else if (!exp.subjData.touchScreen) {
    console.log('currentTarget', event.currentTarget.id);

    // if participants clicked on the part of the balooon that is still visible,
    // simply save in which box the balloon is in
    if (event.currentTarget.id.includes('balloon')) {
      exp.responseLog[exp.trials.count].clickedArea = `box${exp.positions[exp.trials.count].bin}`;
    // if participants clicked on a box, save on which one
    } else {
      // get all boxes (by taking all child elements)
      const boxesFront = document.getElementById('boxes8-front').children;
      const boxesBack = document.getElementById('boxes8-back').children;
      const boxIDs = [];
      // get all box IDs
      for (let i = 0; i < boxesFront.length; i++) {
        boxIDs.push(boxesFront[i].id);
        boxIDs.push(boxesBack[i].id);
      }
      // for each box, see whether it was clicked or not
      boxIDs.forEach((box) => {
        if (event.target.closest(`#${box}`) !== null) {
          // save the id of the one box that was clicked (without the "boxes8-front/back-" prefix)
          const clickedBox = box.replace('boxes8-', '').replace('front-', '').replace('back-', '');
          exp.responseLog[exp.trials.count].clickedArea = clickedBox;
        }
      });
    }
  }

  // log all important trial infos
  exp.responseLog[exp.trials.count].subjID = exp.subjData.subjID;
  exp.responseLog[exp.trials.count].touchScreen = exp.subjData.touchScreen;
  exp.responseLog[exp.trials.count].trialNr = exp.trials.count + 1;
  exp.responseLog[exp.trials.count].agent = `${exp.agents[exp.trials.count].getAttribute('id')}`;
  exp.responseLog[exp.trials.count].target = `${exp.targets[exp.trials.count].getAttribute('id')}`;
  exp.responseLog[exp.trials.count].trialType = exp.trials.type[exp.trials.count];
  exp.responseLog[exp.trials.count].positionBin = exp.positions[exp.trials.count].bin;
  exp.responseLog[exp.trials.count].responseTime = exp.responseLog[exp.trials.count].responseTime.t1 - exp.responseLog[exp.trials.count].responseTime.t0;

  exp.responseLog[exp.trials.count].eyeRadius = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[exp.trials.count].agent].radius,
  );
  exp.responseLog[exp.trials.count].eyeCenterLeftX = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[exp.trials.count].agent].left.center.x,
  );
  exp.responseLog[exp.trials.count].eyeCenterLeftY = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[exp.trials.count].agent].left.center.y,
  );
  exp.responseLog[exp.trials.count].pupilFinalLeftX = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[exp.trials.count].agent].left.final.x,
  );
  exp.responseLog[exp.trials.count].pupilFinalLeftY = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[exp.trials.count].agent].left.final.y,
  );
  exp.responseLog[exp.trials.count].eyeCenterRightX = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[exp.trials.count].agent].right.center.x,
  );
  exp.responseLog[exp.trials.count].eyeCenterRightY = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[exp.trials.count].agent].right.center.y,
  );
  exp.responseLog[exp.trials.count].pupilFinalRightX = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[exp.trials.count].agent].right.final.x,
  );
  exp.responseLog[exp.trials.count].pupilFinalRightY = parseFloat(
    exp.elemSpecs.eyes[exp.responseLog[exp.trials.count].agent].right.final.y,
  );
};

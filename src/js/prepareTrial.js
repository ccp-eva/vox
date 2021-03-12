import { gsap } from 'gsap';
import showElement from './showElement';
import getGazeCoords from './getGazeCoords';
import distancePoints from './distancePoints';

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION THAT PREPARES EACH TRIAL
// i.e., calculate all relevant variables, show/hide elements
// ---------------------------------------------------------------------------------------------------------------------
export default (exp) => {
  // show blurred canvas and button
  document.getElementById('experiment-button').setAttribute('visibility', 'visible');
  document.getElementById('cover-blurr').setAttribute('visibility', 'visible');

  // show agent and target of the current trial only, hide the other ones
  showElement(exp.agents, exp.trials.count);
  showElement(exp.targets, exp.trials.count);

  // get relevant elements
  const currentAgent = `${exp.agents[exp.trials.count].getAttribute('id')}`;
  const pupilLeft = document.getElementById(`${currentAgent}-pupil-left`);
  const pupilRight = document.getElementById(`${currentAgent}-pupil-right`);
  const irisLeft = document.getElementById(`${currentAgent}-iris-left`);
  const irisRight = document.getElementById(`${currentAgent}-iris-right`);
  const eyelineLeft = document.getElementById(`${currentAgent}-eyeline-left`);
  const eyelineRight = document.getElementById(`${currentAgent}-eyeline-right`);
  const hedge = document.getElementById('hedge');
  const boxes8Front = document.getElementById('boxes8-front');
  const boxes8Back = document.getElementById('boxes8-back');

  // set eyes to center
  // original value stored in e.g. pupilLeft.getBBox().x
  // but we just need to remove the transform attribute
  gsap.set([pupilLeft, pupilRight, irisLeft, irisRight, hedge, exp.targets[exp.trials.count]], {
    x: 0,
    y: 0,
  });

  // depending on trial type, show or hide hedge
  if (exp.trials.type[exp.trials.count] === 'fam') {
    hedge.setAttribute('visibility', 'hidden');
  } else if (exp.trials.type[exp.trials.count] === 'test') {
    hedge.setAttribute('visibility', 'visible');
  }

  // for PC version show boxes, for touchscreen hide them
  if (exp.subjData.touchScreen) {
    boxes8Front.setAttribute('visibility', 'hidden');
    boxes8Back.setAttribute('visibility', 'hidden');
  } else if (!exp.subjData.touchScreen) {
    boxes8Front.setAttribute('visibility', 'visible');
    boxes8Back.setAttribute('visibility', 'visible');
  }

  // calculate how far the balloon will fly
  // for tablet fam trials where balloon directly goes to final position
  exp.elemSpecs.targets.centerFinal = {
    x: exp.positions[exp.trials.count].x - exp.elemSpecs.targets.center.x,
    y: exp.positions[exp.trials.count].y - exp.elemSpecs.targets.center.y,
  };

  // for PC fam trials where balloon first lands above boxes
  exp.elemSpecs.targets.centerBox = {
    x: exp.positions[exp.trials.count].x - exp.elemSpecs.targets.center.x,
    y: exp.elemSpecs.targets.aboveBoxesY - exp.elemSpecs.targets.center.y,
  };
  exp.elemSpecs.targets.BoxFinal = {
    x: exp.positions[exp.trials.count].x - exp.elemSpecs.targets.center.x,
    y: exp.elemSpecs.targets.partlyInBoxesY - exp.elemSpecs.targets.center.y,
  };

  // for test trials where balloon first hides under hedge
  exp.elemSpecs.targets.centerHalfway = {
    x: exp.elemSpecs.targets.halfway.x - exp.elemSpecs.targets.center.x,
    y: exp.elemSpecs.targets.halfway.y - exp.elemSpecs.targets.center.y,
  };

  // calculate where eyes should move in the trial
  const gazeCoordsLeft = getGazeCoords(
    exp.targets[exp.trials.count], exp.positions[exp.trials.count],
    pupilLeft, eyelineLeft,
  );
  exp.elemSpecs.eyes[currentAgent].left.final = gazeCoordsLeft;

  const gazeCoordsRight = getGazeCoords(
    exp.targets[exp.trials.count], exp.positions[exp.trials.count],
    pupilRight, eyelineRight,
  );
  exp.elemSpecs.eyes[currentAgent].right.final = gazeCoordsRight;

  // for fam trials
  if (exp.trials.type[exp.trials.count] === 'fam') {
    // with boxes, calculate eye position to balloon position above box
    // (gets used only when there are boxes = in PC version)
    const gazeCoordsAboveBoxesLeft = getGazeCoords(
      exp.targets[exp.trials.count],
      { x: exp.positions[exp.trials.count].x, y: exp.elemSpecs.targets.aboveBoxesY },
      pupilLeft, eyelineLeft,
    );
    exp.elemSpecs.eyes[currentAgent].left.aboveBoxes = gazeCoordsAboveBoxesLeft;

    const gazeCoordsAboveBoxesRight = getGazeCoords(
      exp.targets[exp.trials.count],
      { x: exp.positions[exp.trials.count].x, y: exp.elemSpecs.targets.aboveBoxesY },
      pupilRight, eyelineRight,
    );
    exp.elemSpecs.eyes[currentAgent].right.aboveBoxes = gazeCoordsAboveBoxesRight;

    // for animation, calculate distance
    exp.elemSpecs.eyes[currentAgent].left.centerBox = {
      x: gazeCoordsAboveBoxesLeft.x - exp.elemSpecs.eyes[currentAgent].left.center.x,
      y: gazeCoordsAboveBoxesLeft.y - exp.elemSpecs.eyes[currentAgent].left.center.y,
    };

    exp.elemSpecs.eyes[currentAgent].left.centerFinal = {
      x: gazeCoordsLeft.x - exp.elemSpecs.eyes[currentAgent].left.center.x,
      y: gazeCoordsLeft.y - exp.elemSpecs.eyes[currentAgent].left.center.y,
    };

    // this always gets used (for PC and tablet version)
    exp.elemSpecs.eyes[currentAgent].right.centerBox = {
      x: gazeCoordsAboveBoxesRight.x - exp.elemSpecs.eyes[currentAgent].right.center.x,
      y: gazeCoordsAboveBoxesRight.y - exp.elemSpecs.eyes[currentAgent].right.center.y,
    };
    exp.elemSpecs.eyes[currentAgent].right.centerFinal = {
      x: gazeCoordsRight.x - exp.elemSpecs.eyes[currentAgent].right.center.x,
      y: gazeCoordsRight.y - exp.elemSpecs.eyes[currentAgent].right.center.y,
    };
  }

  // for test trials: first let eyes follow balloon to middle, until balloon is hidden
  if (exp.trials.type[exp.trials.count] === 'test') {
    const gazeCoordsHalfwayLeft = getGazeCoords(
      exp.targets[exp.trials.count], exp.elemSpecs.targets.halfway,
      pupilLeft, eyelineLeft,
    );
    exp.elemSpecs.eyes[currentAgent].left.halfway = gazeCoordsHalfwayLeft;

    const gazeCoordsHalfwayRight = getGazeCoords(
      exp.targets[exp.trials.count], exp.elemSpecs.targets.halfway,
      pupilRight, eyelineRight,
    );
    exp.elemSpecs.eyes[currentAgent].right.halfway = gazeCoordsHalfwayRight;

    // for animation, calculate distance
    exp.elemSpecs.eyes[currentAgent].left.centerHalfway = {
      x: gazeCoordsHalfwayLeft.x - exp.elemSpecs.eyes[currentAgent].left.center.x,
      y: gazeCoordsHalfwayLeft.y - exp.elemSpecs.eyes[currentAgent].left.center.y,
    };

    exp.elemSpecs.eyes[currentAgent].left.centerFinal = {
      x: gazeCoordsLeft.x - exp.elemSpecs.eyes[currentAgent].left.center.x,
      y: gazeCoordsLeft.y - exp.elemSpecs.eyes[currentAgent].left.center.y,
    };

    exp.elemSpecs.eyes[currentAgent].right.centerHalfway = {
      x: gazeCoordsHalfwayRight.x - exp.elemSpecs.eyes[currentAgent].right.center.x,
      y: gazeCoordsHalfwayRight.y - exp.elemSpecs.eyes[currentAgent].right.center.y,
    };
    exp.elemSpecs.eyes[currentAgent].right.centerFinal = {
      x: gazeCoordsRight.x - exp.elemSpecs.eyes[currentAgent].right.center.x,
      y: gazeCoordsRight.y - exp.elemSpecs.eyes[currentAgent].right.center.y,
    };
  }

  // calculate distance between center and target position, for constant speed
  const distanceCenterFinal = distancePoints(
    exp.elemSpecs.targets.center,
    { x: exp.positions[exp.trials.count].x, y: exp.positions[exp.trials.count].y },
  );

  // for fam trials box version: balloon lands over box, then goes inside
  const distanceCenterBox = distancePoints(
    exp.elemSpecs.targets.center,
    { x: exp.positions[exp.trials.count].x, y: exp.elemSpecs.targets.aboveBoxesY },
  );

  const distanceBoxFinal = distancePoints(
    { x: exp.positions[exp.trials.count].x, y: exp.elemSpecs.targets.aboveBoxesY },
    { x: exp.positions[exp.trials.count].x, y: exp.elemSpecs.targets.partlyInBoxesY },
  );

  // for all test trials, balloon hides first, then goes to final position
  const distanceCenterHalfway = distancePoints(
    exp.elemSpecs.targets.center,
    exp.elemSpecs.targets.halfway,
  );
  const distanceHalfwayFinal = distancePoints(
    exp.elemSpecs.targets.halfway,
    { x: exp.positions[exp.trials.count].x, y: exp.positions[exp.trials.count].y },
  );

  const perSecond = 400;

  exp.responseLog[exp.trials.count] = {};
  exp.responseLog[exp.trials.count].wrongClick = 0;

  // save animation speed in our exp object
  if (exp.trials.type[exp.trials.count] === 'fam') {
    if (exp.subjData.touchScreen) {
      exp.responseLog[exp.trials.count].durationAnimationTotal = distanceCenterFinal / perSecond;
    } else if (!exp.subjData.touchScreen) {
      exp.responseLog[exp.trials.count].durationAnimationCenterBox = distanceCenterBox / perSecond;
      exp.responseLog[exp.trials.count].durationAnimationBoxFinal = distanceBoxFinal / perSecond;
      exp.responseLog[exp.trials.count].durationAnimationTotal = (distanceCenterBox / perSecond) + (distanceBoxFinal / perSecond);
    }
  } else if (exp.trials.type[exp.trials.count] === 'test') {
    exp.responseLog[exp.trials.count].durationAnimationCenterHalfway = distanceCenterHalfway / perSecond;
    exp.responseLog[exp.trials.count].durationAnimationHalfwayFinal = distanceHalfwayFinal / perSecond;
    exp.responseLog[exp.trials.count].durationAnimationTotal = (distanceCenterHalfway / perSecond) + (distanceHalfwayFinal / perSecond);
  }
};

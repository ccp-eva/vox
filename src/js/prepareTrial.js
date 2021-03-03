import setCircleAttr from './setCircleAttr';
import setViewBoxAttr from './setViewBoxAttr';
import getGazeCoords from './getGazeCoords';

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION THAT PREPARES EACH TRIAL
// i.e., calculate all relevant variables, show/hide elements
// ---------------------------------------------------------------------------------------------------------------------
export default (exp) => {
  // show blurred canvas and button
  document.getElementById('experiment-button').setAttribute('visibility', 'visible');
  document.getElementById('cover-blurr').setAttribute('visibility', 'visible');

  // get relevant elements
  const pupilLeft = document.getElementById('monkey-pupil-left');
  const pupilRight = document.getElementById('monkey-pupil-right');
  const irisLeft = document.getElementById('monkey-iris-left');
  const irisRight = document.getElementById('monkey-iris-right');
  const eyelineLeft = document.getElementById('monkey-eyeline-left');
  const eyelineRight = document.getElementById('monkey-eyeline-right');
  const hedge = document.getElementById('hedge');

  // set eyes to center
  setCircleAttr(pupilLeft, exp.elemSpecs.eyes.left.center);
  setCircleAttr(pupilRight, exp.elemSpecs.eyes.right.center);
  setCircleAttr(irisLeft, exp.elemSpecs.eyes.left.center);
  setCircleAttr(irisRight, exp.elemSpecs.eyes.right.center);

  // set target to center
  setViewBoxAttr(exp.balloons[exp.trials.count], `${exp.elemSpecs.balloons.viewBoxCenter}`);

  // set hedge back to original location
  setViewBoxAttr(hedge, `${exp.elemSpecs.outerSVG.origViewBox}`);

  // calculate where exp.responseLog should move in the trial
  // for test trials: first let eyes follow balloon to middle, until balloon is hidden
  const gazeCoordsBeginningLeft = getGazeCoords(
    exp.balloons[exp.trials.count], exp.elemSpecs.balloons.viewBoxHidden,
    pupilLeft, eyelineLeft,
  );
  const gazeCoordsBeginningRight = getGazeCoords(
    exp.balloons[exp.trials.count], exp.elemSpecs.balloons.viewBoxHidden,
    pupilRight, eyelineRight,
  );

  const gazeCoordsLeft = getGazeCoords(
    exp.balloons[exp.trials.count], exp.positions[exp.trials.count].viewBoxRandom,
    pupilLeft, eyelineLeft,
  );

  const gazeCoordsRight = getGazeCoords(
    exp.balloons[exp.trials.count], exp.positions[exp.trials.count].viewBoxRandom,
    pupilRight, eyelineRight,
  );

  // save calculated values in our exp object
  exp.elemSpecs.eyes.left.beginning = gazeCoordsBeginningLeft;
  exp.elemSpecs.eyes.left.random = gazeCoordsLeft;
  exp.elemSpecs.eyes.right.beginning = gazeCoordsBeginningRight;
  exp.elemSpecs.eyes.right.random = gazeCoordsRight;
};

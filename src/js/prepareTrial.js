import setCircleAttr from './setCircleAttr';
import setViewBoxAttr from './setViewBoxAttr';
import showElement from './showElement';
import getGazeCoords from './getGazeCoords';
import distanceViewBoxes from './distanceViewBoxes';

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

  // set eyes to center
  setCircleAttr(pupilLeft, exp.elemSpecs.eyes[currentAgent].left.center);
  setCircleAttr(pupilRight, exp.elemSpecs.eyes[currentAgent].right.center);
  setCircleAttr(irisLeft, exp.elemSpecs.eyes[currentAgent].left.center);
  setCircleAttr(irisRight, exp.elemSpecs.eyes[currentAgent].right.center);

  // set target to center
  setViewBoxAttr(exp.targets[exp.trials.count], `${exp.elemSpecs.targets.viewBoxCenter}`);

  // set hedge back to original location
  setViewBoxAttr(hedge, `${exp.elemSpecs.outerSVG.origViewBox}`);

  // depending on trial type, show or hide hedge
  if (exp.trials.type[exp.trials.count] === 'fam') {
    hedge.setAttribute('visibility', 'hidden');
  } else if (exp.trials.type[exp.trials.count] === 'test') {
    hedge.setAttribute('visibility', 'visible');
  }

  // calculate where exp.responseLog should move in the trial
  // for test trials: first let eyes follow balloon to middle, until balloon is hidden
  const gazeCoordsBeginningLeft = getGazeCoords(
    exp.targets[exp.trials.count], exp.elemSpecs.targets.viewBoxHidden,
    pupilLeft, eyelineLeft,
  );
  const gazeCoordsBeginningRight = getGazeCoords(
    exp.targets[exp.trials.count], exp.elemSpecs.targets.viewBoxHidden,
    pupilRight, eyelineRight,
  );

  const gazeCoordsLeft = getGazeCoords(
    exp.targets[exp.trials.count], exp.positions[exp.trials.count].viewBoxRandom,
    pupilLeft, eyelineLeft,
  );

  const gazeCoordsRight = getGazeCoords(
    exp.targets[exp.trials.count], exp.positions[exp.trials.count].viewBoxRandom,
    pupilRight, eyelineRight,
  );

  // save calculated values in our exp object
  exp.elemSpecs.eyes[currentAgent].left.beginning = gazeCoordsBeginningLeft;
  exp.elemSpecs.eyes[currentAgent].left.random = gazeCoordsLeft;
  exp.elemSpecs.eyes[currentAgent].right.beginning = gazeCoordsBeginningRight;
  exp.elemSpecs.eyes[currentAgent].right.random = gazeCoordsRight;

  // calculate distance between middle and target position, for constant speed
  const distanceCenterRandom = distanceViewBoxes(
    exp.elemSpecs.targets.viewBoxCenter, exp.positions[exp.trials.count].viewBoxRandom,
  );
  const distanceCenterHidden = distanceViewBoxes(
    exp.elemSpecs.targets.viewBoxCenter, exp.elemSpecs.targets.viewBoxHidden,
  );
  const distanceHiddenRandom = distanceViewBoxes(
    exp.elemSpecs.targets.viewBoxHidden, exp.positions[exp.trials.count].viewBoxRandom,
  );
  const perSecond = 300;

  exp.responseLog[exp.trials.count] = {};
  // save animation speed in our exp object
  if (exp.trials.type[exp.trials.count] === 'fam') {
    exp.responseLog[exp.trials.count].durationAnimationTotal = distanceCenterRandom / perSecond;
  } else if (exp.trials.type[exp.trials.count] === 'test') {
    exp.responseLog[exp.trials.count].durationAnimationCenterHidden = distanceCenterHidden / perSecond;
    exp.responseLog[exp.trials.count].durationAnimationHiddenRandom = distanceHiddenRandom / perSecond;
    exp.responseLog[exp.trials.count].durationAnimationTotal = (distanceCenterHidden / perSecond) + (distanceHiddenRandom / perSecond);
  }
};

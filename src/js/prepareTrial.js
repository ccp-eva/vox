import setCircleCenter from './setCircleCenter';
import setTargetCenter from './setTargetCenter';
import showElement from './showElement';
import getGazeCoords from './getGazeCoords';
import distanceViewBoxes from './distanceViewBoxes';

export default (exp, trialCount) => {
  document.getElementById('experiment-button').setAttribute('visibility', 'visible');
  document.getElementById('cover-blurr').setAttribute('visibility', 'visible');

  // show agent and target of the current trial only, hide the other ones
  showElement(exp.agents, trialCount);
  showElement(exp.targets, trialCount);

  const currentAgent = `${exp.agents[trialCount].getAttribute('id')}`;
  const pupilLeft = document.getElementById(`${currentAgent}-pupil-left`);
  const pupilRight = document.getElementById(`${currentAgent}-pupil-right`);
  const irisLeft = document.getElementById(`${currentAgent}-iris-left`);
  const irisRight = document.getElementById(`${currentAgent}-iris-right`);
  const eyelineLeft = document.getElementById(`${currentAgent}-eyeline-left`);
  const eyelineRight = document.getElementById(`${currentAgent}-eyeline-right`);

  // set exp.responseLog to center
  setCircleCenter(pupilLeft, exp.elemSpecs.eyes[currentAgent].left.center);
  setCircleCenter(pupilRight, exp.elemSpecs.eyes[currentAgent].right.center);
  setCircleCenter(irisLeft, exp.elemSpecs.eyes[currentAgent].left.center);
  setCircleCenter(irisRight, exp.elemSpecs.eyes[currentAgent].right.center);

  // set target to center
  setTargetCenter(exp.targets[trialCount], `${exp.elemSpecs.targets.viewBoxCenter}`);

  // depending on trial type, show or hide hedge
  const hedge = document.getElementById('hedge');
  if (exp.trialType[trialCount] === 'fam') {
    hedge.setAttribute('visibility', 'hidden');
  } else if (exp.trialType[trialCount] === 'test') {
    hedge.setAttribute('visibility', 'visible');
  }

  // calculate where exp.responseLog should move in the trial
  // for test trials: first let exp.responseLog follow ballooon to middle, until balloon is hidden
  const gazeCoordsBeginningLeft = getGazeCoords(
    exp.targets[trialCount], exp.elemSpecs.targets.viewBoxHidden,
    pupilLeft, eyelineLeft,
  );
  const gazeCoordsBeginningRight = getGazeCoords(
    exp.targets[trialCount], exp.elemSpecs.targets.viewBoxHidden,
    pupilRight, eyelineRight,
  );

  const gazeCoordsLeft = getGazeCoords(
    exp.targets[trialCount], exp.positions[trialCount].viewBoxRandom,
    pupilLeft, eyelineLeft,
  );

  const gazeCoordsRight = getGazeCoords(
    exp.targets[trialCount], exp.positions[trialCount].viewBoxRandom,
    pupilRight, eyelineRight,
  );

  // save calculated values in our exp object
  exp.elemSpecs.eyes[currentAgent].left.beginning = gazeCoordsBeginningLeft;
  exp.elemSpecs.eyes[currentAgent].left.random = gazeCoordsLeft;
  exp.elemSpecs.eyes[currentAgent].right.beginning = gazeCoordsBeginningRight;
  exp.elemSpecs.eyes[currentAgent].right.random = gazeCoordsRight;

  // calculate distance between middle and target position, for constant speed
  const distanceCenterRandom = distanceViewBoxes(
    exp.elemSpecs.targets.viewBoxCenter, exp.positions[trialCount].viewBoxRandom,
  );
  const distanceCenterHidden = distanceViewBoxes(
    exp.elemSpecs.targets.viewBoxCenter, exp.elemSpecs.targets.viewBoxHidden,
  );
  const distanceHiddenRandom = distanceViewBoxes(
    exp.elemSpecs.targets.viewBoxHidden, exp.positions[trialCount].viewBoxRandom,
  );
  const perSecond = 300;

  exp.responseLog[trialCount] = {};
  // save animation speed in our exp object
  if (exp.trialType[trialCount] === 'fam') {
    exp.responseLog[trialCount].durationAnimationTotal = distanceCenterRandom / perSecond;
  } else if (exp.trialType[trialCount] === 'test') {
    exp.responseLog[trialCount].durationAnimationCenterHidden = distanceCenterHidden / perSecond;
    exp.responseLog[trialCount].durationAnimationHiddenRandom = distanceHiddenRandom / perSecond;
    exp.responseLog[trialCount].durationAnimationTotal = (distanceCenterHidden / perSecond) + (distanceHiddenRandom / perSecond);
  }
};

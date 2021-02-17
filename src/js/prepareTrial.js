import setCircleCenter from './setCircleCenter';
import setTargetCenter from './setTargetCenter';
import showElement from './showElement';

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

  // get the center/ middle position of eye of currentAgent
  const eyeLeftCenter = { x: exp.elemSpecs.eyes[currentAgent].leftCX, y: exp.elemSpecs.eyes[currentAgent].leftCY };
  const eyeRightCenter = { x: exp.elemSpecs.eyes[currentAgent].rightCX, y: exp.elemSpecs.eyes[currentAgent].rightCY };

  // set eyes to center
  setCircleCenter(pupilLeft, eyeLeftCenter);
  setCircleCenter(pupilRight, eyeRightCenter);
  setCircleCenter(irisLeft, eyeLeftCenter);
  setCircleCenter(irisRight, eyeRightCenter);

  // set target to center
  setTargetCenter(exp.targets[trialCount], `${exp.elemSpecs.targets.viewBoxCenter}`);

  // depending on trial type, show or hide hedge
  const hedge = document.getElementById('hedge');
  if (exp.trialType[trialCount] === 'fam') {
    hedge.setAttribute('visibility', 'hidden');
  } else if (exp.trialType[trialCount] === 'test') {
    hedge.setAttribute('visibility', 'visible');
  }
};

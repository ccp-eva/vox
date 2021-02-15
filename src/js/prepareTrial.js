import setCircleCenter from './setCircleCenter';
import setTargetCenter from './setTargetCenter';
import showElement from './showElement';

export default (agents, targets, trialCount, trialType) => {
  const outerSVG = document.getElementById('outer-svg');
  const outerSVGDoc = outerSVG.contentDocument;
  outerSVGDoc.getElementById('experiment-button').setAttribute('visibility', 'visible');
  outerSVGDoc.getElementById('cover-blurr').setAttribute('visibility', 'visible');

  // show agent and target of the current trial only, hide the other ones
  showElement(agents, trialCount);
  showElement(targets, trialCount);

  const currentAgent = `${agents[trialCount].getAttribute('id')}`;
  const pupilLeft = outerSVGDoc.getElementById(`${currentAgent}-pupil-left`);
  const pupilRight = outerSVGDoc.getElementById(`${currentAgent}-pupil-right`);
  const irisLeft = outerSVGDoc.getElementById(`${currentAgent}-iris-left`);
  const irisRight = outerSVGDoc.getElementById(`${currentAgent}-iris-right`);

  // get the center/ middle position of eye of currentAgent
  const eyeLeftCenter = { x: pupilLeft.getAttribute('cxOrig'), y: pupilLeft.getAttribute('cyOrig') };
  const eyeRightCenter = { x: pupilRight.getAttribute('cxOrig'), y: pupilRight.getAttribute('cyOrig') };

  // set eyes to center
  setCircleCenter(pupilLeft, eyeLeftCenter);
  setCircleCenter(pupilRight, eyeRightCenter);
  setCircleCenter(irisLeft, eyeLeftCenter);
  setCircleCenter(irisRight, eyeRightCenter);

  // set target to center
  setTargetCenter(targets[trialCount], `${targets[trialCount].getAttribute('viewBoxCenter')}`);

  // depending on trial type, show or hide hedge
  const hedge = outerSVGDoc.getElementById('hedge');
  if (trialType[trialCount] === 'fam') {
    hedge.setAttribute('visibility', 'hidden');
  } else if (trialType[trialCount] === 'test') {
    hedge.setAttribute('visibility', 'visible');
  }
};

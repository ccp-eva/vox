import { gsap } from 'gsap';
import showElement from './showElement';
import getGazeCoords from './getGazeCoords';
import distancePoints from './distancePoints';
import showSlide from './showSlide';

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION THAT PREPARES EACH TRIAL
// i.e., calculate all relevant variables, show/hide elements
// ---------------------------------------------------------------------------------------------------------------------
export default (exp) => {
  // show blurred canvas and button
  showSlide([document.getElementById('experiment-button'), document.getElementById('cover-blurr')], []);

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

  let boxesCurrentFront = null;
  let boxesCurrentBack = null;
  if (exp.trials.boxesNr[exp.trials.count] > 0) {
    boxesCurrentFront = document.querySelector(`[id$= "boxes${exp.trials.boxesNr[exp.trials.count]}-front"]`);
    boxesCurrentBack = document.querySelector(`[id$= "boxes${exp.trials.boxesNr[exp.trials.count]}-back"]`);
  }

  // set eyes to center
  // original value stored in e.g. pupilLeft.getBBox().x
  // but we just need to remove the transform attribute
  gsap.set([pupilLeft, pupilRight, irisLeft, irisRight, hedge, exp.targets[exp.trials.count]], {
    x: 0,
    y: 0,
  });

  // depending on trial type, show or hide hedge and boxes
  switch (true) {
    case exp.trials.type[exp.trials.count] === 'train':
      showSlide([], [hedge]);
      break;
    // for tablet hedge version
    case exp.trials.boxesNr[exp.trials.count] === 0:
      showSlide([hedge], []);
      break;
    // for PC box version
    case exp.trials.boxesNr[exp.trials.count] > 0 && exp.trials.type[exp.trials.count] === 'fam':
      showSlide([boxesCurrentFront, boxesCurrentBack], [hedge]);
      break;
    case exp.trials.boxesNr[exp.trials.count] > 0 && exp.trials.type[exp.trials.count] === 'test':
      showSlide([hedge, boxesCurrentFront, boxesCurrentBack], []);
      break;
    default:
      console.error('Error in showing hedges/boxes');
  }

  // calculate how far the balloon will fly
  // for tablet trials where balloon directly goes to final position
  exp.elemSpecs.targets.centerFinal = {
    x: exp.positions[exp.trials.count].x - exp.elemSpecs.targets.center.x,
    y: exp.positions[exp.trials.count].y - exp.elemSpecs.targets.center.y,
  };

  // for PC fam trials where balloon first lands above boxes
  exp.elemSpecs.targets.centerBox = {
    x: exp.positions[exp.trials.count].x - exp.elemSpecs.targets.center.x,
    y: exp.elemSpecs.targets.aboveBoxesY - exp.elemSpecs.targets.center.y,
  };

  // calculate where eyes should move in the trial
  const gazeCoordsLeft = getGazeCoords(
    exp.targets[exp.trials.count], exp.positions[exp.trials.count],
    pupilLeft, eyelineLeft,
  );
  exp.elemSpecs.eyes[currentAgent].left.final = gazeCoordsLeft;

  exp.elemSpecs.eyes[currentAgent].left.centerFinal = {
    x: gazeCoordsLeft.x - exp.elemSpecs.eyes[currentAgent].left.center.x,
    y: gazeCoordsLeft.y - exp.elemSpecs.eyes[currentAgent].left.center.y,
  };

  const gazeCoordsRight = getGazeCoords(
    exp.targets[exp.trials.count], exp.positions[exp.trials.count],
    pupilRight, eyelineRight,
  );
  exp.elemSpecs.eyes[currentAgent].right.final = gazeCoordsRight;

  exp.elemSpecs.eyes[currentAgent].right.centerFinal = {
    x: gazeCoordsRight.x - exp.elemSpecs.eyes[currentAgent].right.center.x,
    y: gazeCoordsRight.y - exp.elemSpecs.eyes[currentAgent].right.center.y,
  };

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
    { x: exp.positions[exp.trials.count].x, y: exp.positions[exp.trials.count].y },
  );

  const perSecond = 700;

  exp.responseLog[exp.trials.count] = {};
  exp.responseLog[exp.trials.count].wrongAreaClick = 0;
  // for early click, start with -1, because "los geht's" click gets added
  exp.responseLog[exp.trials.count].earlyClick = -1;

  // save animation speed in our exp object
  if (exp.trials.boxesNr[exp.trials.count] === 0) {
    exp.responseLog[exp.trials.count].durationAnimationBalloonTotal = distanceCenterFinal / perSecond;
  } else if (exp.trials.boxesNr[exp.trials.count] > 0) {
    exp.responseLog[exp.trials.count].durationAnimationBalloonCenterBox = distanceCenterBox / perSecond;
    exp.responseLog[exp.trials.count].durationAnimationBalloonBoxFinal = distanceBoxFinal / perSecond;
    exp.responseLog[exp.trials.count].durationAnimationBalloonTotal = (distanceCenterBox / perSecond) + (distanceBoxFinal / perSecond);
  }
};

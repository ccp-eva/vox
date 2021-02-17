import { gsap } from 'gsap';
import setCircleCenter from './setCircleCenter';
import setTargetCenter from './setTargetCenter';
import getGazeCoords from './getGazeCoords';
import distanceViewBoxes from './distanceViewBoxes';

export default (exp, trialCount) => new Promise((resolve) => {
  document.getElementById('experiment-button').setAttribute('visibility', 'hidden');
  document.getElementById('cover-blurr').setAttribute('visibility', 'hidden');
  const hedge = document.getElementById('hedge');

  const currentAgent = `${exp.agents[trialCount].getAttribute('id')}`;
  // get IDs of eye
  const pupilLeft = document.getElementById(`${currentAgent}-pupil-left`);
  const pupilRight = document.getElementById(`${currentAgent}-pupil-right`);
  const irisLeft = document.getElementById(`${currentAgent}-iris-left`);
  const irisRight = document.getElementById(`${currentAgent}-iris-right`);
  const eyelineLeft = document.getElementById(`${currentAgent}-eyeline-left`);
  const eyelineRight = document.getElementById(`${currentAgent}-eyeline-right`);

  // first let eyes follow ballooon to middle, until balloon is hidden
  const gazeCoordsBeginningLeft = getGazeCoords(
    exp.targets[trialCount], exp.elemSpecs.targets.viewBoxHidden,
    pupilLeft, eyelineLeft,
  );
  const gazeCoordsBeginningRight = getGazeCoords(
    exp.targets[trialCount], exp.elemSpecs.targets.viewBoxHidden,
    pupilRight, eyelineRight,
  );

  // define where the target will move
  // WE NEED MINUS! SINCE WE MOVE THE COORDINATE SYSTEM TO THE LEFT / UP in order to let the balloon move right / down
  // calculate new position of eyes with the values where target WILL move to (is not yet there!)
  const gazeCoordsLeft = getGazeCoords(
    exp.targets[trialCount], exp.positions[trialCount].viewBoxRandom,
    pupilLeft, eyelineLeft,
  );

  const gazeCoordsRight = getGazeCoords(
    exp.targets[trialCount], exp.positions[trialCount].viewBoxRandom,
    pupilRight, eyelineRight,
  );

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

  let durationAnimation = 0;
  if (exp.trialType[trialCount] === 'fam') {
    durationAnimation = distanceCenterRandom / perSecond;
  } else if (exp.trialType[trialCount] === 'test') {
    durationAnimation = (distanceCenterHidden / perSecond) + (distanceHiddenRandom / perSecond);
  }

  const timelineFam = gsap.timeline();
  const timelineTest = gsap.timeline();

  const showBoxes = () => {
    hedge.setAttribute('visibility', 'hidden');
  };

  // animate target
  // for fam trials, just show full path. everything at the same time
  if (exp.trialType[trialCount] === 'fam') {
    timelineFam
      .to(exp.targets[trialCount], {
        delay: 1,
        duration: `${distanceCenterRandom / perSecond}`,
        ease: 'none',
        attr: { viewBox: `${exp.positions[trialCount].viewBoxRandom}` },
        onComplete() {
          setTargetCenter(exp.targets[trialCount], exp.positions[trialCount].viewBoxRandom);
        },
      })
    // animate left eye
      .to([pupilLeft, irisLeft],
        {
          duration: `${distanceCenterRandom / perSecond}`,
          ease: 'none',
          attr: {
            cx: `${gazeCoordsLeft.x}`,
            cy: `${gazeCoordsLeft.y}`,
          },
          onComplete() {
            setCircleCenter(pupilLeft, gazeCoordsLeft);
            setCircleCenter(irisLeft, gazeCoordsLeft);
          },
        }, '<')
    // animate right eye
      .to([pupilRight, irisRight],
        {
          duration: `${distanceCenterRandom / perSecond}`,
          ease: 'none',
          attr: {
            cx: `${gazeCoordsRight.x}`,
            cy: `${gazeCoordsRight.y}`,
          },
          onComplete() {
            setCircleCenter(pupilRight, gazeCoordsRight);
            setCircleCenter(irisRight, gazeCoordsRight);
            console.log('animation famtrial complete');
            resolve({
              pupilLeft, pupilRight, durationAnimation,
            });
          },
        }, '<');

    // for test trials, first hide balloon, then move to final position
  } else {
    timelineTest
    // first: hide balloon
      .to(exp.targets[trialCount], {
        delay: 1,
        duration: `${distanceCenterHidden / perSecond}`,
        ease: 'none',
        attr: { viewBox: `${exp.elemSpecs.targets.viewBoxHidden}` },
      })
    // let eyes follow balloon already
      .to([pupilLeft, irisLeft],
        {
          duration: `${distanceCenterHidden / perSecond}`,
          ease: 'none',
          attr: {
            cx: `${gazeCoordsBeginningLeft.x}`,
            cy: `${gazeCoordsBeginningLeft.y}`,
          },
        }, '<')
      .to([pupilRight, irisRight],
        {
          duration: `${distanceCenterHidden / perSecond}`,
          ease: 'none',
          attr: {
            cx: `${gazeCoordsBeginningRight.x}`,
            cy: `${gazeCoordsBeginningRight.y}`,
          },
        }, '<');
    // then move balloon to final position
    timelineTest.to(exp.targets[trialCount], {
      duration: `${distanceHiddenRandom / perSecond}`,
      ease: 'none',
      attr: { viewBox: `${exp.positions[trialCount].viewBoxRandom}` },
      onComplete() {
        setTargetCenter(exp.targets[trialCount], exp.positions[trialCount].viewBoxRandom);
      },
    })
    // eye movement from hidden to target
      .to([pupilLeft, irisLeft],
        {
          duration: `${distanceHiddenRandom / perSecond}`,
          ease: 'none',
          attr: {
            cx: `${gazeCoordsLeft.x}`,
            cy: `${gazeCoordsLeft.y}`,
          },
          onComplete() {
            setCircleCenter(pupilLeft, gazeCoordsLeft);
            setCircleCenter(irisLeft, gazeCoordsLeft);
          },
        }, '<')
      .to([pupilRight, irisRight],
        {
          duration: `${distanceHiddenRandom / perSecond}`,
          ease: 'none',
          attr: {
            cx: `${gazeCoordsRight.x}`,
            cy: `${gazeCoordsRight.y}`,
          },
          onComplete() {
            setCircleCenter(pupilRight, gazeCoordsRight);
            setCircleCenter(irisRight, gazeCoordsRight);

            // for PC version, hide hedge and show boxes
            if (!exp.subjData.touchScreen) {
              timelineTest.add(showBoxes, '+=0.2'); // after gap
            }
          },
        }, '<')
      .then(() => {
        console.log('animation testtrial complete');
        resolve({
          pupilLeft, pupilRight, durationAnimation,
        });
      });
  }
});

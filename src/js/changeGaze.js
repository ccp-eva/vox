import { gsap } from 'gsap';
import setCircleCenter from './setCircleCenter';
import setTargetCenter from './setTargetCenter';
import getGazeCoords from './getGazeCoords';
import randomNumber from './randomNumber';
import distanceViewBoxes from './distanceViewBoxes';
import checkForTouchscreen from './checkForTouchscreen';

export default (agents, targets, sectionArray, trialCount, trialType) => new Promise((resolve) => {
  document.getElementById('experiment-button').setAttribute('visibility', 'hidden');
  document.getElementById('cover-blurr').setAttribute('visibility', 'hidden');

  const currentAgent = `${agents[trialCount].getAttribute('id')}`;
  const hedge = document.getElementById('hedge');
  // get IDs of eye
  const pupilLeft = document.getElementById(`${currentAgent}-pupil-left`);
  const pupilRight = document.getElementById(`${currentAgent}-pupil-right`);
  const irisLeft = document.getElementById(`${currentAgent}-iris-left`);
  const irisRight = document.getElementById(`${currentAgent}-iris-right`);
  const eyelineLeft = document.getElementById(`${currentAgent}-eyeline-left`);
  const eyelineRight = document.getElementById(`${currentAgent}-eyeline-right`);

  const targetViewBoxCenter = targets[trialCount].getAttribute('viewBoxCenter');
  const targetViewBoxHidden = targets[trialCount].getAttribute('viewBoxHidden');
  let targetViewBoxRandom = targets[trialCount].getAttribute('viewBoxRandom');
  const randomX = randomNumber(sectionArray[trialCount].min, sectionArray[trialCount].max);
  targetViewBoxRandom = targetViewBoxRandom.replace('x', randomX);

  // first let eyes follow ballooon to middle, until balloon is hidden
  const gazeCoordsBeginningLeft = getGazeCoords(targets[trialCount], targetViewBoxHidden, pupilLeft, eyelineLeft);
  const gazeCoordsBeginningRight = getGazeCoords(targets[trialCount], targetViewBoxHidden, pupilRight, eyelineRight);

  // define where the target will move
  // WE NEED MINUS! SINCE WE MOVE THE COORDINATE SYSTEM TO THE LEFT / UP in order to let the balloon move right / down
  // eslint-disable-next-line max-len
  // calculate new position of eyes with the values where target WILL move to (is not yet there!)
  const gazeCoordsLeft = getGazeCoords(targets[trialCount], targetViewBoxRandom, pupilLeft, eyelineLeft);
  const gazeCoordsRight = getGazeCoords(targets[trialCount], targetViewBoxRandom, pupilRight, eyelineRight);

  // calculate distance between middle and target position, for constant speed
  const distanceCenterRandom = distanceViewBoxes(targetViewBoxCenter, targetViewBoxRandom);
  const distanceCenterHidden = distanceViewBoxes(targetViewBoxCenter, targetViewBoxHidden);
  const distanceHiddenRandom = distanceViewBoxes(targetViewBoxHidden, targetViewBoxRandom);
  const perSecond = 300;
  const timelineFam = gsap.timeline();
  const timelineTest = gsap.timeline();

  // animate target
  // for fam trials, just show full path. everything at the same time
  if (trialType[trialCount] === 'fam') {
    timelineFam
      .to(targets[trialCount], {
        delay: 1,
        duration: `${distanceCenterRandom / perSecond}`,
        ease: 'none',
        attr: { viewBox: `${targetViewBoxRandom}` },
        onComplete() {
          setTargetCenter(targets[trialCount], targetViewBoxRandom);
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
            const durationAnimation = distanceCenterRandom / perSecond;
            console.log('animation famtrial complete');
            resolve({ pupilLeft, pupilRight, durationAnimation });
          },
        }, '<');

    // for test trials, first hide balloon, then move to final position
  } else {
    // hedge.setAttribute('visibility', 'hidden');
    timelineTest
    // first: hide balloon
      .to(targets[trialCount], {
        delay: 1,
        duration: `${distanceCenterHidden / perSecond}`,
        ease: 'none',
        attr: { viewBox: `${targetViewBoxHidden}` },
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
    timelineTest.to(targets[trialCount], {
      duration: `${distanceHiddenRandom / perSecond}`,
      ease: 'none',
      attr: { viewBox: `${targetViewBoxRandom}` },
      onComplete() {
        setTargetCenter(targets[trialCount], targetViewBoxRandom);
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
            const durationAnimation = (distanceCenterHidden / perSecond) + (distanceHiddenRandom / perSecond);
            console.log('animation testtrial complete');
            const touchScreen = checkForTouchscreen();

            // FOR NOW; PRETEND TO ALWAYS BE ON TOUCHSCREEN
            // eslint-disable-next-line no-constant-condition
            // TODO little delay
            // TODO log in click function whether right bin was clicked
            if (!touchScreen) {
              hedge.setAttribute('visibility', 'hidden');
              targets[trialCount].setAttribute('visibility', 'hidden');
            }

            resolve({ pupilLeft, pupilRight, durationAnimation });
          },
        }, '<');
  }
});

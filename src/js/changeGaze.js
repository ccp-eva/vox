import { gsap } from 'gsap';
import setCircleAttr from './setCircleAttr';
import setViewBoxAttr from './setViewBoxAttr';

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR ANIMATING BALLOON, EYES, HEDGE
// ---------------------------------------------------------------------------------------------------------------------
export default (exp) => {
  // get relevant elements
  const pupilLeft = document.getElementById('monkey-pupil-left');
  const pupilRight = document.getElementById('monkey-pupil-right');
  const irisLeft = document.getElementById('monkey-iris-left');
  const irisRight = document.getElementById('monkey-iris-right');

  const timeline = gsap.timeline({ paused: true });

  // first: hide balloon
  timeline.to(exp.balloons[exp.trials.count], {
    duration: 1,
    ease: 'none',
    attr: { viewBox: exp.elemSpecs.balloons.viewBoxHidden },
  });

  // let eyes follow balloon already
  timeline.to([pupilLeft, irisLeft], {
    duration: 1,
    ease: 'none',
    attr: {
      cx: exp.elemSpecs.eyes.left.beginning.x,
      cy: exp.elemSpecs.eyes.left.beginning.y,
    },
  }, '<');

  // same for right eye
  timeline.to([pupilRight, irisRight], {
    duration: 1,
    ease: 'none',
    attr: {
      cx: exp.elemSpecs.eyes.right.beginning.x,
      cy: exp.elemSpecs.eyes.right.beginning.y,
    },
  }, '<');

  // then move balloon to final position
  timeline.to(exp.balloons[exp.trials.count], {
    duration: 1,
    ease: 'none',
    attr: { viewBox: exp.positions[exp.trials.count].viewBoxRandom },
  });

  // eye movement from hidden to target
  timeline.to([pupilLeft, irisLeft], {
    duration: 1,
    ease: 'none',
    attr: {
      cx: exp.elemSpecs.eyes.left.random.x,
      cy: exp.elemSpecs.eyes.left.random.y,
    },
  }, '<');

  timeline.to([pupilRight, irisRight], {
    duration: 1,
    ease: 'none',
    attr: {
      cx: exp.elemSpecs.eyes.right.random.x,
      cy: exp.elemSpecs.eyes.right.random.y,
    },
    onInterrupt() {
      console.log('got interrupted while animating!');
    },
    onComplete() {
      //----------------------------
      // WITHOUT ANY SETTING: MOVE BACK TO CENTER/ ORIGINAL POSITION
      //----------------------------

      //----------------------------
      // WITH GSAP.SET():
      // ERROR: THERE IS NO GSAP SETTER METHOD FOR THE VIEWBOX ATTRIBUTE
      //----------------------------
      // gsap.set(exp.balloons[exp.trials.count], { viewBox: exp.positions[exp.trials.count].viewBoxRandom })
      //----------------------------

      //----------------------------
      // WITH RAF ONCE; DOESN'T WORK
      //----------------------------
      // const setToAnimatedVal = () => {
      //   exp.balloons[exp.trials.count].setAttribute('viewBox', exp.positions[exp.trials.count].viewBoxRandom);
      //   pupilLeft.setAttribute('cx', exp.elemSpecs.eyes.left.random.x);
      //   pupilLeft.setAttribute('cy', exp.elemSpecs.eyes.left.random.y);
      //   irisLeft.setAttribute('cx', exp.elemSpecs.eyes.left.random.x);
      //   irisLeft.setAttribute('cy', exp.elemSpecs.eyes.left.random.y);
      //   pupilRight.setAttribute('cx', exp.elemSpecs.eyes.right.random.x);
      //   pupilRight.setAttribute('cy', exp.elemSpecs.eyes.right.random.y);
      //   irisRight.setAttribute('cx', exp.elemSpecs.eyes.right.random.x);
      //   irisRight.setAttribute('cy', exp.elemSpecs.eyes.right.random.y);
      // }
      // requestAnimationFrame(setToAnimatedVal);
      //----------------------------

      //----------------------------
      // WITHOUT RAF; DOESN'T WORK
      //----------------------------
      // exp.balloons[exp.trials.count].setAttribute('viewBox', exp.positions[exp.trials.count].viewBoxRandom);
      // pupilLeft.setAttribute('cx', exp.elemSpecs.eyes.left.random.x);
      // pupilLeft.setAttribute('cy', exp.elemSpecs.eyes.left.random.y);
      // irisLeft.setAttribute('cx', exp.elemSpecs.eyes.left.random.x);
      // irisLeft.setAttribute('cy', exp.elemSpecs.eyes.left.random.y);
      // pupilRight.setAttribute('cx', exp.elemSpecs.eyes.right.random.x);
      // pupilRight.setAttribute('cy', exp.elemSpecs.eyes.right.random.y);
      // irisRight.setAttribute('cx', exp.elemSpecs.eyes.right.random.x);
      // irisRight.setAttribute('cy', exp.elemSpecs.eyes.right.random.y);

      //----------------------------
      // WORKING SOLUTION
      //----------------------------
      // set viewBox to where it has been animated to
      setViewBoxAttr(exp.balloons[exp.trials.count], exp.positions[exp.trials.count].viewBoxRandom);

      // set left eyes to where they have been animated to
      setCircleAttr(pupilLeft, exp.elemSpecs.eyes.left.random);
      setCircleAttr(irisLeft, exp.elemSpecs.eyes.left.random);

      // same for right eye
      setCircleAttr(pupilRight, exp.elemSpecs.eyes.right.random);
      setCircleAttr(irisRight, exp.elemSpecs.eyes.right.random);
      //----------------------------
    },
  }, '<');

  // return timeline
  timeline.play();
  return (timeline);
};

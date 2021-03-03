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

  const mainTimeline = gsap.timeline({ paused: true });
  const timelineHide = gsap.timeline();
  const timelineFinal = gsap.timeline();

  // first: hide balloon
  timelineHide.fromTo(exp.balloons[exp.trials.count], {
    attr: { viewBox: `${exp.elemSpecs.balloons.viewBoxCenter}` },
  }, {
    duration: 1,
    ease: 'none',
    attr: { viewBox: `${exp.elemSpecs.balloons.viewBoxHidden}` },
    onInterrupt() {
      console.log('interrupted in balloon hide');
    },
  });

  // let eyes follow balloon already
  timelineHide.fromTo([pupilLeft, irisLeft], {
    attr: {
      cx: `${exp.elemSpecs.eyes.left.center.x}`,
      cy: `${exp.elemSpecs.eyes.left.center.y}`,
    },
  }, {
    duration: 1,
    ease: 'none',
    attr: {
      cx: `${exp.elemSpecs.eyes.left.beginning.x}`,
      cy: `${exp.elemSpecs.eyes.left.beginning.y}`,
    },
    onInterrupt() {
      console.log('interrupted in test eyes left hide');
    },
  }, '<');

  // same for right eye
  timelineHide.fromTo([pupilRight, irisRight], {
    attr: {
      cx: `${exp.elemSpecs.eyes.right.center.x}`,
      cy: `${exp.elemSpecs.eyes.right.center.y}`,
    },
  }, {
    duration: 1,
    ease: 'none',
    attr: {
      cx: `${exp.elemSpecs.eyes.right.beginning.x}`,
      cy: `${exp.elemSpecs.eyes.right.beginning.y}`,
    },
    onInterrupt() {
      console.log('interrupted in test eyes right hide');
    },
  }, '<');

  // then move balloon to final position
  timelineFinal.fromTo(exp.balloons[exp.trials.count], {
    attr: { viewBox: `${exp.elemSpecs.balloons.viewBoxHidden}` },
  }, {
    delay: 1,
    duration: 1,
    ease: 'none',
    attr: { viewBox: `${exp.positions[exp.trials.count].viewBoxRandom}` },
    onInterrupt() {
      console.log('interrupted in balloon hide');
    },
    onComplete() {
      setViewBoxAttr(exp.balloons[exp.trials.count], exp.positions[exp.trials.count].viewBoxRandom);
    },
  });

  // eye movement from hidden to target
  timelineFinal.fromTo([pupilLeft, irisLeft], {
    attr: {
      cx: `${exp.elemSpecs.eyes.left.beginning.x}`,
      cy: `${exp.elemSpecs.eyes.left.beginning.y}`,
    },
  }, {
    duration: 1,
    ease: 'none',
    attr: {
      cx: `${exp.elemSpecs.eyes.left.random.x}`,
      cy: `${exp.elemSpecs.eyes.left.random.y}`,
    },
    onInterrupt() {
      console.log('interrupted in test eyes left final');
    },
    onComplete() {
      setCircleAttr(pupilLeft, exp.elemSpecs.eyes.left.random);
      setCircleAttr(irisLeft, exp.elemSpecs.eyes.left.random);
    },
  }, '<');

  timelineFinal.fromTo([pupilRight, irisRight], {
    attr: {
      cx: `${exp.elemSpecs.eyes.right.beginning.x}`,
      cy: `${exp.elemSpecs.eyes.right.beginning.y}`,
    },
  }, {
    duration: 1,
    ease: 'none',
    attr: {
      cx: `${exp.elemSpecs.eyes.right.random.x}`,
      cy: `${exp.elemSpecs.eyes.right.random.y}`,
    },
    onInterrupt() {
      console.log('interrupted in test eyes right final');
    },
    onComplete() {
      setCircleAttr(pupilRight, exp.elemSpecs.eyes.right.random);
      setCircleAttr(irisRight, exp.elemSpecs.eyes.right.random);
    },
  }, '<');

  // add timelines together
  mainTimeline.add([timelineHide, timelineFinal]);
  mainTimeline.play();
  return (mainTimeline);
};

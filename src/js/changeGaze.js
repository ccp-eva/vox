import { gsap } from 'gsap';

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR ANIMATING BALLOON, EYES, HEDGE
// NOTE: we only return the gsap timeline object.
// that means that anything outside of that has no effect!!
// ---------------------------------------------------------------------------------------------------------------------
export default (exp) => {
  // get relevant elements
  const currentAgent = `${exp.agents[exp.trials.count].getAttribute('id')}`;
  const pupilLeft = document.getElementById(`${currentAgent}-pupil-left`);
  const pupilRight = document.getElementById(`${currentAgent}-pupil-right`);
  const irisLeft = document.getElementById(`${currentAgent}-iris-left`);
  const irisRight = document.getElementById(`${currentAgent}-iris-right`);
  const hedge = document.getElementById('hedge');

  // we use gsap3 for animation
  const timeline = gsap.timeline({ paused: true });

  // animate target
  // for fam trials
  if (exp.trials.type[exp.trials.count] === 'fam') {
    // for tablet hedge version: just show full path. everything at the same time
    if (exp.subjData.touchScreen) {
      timeline.to(exp.targets[exp.trials.count], {
        duration: exp.responseLog[exp.trials.count].durationAnimationTotal,
        ease: 'none',
        x: exp.elemSpecs.targets.centerFinal.x,
        y: exp.elemSpecs.targets.centerFinal.y,
      });

      // let eyes follow balloon already
      timeline.to([pupilLeft, irisLeft], {
        duration: exp.responseLog[exp.trials.count].durationAnimationTotal,
        ease: 'none',
        x: exp.elemSpecs.eyes[currentAgent].left.centerFinal.x,
        y: exp.elemSpecs.eyes[currentAgent].left.centerFinal.y,
      }, '<');

      // same for right eye
      timeline.to([pupilRight, irisRight], {
        duration: exp.responseLog[exp.trials.count].durationAnimationTotal,
        ease: 'none',
        x: exp.elemSpecs.eyes[currentAgent].right.centerFinal.x,
        y: exp.elemSpecs.eyes[currentAgent].right.centerFinal.y,
      }, '<');

    // fam for PC box version
    // let balloons fly above box, then into it
    } else if (!exp.subjData.touchScreen) {
      timeline.to(exp.targets[exp.trials.count], {
        duration: exp.responseLog[exp.trials.count].durationAnimationCenterBox,
        ease: 'none',
        x: exp.elemSpecs.targets.centerBox.x,
        y: exp.elemSpecs.targets.centerBox.y,
      });

      // let eyes follow balloon already
      timeline.to([pupilLeft, irisLeft], {
        duration: exp.responseLog[exp.trials.count].durationAnimationCenterBox,
        ease: 'none',
        x: exp.elemSpecs.eyes[currentAgent].left.centerBox.x,
        y: exp.elemSpecs.eyes[currentAgent].left.centerBox.y,
      }, '<');

      // same for right eye
      timeline.to([pupilRight, irisRight], {
        duration: exp.responseLog[exp.trials.count].durationAnimationCenterBox,
        ease: 'none',
        x: exp.elemSpecs.eyes[currentAgent].right.centerBox.x,
        y: exp.elemSpecs.eyes[currentAgent].right.centerBox.y,
      }, '<');

      // hide balloon a bit in the box (eye movement takes as long!)
      timeline.to(exp.targets[exp.trials.count], {
        duration: exp.responseLog[exp.trials.count].durationAnimationBoxFinal,
        ease: 'none',
        y: exp.elemSpecs.targets.BoxFinal.y,
      });

      // let eyes follow balloon to final position
      timeline.to([pupilLeft, irisLeft], {
        duration: exp.responseLog[exp.trials.count].durationAnimationBoxFinal,
        ease: 'none',
        x: exp.elemSpecs.eyes[currentAgent].left.centerFinal.x,
        y: exp.elemSpecs.eyes[currentAgent].left.centerFinal.y,
      }, '<');

      // same for right eye
      timeline.to([pupilRight, irisRight], {
        duration: exp.responseLog[exp.trials.count].durationAnimationBoxFinal,
        ease: 'none',
        x: exp.elemSpecs.eyes[currentAgent].right.centerFinal.x,
        y: exp.elemSpecs.eyes[currentAgent].right.centerFinal.y,
      }, '<');
    }

  // for test trials, first hide balloon, then move to final position
  } else if (exp.trials.type[exp.trials.count] === 'test') {
    // first: hide balloon
    timeline.to(exp.targets[exp.trials.count], {
      duration: exp.responseLog[exp.trials.count].durationAnimationCenterHalfway,
      ease: 'none',
      x: exp.elemSpecs.targets.centerHalfway.x,
      y: exp.elemSpecs.targets.centerHalfway.y,
    });

    // let eyes follow balloon already
    timeline.to([pupilLeft, irisLeft], {
      duration: exp.responseLog[exp.trials.count].durationAnimationCenterHalfway,
      ease: 'none',
      x: exp.elemSpecs.eyes[currentAgent].left.centerHalfway.x,
      y: exp.elemSpecs.eyes[currentAgent].left.centerHalfway.y,
    }, '<');

    // same for right eye
    timeline.to([pupilRight, irisRight], {
      duration: exp.responseLog[exp.trials.count].durationAnimationCenterHalfway,
      ease: 'none',
      x: exp.elemSpecs.eyes[currentAgent].right.centerHalfway.x,
      y: exp.elemSpecs.eyes[currentAgent].right.centerHalfway.y,
    }, '<');

    // then move balloon to final position
    timeline.to(exp.targets[exp.trials.count], {
      duration: exp.responseLog[exp.trials.count].durationAnimationHalfwayFinal,
      ease: 'none',
      x: exp.elemSpecs.targets.centerFinal.x,
      y: exp.elemSpecs.targets.centerFinal.y,
    });

    // and put eyes on final position
    timeline.to([pupilLeft, irisLeft], {
      duration: exp.responseLog[exp.trials.count].durationAnimationHalfwayFinal,
      ease: 'none',
      x: exp.elemSpecs.eyes[currentAgent].left.centerFinal.x,
      y: exp.elemSpecs.eyes[currentAgent].left.centerFinal.y,
    }, '<');

    timeline.to([pupilRight, irisRight], {
      duration: exp.responseLog[exp.trials.count].durationAnimationHalfwayFinal,
      ease: 'none',
      x: exp.elemSpecs.eyes[currentAgent].right.centerFinal.x,
      y: exp.elemSpecs.eyes[currentAgent].right.centerFinal.y,
    }, '<');

    // until here, same for touchscreen and PC version.
    // now, for touchscreen version, move hedge a bit down
    if (exp.subjData.touchScreen === true) {
      timeline.to(hedge, {
        duration: 0.8,
        ease: 'none',
        // -75 because balloon doesn't land directly at border of screen
        y: hedge.getBBox().height - exp.targets[exp.trials.count].getBBox().height - 75,
      }, '+=0.1');
    // for PC version, let hedge move completely down to reveal boxes
    } else if (exp.subjData.touchScreen === false) {
      timeline.to(hedge, {
        duration: 1,
        ease: 'none',
        y: exp.elemSpecs.outerSVG.origViewBoxHeight,
      }, '+=0.1');
    }
  }

  timeline.play();
  return (timeline);
};

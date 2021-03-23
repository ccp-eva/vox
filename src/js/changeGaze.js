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

  // -------------------------------------------------------------------------------------------------------------------
  // TABLET VERSION WITH HEDGE
  // -------------------------------------------------------------------------------------------------------------------
  if (exp.subjData.touchScreen) {
    // for test trials, let hedge move up to cover balloon falling down
    if (exp.trials.type[exp.trials.count] === 'test') {
      const hedgeTestUp = gsap.fromTo(hedge,
        { y: hedge.getBBox().height }, {
          y: 0,
          delay: 1,
          duration: 2,
          ease: 'none',
        });
      timeline.add(hedgeTestUp);
    }

    // for fam + test trial: let balloon fall down
    timeline.to(exp.targets[exp.trials.count], {
      delay: 1,
      duration: exp.responseLog[exp.trials.count].durationAnimationBalloonTotal,
      ease: 'none',
      x: exp.elemSpecs.targets.centerFinal.x,
      y: exp.elemSpecs.targets.centerFinal.y,
    });

    // let eyes follow balloon
    timeline.to([pupilLeft, irisLeft], {
      duration: exp.responseLog[exp.trials.count].durationAnimationBalloonTotal,
      ease: 'none',
      x: exp.elemSpecs.eyes[currentAgent].left.centerFinal.x,
      y: exp.elemSpecs.eyes[currentAgent].left.centerFinal.y,
    }, '<');

    // same for right eye
    timeline.to([pupilRight, irisRight], {
      duration: exp.responseLog[exp.trials.count].durationAnimationBalloonTotal,
      ease: 'none',
      x: exp.elemSpecs.eyes[currentAgent].right.centerFinal.x,
      y: exp.elemSpecs.eyes[currentAgent].right.centerFinal.y,
    }, '<');

    // for fam trials, move hedge up in the end
    if (exp.trials.type[exp.trials.count] === 'fam') {
      const hedgeFamTween = gsap.fromTo(hedge,
        { y: hedge.getBBox().height }, {
          // -75 because balloon doesn't land directly at border of screen
          y: hedge.getBBox().height - exp.targets[exp.trials.count].getBBox().height - 75,
          delay: 0.5,
          duration: 1,
          ease: 'none',
        });
      timeline.add(hedgeFamTween);
    }
    if (exp.trials.type[exp.trials.count] === 'test') {
      const hedgeTestDown = gsap.to(hedge, {
        y: hedge.getBBox().height - exp.targets[exp.trials.count].getBBox().height - 75,
        delay: 0.5,
        duration: 1.5,
        ease: 'none',
      }, '>');
      timeline.add(hedgeTestDown);
    }

  // -------------------------------------------------------------------------------------------------------------------
  // PC VERSION WITH BOXES
  // -------------------------------------------------------------------------------------------------------------------
  } else if (!exp.subjData.touchScreen) {
    // for test trials, let hedge move up to cover balloon falling down
    if (exp.trials.type[exp.trials.count] === 'test') {
      const hedgeTestUp = gsap.fromTo(hedge,
        { y: hedge.getBBox().height }, {
          y: 0,
          delay: 1,
          duration: 2,
          ease: 'none',
        });
      timeline.add(hedgeTestUp);
    }

    // balloon flies above box
    timeline.to(exp.targets[exp.trials.count], {
      delay: 1,
      duration: exp.responseLog[exp.trials.count].durationAnimationBalloonCenterBox,
      ease: 'none',
      x: exp.elemSpecs.targets.centerBox.x,
      y: exp.elemSpecs.targets.centerBox.y,
    });

    // let eyes follow balloon to final position
    timeline.to([pupilLeft, irisLeft], {
      duration: exp.responseLog[exp.trials.count].durationAnimationBalloonTotal,
      ease: 'none',
      x: exp.elemSpecs.eyes[currentAgent].left.centerFinal.x,
      y: exp.elemSpecs.eyes[currentAgent].left.centerFinal.y,
    }, '<');

    // same for right eye
    timeline.to([pupilRight, irisRight], {
      duration: exp.responseLog[exp.trials.count].durationAnimationBalloonTotal,
      ease: 'none',
      x: exp.elemSpecs.eyes[currentAgent].right.centerFinal.x,
      y: exp.elemSpecs.eyes[currentAgent].right.centerFinal.y,
    }, '<');

    // hide balloon in the box (eye movement takes as long!)
    timeline.to(exp.targets[exp.trials.count], {
      duration: exp.responseLog[exp.trials.count].durationAnimationBalloonBoxFinal,
      ease: 'none',
      y: exp.elemSpecs.targets.centerFinal.y,
    }, `-=${exp.responseLog[exp.trials.count].durationAnimationBalloonBoxFinal}`);

    if (exp.trials.type[exp.trials.count] === 'test') {
      const hedgeTestDown = gsap.to(hedge, {
        y: hedge.getBBox().height,
        delay: 0.5,
        duration: 2,
        ease: 'none',
      }, '>');
      timeline.add(hedgeTestDown);
    }
  }

  timeline.play();
  return (timeline);
};

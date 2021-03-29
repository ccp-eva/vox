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
  const audioTest = document.getElementById('audio-positive-feedback');

  // we use gsap3 for animation
  const timeline = gsap.timeline({ paused: true });
  const hedgeDuration = 0.2;
  const hedgeDelay = 1;
  const targetDelay = 1;

  // -------------------------------------------------------------------------------------------------------------------
  // define common movements/ animations
  // -------------------------------------------------------------------------------------------------------------------
  const hedgeUp = gsap.timeline({ paused: true });
  hedgeUp
    .fromTo(hedge,
      { y: hedge.getBBox().height }, {
        y: 0,
        delay: hedgeDelay,
        duration: hedgeDuration,
        ease: 'none',
      });

  const hedgeDown = gsap.timeline({ paused: true });
  hedgeDown
    .to(hedge, {
      y: hedge.getBBox().height,
      delay: hedgeDelay,
      duration: hedgeDuration,
      ease: 'none',
    }, '>');

  const hedgeHalfDown = gsap.timeline({ paused: true });
  hedgeHalfDown
    .to(hedge, {
      y: hedge.getBBox().height - exp.targets[exp.trials.count].getBBox().height - 75,
      delay: hedgeDelay,
      duration: hedgeDuration,
      ease: 'none',
    }, '>');

  const hedgeHalfUp = gsap.timeline({ paused: true });
  hedgeHalfUp
    .fromTo(hedge,
      { y: hedge.getBBox().height }, {
      // -75 because balloon doesn't land directly at border of screen
        y: hedge.getBBox().height - exp.targets[exp.trials.count].getBBox().height - 75,
        delay: hedgeDelay,
        duration: hedgeDuration / 3,
        ease: 'none',
      });

  const ballonToGround = gsap.timeline({ paused: true });
  ballonToGround
    .to(exp.targets[exp.trials.count], {
      delay: audioTest.duration,
      duration: audioTest.duration,
      ease: 'none',
      x: exp.elemSpecs.targets.centerFinal.x,
      y: exp.elemSpecs.targets.centerFinal.y,
    })
    .to([pupilLeft, irisLeft], {
      duration: audioTest.duration,
      ease: 'none',
      x: exp.elemSpecs.eyes[currentAgent].left.centerFinal.x,
      y: exp.elemSpecs.eyes[currentAgent].left.centerFinal.y,
    }, '<')
    .to([pupilRight, irisRight], {
      duration: audioTest.duration,
      ease: 'none',
      x: exp.elemSpecs.eyes[currentAgent].right.centerFinal.x,
      y: exp.elemSpecs.eyes[currentAgent].right.centerFinal.y,
    }, '<');

  const ballonIntoBox = gsap.timeline({ paused: true });
  ballonIntoBox
    .to(exp.targets[exp.trials.count], {
      delay: targetDelay,
      duration: exp.responseLog[exp.trials.count].durationAnimationBalloonCenterBox,
      ease: 'none',
      x: exp.elemSpecs.targets.centerBox.x,
      y: exp.elemSpecs.targets.centerBox.y,
    })
    .to([pupilLeft, irisLeft], {
      duration: exp.responseLog[exp.trials.count].durationAnimationBalloonTotal,
      ease: 'none',
      x: exp.elemSpecs.eyes[currentAgent].left.centerFinal.x,
      y: exp.elemSpecs.eyes[currentAgent].left.centerFinal.y,
    }, '<')
    .to([pupilRight, irisRight], {
      duration: exp.responseLog[exp.trials.count].durationAnimationBalloonTotal,
      ease: 'none',
      x: exp.elemSpecs.eyes[currentAgent].right.centerFinal.x,
      y: exp.elemSpecs.eyes[currentAgent].right.centerFinal.y,
    }, '<')
    .to(exp.targets[exp.trials.count], {
      duration: exp.responseLog[exp.trials.count].durationAnimationBalloonBoxFinal,
      ease: 'none',
      y: exp.elemSpecs.targets.centerFinal.y,
    }, `-=${exp.responseLog[exp.trials.count].durationAnimationBalloonBoxFinal}`);

  // -------------------------------------------------------------------------------------------------------------------
  // define animation depending on trial type
  // -------------------------------------------------------------------------------------------------------------------
  switch (true) {
    // for training trials
    case exp.trials.type[exp.trials.count] === 'train':
      ballonToGround.play();
      timeline.add(ballonToGround);
      break;

    // for tablet hedge version fam trials
    case exp.trials.boxesNr[exp.trials.count] === 0 && exp.trials.type[exp.trials.count] === 'fam':
      ballonToGround.play();
      hedgeHalfUp.play();
      timeline
        .add(ballonToGround)
        .add(hedgeHalfUp);
      break;

    // for tablet hedge version test trials
    case exp.trials.boxesNr[exp.trials.count] === 0 && exp.trials.type[exp.trials.count] === 'test':
      hedgeUp.play();
      ballonToGround.play();
      hedgeHalfDown.play();
      timeline
        .add(hedgeUp)
        .add(ballonToGround)
        .add(hedgeHalfDown);
      break;

    // for PC box version fam trials
    case exp.trials.boxesNr[exp.trials.count] > 0 && exp.trials.type[exp.trials.count] === 'fam':
      ballonIntoBox.play();
      timeline.add(ballonIntoBox);
      break;

    // for PC box version test trials
    case exp.trials.boxesNr[exp.trials.count] > 0 && exp.trials.type[exp.trials.count] === 'test':
      hedgeUp.play();
      ballonIntoBox.play();
      hedgeDown.play();
      timeline
        .add(hedgeUp)
        .add(ballonIntoBox)
        .add(hedgeDown);
      break;

    default:
      console.error('Error in defining animation');
  }

  timeline.play();
  return (timeline);
};

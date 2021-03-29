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
  // general delay at beginning, for 1 sec
  timeline.delay(0.5);
  const hedgeDuration = 0.2;

  // -------------------------------------------------------------------------------------------------------------------
  // define common movements/ animations
  // -------------------------------------------------------------------------------------------------------------------
  const attentionGetter = gsap.timeline({ paused: true });
  attentionGetter
    .to([exp.agents[exp.trials.count]], {
      scale: 1.05,
      opacity: 0,
      duration: 0.1,
      transformOrigin: '50% 50%',
    })
    . to([pupilLeft, pupilRight, irisLeft, irisRight], {
      scale: 1.1,
      opacity: 0,
      duration: 0.1,
      transformOrigin: '50% 50%',
    }, '<')
    .set([exp.agents[exp.trials.count], pupilLeft, pupilRight, irisLeft, irisRight], {
      scale: 1,
      opacity: 1,
    });

  const hedgeUp = gsap.timeline({ paused: true });
  hedgeUp
    .fromTo(hedge,
      { y: hedge.getBBox().height }, {
        y: 0,
        duration: hedgeDuration,
        ease: 'none',
      });

  const hedgeDown = gsap.timeline({ paused: true });
  hedgeDown
    .to(hedge, {
      y: hedge.getBBox().height,
      duration: hedgeDuration,
      ease: 'none',
    }, '>');

  const hedgeHalfDown = gsap.timeline({ paused: true });
  hedgeHalfDown
    .to(hedge, {
      y: hedge.getBBox().height - exp.targets[exp.trials.count].getBBox().height - 75,
      duration: hedgeDuration,
      ease: 'none',
    }, '>');

  const hedgeHalfUp = gsap.timeline({ paused: true });
  hedgeHalfUp
    .fromTo(hedge,
      { y: hedge.getBBox().height }, {
      // -75 because balloon doesn't land directly at border of screen
        y: hedge.getBBox().height - exp.targets[exp.trials.count].getBBox().height - 75,
        duration: hedgeDuration / 3,
        ease: 'none',
      });

  const ballonToGround = gsap.timeline({ paused: true });
  ballonToGround
    .to(exp.targets[exp.trials.count], {
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
      attentionGetter.play();
      ballonToGround.play();
      timeline
        .add(attentionGetter)
        .add(ballonToGround, '+=0.5');
      break;

    // for tablet hedge version fam trials
    case exp.trials.boxesNr[exp.trials.count] === 0 && exp.trials.type[exp.trials.count] === 'fam':
      attentionGetter.play();
      ballonToGround.play();
      hedgeHalfUp.play();
      timeline
        .add(attentionGetter)
        .add(ballonToGround, '+=0.5')
        .add(hedgeHalfUp, '+=0.5');
      break;

    // for tablet hedge version test trials
    case exp.trials.boxesNr[exp.trials.count] === 0 && exp.trials.type[exp.trials.count] === 'test':
      hedgeUp.play();
      attentionGetter.play();
      ballonToGround.play();
      hedgeHalfDown.play();
      timeline
        .add(hedgeUp)
        .add(attentionGetter, '+=0.5')
        .add(ballonToGround, '+=0.5')
        .add(hedgeHalfDown, '+=0.5');
      break;

    // for PC box version fam trials
    case exp.trials.boxesNr[exp.trials.count] > 0 && exp.trials.type[exp.trials.count] === 'fam':
      attentionGetter.play();
      ballonIntoBox.play();
      timeline
        .add(attentionGetter)
        .add(ballonIntoBox, '+=0.5');
      break;

    // for PC box version test trials
    case exp.trials.boxesNr[exp.trials.count] > 0 && exp.trials.type[exp.trials.count] === 'test':
      attentionGetter.play();
      hedgeUp.play();
      ballonIntoBox.play();
      hedgeDown.play();
      timeline
        .add(hedgeUp)
        .add(attentionGetter, '+=0.5')
        .add(ballonIntoBox, '+=0.5')
        .add(hedgeDown, '+=0.5');
      break;

    default:
      console.error('Error in defining animation');
  }

  timeline.play();
  return (timeline);
};

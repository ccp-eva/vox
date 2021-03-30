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
  // general delay
  const delay = 0.5;
  const hedgeDuration = 0.2;

  // -------------------------------------------------------------------------------------------------------------------
  // define common movements/ animations
  // -------------------------------------------------------------------------------------------------------------------
  const attentionGetter = gsap.timeline({ paused: true });
  attentionGetter
    . to([pupilLeft, pupilRight, irisLeft, irisRight], {
      scale: 1.3,
      opacity: 0.75,
      duration: 0.3,
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
      duration: exp.responseLog[exp.trials.count].durationAnimationBalloonTotal,
      ease: 'none',
      x: exp.elemSpecs.targets.centerFinal.x,
      y: exp.elemSpecs.targets.centerFinal.y,
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
  // ADD VOICE INSTRUCTIONS
  // -------------------------------------------------------------------------------------------------------------------
  const audioTrain1 = document.getElementById('audio-train-1');
  const audioFamHedge1 = document.getElementById('audio-fam-hedge-1');
  const audioFamHedge2 = document.getElementById('audio-fam-hedge-2');
  const audioTestHedge1 = document.getElementById('audio-test-hedge-1');
  const audioTestHedge2 = document.getElementById('audio-test-hedge-2');
  const audioTestHedge3 = document.getElementById('audio-test-hedge-3');
  const audioFamBox1 = document.getElementById('audio-fam-box-1');
  const audioTestBox1 = document.getElementById('audio-test-box-1');
  const audioTestBox2 = document.getElementById('audio-test-box-2');

  const playTrain1 = () => { audioTrain1.play(); };
  const playFamHedge1 = () => { audioFamHedge1.play(); };
  const playFamHedge2 = () => { audioFamHedge2.play(); };
  const playTestHedge1 = () => { audioTestHedge1.play(); };
  const playTestHedge2 = () => { audioTestHedge2.play(); };
  const playTestHedge3 = () => { audioTestHedge3.play(); };
  const playFamBox1 = () => { audioFamBox1.play(); };
  const playTestBox1 = () => { audioTestBox1.play(); };
  const playTestBox2 = () => { audioTestBox2.play(); };

  // -------------------------------------------------------------------------------------------------------------------
  // define animation depending on trial type
  // -------------------------------------------------------------------------------------------------------------------
  switch (true) {
    // for training trials
    case exp.trials.type[exp.trials.count] === 'train':
      // for instructions voice over
      if (exp.trials.voiceover[exp.trials.count]) {
        timeline.eventCallback('onStart', playTrain1);
        attentionGetter.delay(audioTrain1.duration + delay);
      }
      attentionGetter.play();
      ballonToGround.play();
      timeline
        .add(attentionGetter, `+=${delay}`)
        .add(ballonToGround, `+=${delay}`);
      break;

    // for tablet hedge version fam trials
    case exp.trials.boxesNr[exp.trials.count] === 0 && exp.trials.type[exp.trials.count] === 'fam':
      if (exp.trials.voiceover[exp.trials.count]) {
        timeline.eventCallback('onStart', playFamHedge1);
        attentionGetter.delay(audioFamHedge1.duration + delay);
        hedgeHalfUp.eventCallback('onStart', playFamHedge2);
      }
      attentionGetter.play();
      ballonToGround.play();
      hedgeHalfUp.play();
      timeline
        .add(attentionGetter, `+=${delay}`)
        .add(ballonToGround, `+=${delay}`)
        .add(hedgeHalfUp, `+=${delay}`);
      break;

    // for tablet hedge version test trials
    case exp.trials.boxesNr[exp.trials.count] === 0 && exp.trials.type[exp.trials.count] === 'test':
      if (exp.trials.voiceover[exp.trials.count]) {
        timeline.eventCallback('onStart', playTestHedge1);
        hedgeUp.delay(audioTestHedge1.duration + delay);
        hedgeUp.eventCallback('onComplete', playTestHedge2);
        attentionGetter.delay(audioTestHedge2.duration + delay);
        hedgeHalfDown.eventCallback('onStart', playTestHedge3);
      }
      hedgeUp.play();
      attentionGetter.play();
      ballonToGround.play();
      hedgeHalfDown.play();
      timeline
        .add(hedgeUp, `+=${delay}`)
        .add(attentionGetter, `+=${delay}`)
        .add(ballonToGround, `+=${delay}`)
        .add(hedgeHalfDown, `+=${delay}`);
      break;

    // for PC box version fam trials
    case exp.trials.boxesNr[exp.trials.count] > 0 && exp.trials.type[exp.trials.count] === 'fam':
      if (exp.trials.voiceover[exp.trials.count]) {
        timeline.eventCallback('onStart', playFamBox1);
        attentionGetter.delay(audioFamBox1.duration + delay);
      }
      attentionGetter.play();
      ballonIntoBox.play();
      timeline
        .add(attentionGetter, `+=${delay}`)
        .add(ballonIntoBox, `+=${delay}`);
      break;

    // for PC box version test trials
    case exp.trials.boxesNr[exp.trials.count] > 0 && exp.trials.type[exp.trials.count] === 'test':
      if (exp.trials.voiceover[exp.trials.count]) {
        timeline.eventCallback('onStart', playTestBox1);
        hedgeUp.delay(audioTestBox1.duration + delay);
        hedgeUp.eventCallback('onStart', playTestBox2);
        attentionGetter.delay(audioTestBox2.duration + delay);
      }
      hedgeUp.play();
      attentionGetter.play();
      ballonIntoBox.play();
      hedgeDown.play();
      timeline
        .add(hedgeUp, `+=${delay}`)
        .add(attentionGetter, `+=${delay}`)
        .add(ballonIntoBox, `+=${delay}`)
        .add(hedgeDown, `+=${delay}`);
      break;

    default:
      console.error('Error in defining animation');
  }

  timeline.play();
  return (timeline);
};

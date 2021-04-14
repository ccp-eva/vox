/* eslint-disable no-case-declarations */
import { gsap } from 'gsap';
import touch1Src from 'url:../sounds/touch-1.mp3';
import famHedge1Src from 'url:../sounds/fam-hedge-1.mp3';
import testHedge1Src from 'url:../sounds/test-hedge-1.mp3';
import testHedge2Src from 'url:../sounds/test-hedge-2.mp3';
import famBox1Src from 'url:../sounds/fam-box-1.mp3';
import testBox1Src from 'url:../sounds/test-box-1.mp3';
import testBox2Src from 'url:../sounds/test-box-2.mp3';

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
  const playTouch1 = () => {
    exp.soundEffect.src = touch1Src;
    exp.soundEffect.play();
  };
  const playFamHedge1 = () => {
    exp.soundEffect.src = famHedge1Src;
    exp.soundEffect.play();
  };
  const playTestHedge1 = () => {
    exp.soundEffect.src = testHedge1Src;
    exp.soundEffect.play();
  };
  const playTestHedge2 = () => {
    exp.soundEffect.src = testHedge2Src;
    exp.soundEffect.play();
  };
  const playFamBox1 = () => {
    exp.soundEffect.src = famBox1Src;
    exp.soundEffect.play();
  };
  const playTestBox1 = () => {
    exp.soundEffect.src = testBox1Src;
    exp.soundEffect.play();
  };
  const playTestBox2 = () => {
    exp.soundEffect.src = testBox2Src;
    exp.soundEffect.play();
  };

  // -------------------------------------------------------------------------------------------------------------------
  // define animation depending on trial type
  // -------------------------------------------------------------------------------------------------------------------
  switch (true) {
    // for touch training trials
    case exp.trials.type[exp.trials.count] === 'touch':
      // for instructions voice over
      if (exp.trials.voiceover[exp.trials.count]) {
        timeline.eventCallback('onStart', playTouch1);
        attentionGetter.delay(exp.elemSpecs.animAudioDur[touch1Src] + delay);
      }
      attentionGetter.play();
      ballonToGround.play();
      timeline
        .add(attentionGetter, `+=${delay}`)
        .add(ballonToGround, `+=${delay}`);
      break;

    // for tablet hedge version fam trials
    case exp.trials.boxesNr[exp.trials.count] === 0 && exp.trials.type[exp.trials.count] === 'fam':
      const hedgeSetHalfWay = gsap.set(hedge, {
        y: hedge.getBBox().height - exp.targets[exp.trials.count].getBBox().height - 75,
      });

      if (exp.trials.voiceover[exp.trials.count]) {
        timeline.eventCallback('onStart', playFamHedge1);
        attentionGetter.delay(exp.elemSpecs.animAudioDur[famHedge1Src] + delay);
      }

      attentionGetter.play();
      ballonToGround.play();

      timeline
        .add(hedgeSetHalfWay)
        .add(attentionGetter, `+=${delay}`)
        .add(ballonToGround, `+=${delay}`);
      break;

    // for tablet hedge version test trials
    case exp.trials.boxesNr[exp.trials.count] === 0 && exp.trials.type[exp.trials.count] === 'test':
      const hedgeHalfDown = gsap.to(hedge, {
        y: hedge.getBBox().height - exp.targets[exp.trials.count].getBBox().height - 75,
        duration: hedgeDuration,
        ease: 'none',
      });

      const hedgeUp = gsap.fromTo(hedge, {
        y: hedge.getBBox().height - exp.targets[exp.trials.count].getBBox().height - 75,
      }, {
        y: 0,
        duration: hedgeDuration,
        ease: 'none',
      });

      if (exp.trials.voiceover[exp.trials.count]) {
        timeline.eventCallback('onStart', playTestHedge1);
        hedgeUp.delay(exp.elemSpecs.animAudioDur[testHedge1Src] + delay);
        hedgeUp.eventCallback('onComplete', playTestHedge2);
        attentionGetter.delay(exp.elemSpecs.animAudioDur[testHedge2Src] + delay);
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
        attentionGetter.delay(exp.elemSpecs.animAudioDur[famBox1Src] + delay);
      }
      attentionGetter.play();
      ballonIntoBox.play();
      timeline
        .add(attentionGetter, `+=${delay}`)
        .add(ballonIntoBox, `+=${delay}`);
      break;

    // for PC box version test trials
    case exp.trials.boxesNr[exp.trials.count] > 0 && exp.trials.type[exp.trials.count] === 'test':
      const hedgeDown = gsap.to(hedge, {
        y: hedge.getBBox().height,
        duration: hedgeDuration,
        ease: 'none',
      });

      const hedgeWholeWayUp = gsap.fromTo(hedge, {
        y: hedge.getBBox().height,
      }, {
        y: 0,
        duration: hedgeDuration,
        ease: 'none',
      });

      if (exp.trials.voiceover[exp.trials.count]) {
        timeline.eventCallback('onStart', playTestBox1);
        hedgeWholeWayUp.delay(exp.elemSpecs.animAudioDur[testBox1Src] + delay);
        hedgeWholeWayUp.eventCallback('onComplete', playTestBox2);
        attentionGetter.delay(exp.elemSpecs.animAudioDur[testBox2Src] + delay);
      }

      hedgeWholeWayUp.play();
      attentionGetter.play();
      ballonIntoBox.play();
      hedgeDown.play();

      timeline
        .add(hedgeWholeWayUp, `+=${delay}`)
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

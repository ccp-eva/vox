import { gsap } from 'gsap';
import setCircleAttr from './setCircleAttr';
import setViewBoxAttr from './setViewBoxAttr';

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR ANIMATING BALLOON, EYES, HEDGE
// ---------------------------------------------------------------------------------------------------------------------
export default (exp) => new Promise((resolve) => {
  // hide blurr canvas and button
  document.getElementById('experiment-button').setAttribute('visibility', 'hidden');
  document.getElementById('cover-blurr').setAttribute('visibility', 'hidden');

  // get relevant elements
  const currentAgent = `${exp.agents[exp.trials.count].getAttribute('id')}`;
  const hedge = document.getElementById('hedge');
  const pupilLeft = document.getElementById(`${currentAgent}-pupil-left`);
  const pupilRight = document.getElementById(`${currentAgent}-pupil-right`);
  const irisLeft = document.getElementById(`${currentAgent}-iris-left`);
  const irisRight = document.getElementById(`${currentAgent}-iris-right`);
  const boxes = document.getElementById('five-boxes');

  // we use gsap3 for animation
  const timelineFam = gsap.timeline();
  const timelineTest = gsap.timeline();

  // animate target
  // for fam trials, just show full path. everything at the same time
  if (exp.trials.type[exp.trials.count] === 'fam') {
    timelineFam
      .fromTo(exp.targets[exp.trials.count], {
        attr: { viewBox: `${exp.elemSpecs.targets.viewBoxCenter}` },
      }, {
        delay: 1,
        duration: `${exp.responseLog[exp.trials.count].durationAnimationTotal}`,
        ease: 'none',
        attr: { viewBox: `${exp.positions[exp.trials.count].viewBoxRandom}` },
        onInterrupt() {
          console.log('interrupted in fam target');
        },
        onComplete() {
          setViewBoxAttr(exp.targets[exp.trials.count], exp.positions[exp.trials.count].viewBoxRandom);
        },
      })
      // animate left eye
      .fromTo([pupilLeft, irisLeft], {
        attr: {
          cx: `${exp.elemSpecs.eyes[currentAgent].left.center.x}`,
          cy: `${exp.elemSpecs.eyes[currentAgent].left.center.y}`,
        },
      }, {
        duration: `${exp.responseLog[exp.trials.count].durationAnimationTotal}`,
        ease: 'none',
        attr: {
          cx: `${exp.elemSpecs.eyes[currentAgent].left.random.x}`,
          cy: `${exp.elemSpecs.eyes[currentAgent].left.random.y}`,
        },
        onInterrupt() {
          console.log('interrupted in fam eyes left');
        },
        onComplete() {
          setCircleAttr(pupilLeft, exp.elemSpecs.eyes[currentAgent].left.random);
          setCircleAttr(irisLeft, exp.elemSpecs.eyes[currentAgent].left.random);
        },
      }, '<')
      // animate right eye
      .fromTo([pupilRight, irisRight], {
        attr: {
          cx: `${exp.elemSpecs.eyes[currentAgent].right.center.x}`,
          cy: `${exp.elemSpecs.eyes[currentAgent].right.center.y}`,
        },
      }, {
        duration: `${exp.responseLog[exp.trials.count].durationAnimationTotal}`,
        ease: 'none',
        attr: {
          cx: `${exp.elemSpecs.eyes[currentAgent].right.random.x}`,
          cy: `${exp.elemSpecs.eyes[currentAgent].right.random.y}`,
        },
        onInterrupt() {
          console.log('interrupted in fam eyes right');
        },
        onComplete() {
          setCircleAttr(pupilRight, exp.elemSpecs.eyes[currentAgent].right.random);
          setCircleAttr(irisRight, exp.elemSpecs.eyes[currentAgent].right.random);
          console.log('animation famtrial complete');
          resolve();
        },
      }, '<');

    // for test trials, first hide balloon, then move to final position
  } else {
    timelineTest
      // first: hide balloon
      .fromTo(exp.targets[exp.trials.count], {
        attr: { viewBox: `${exp.elemSpecs.targets.viewBoxCenter}` },
      }, {
        delay: 1,
        duration: `${exp.responseLog[exp.trials.count].durationAnimationCenterHidden}`,
        ease: 'none',
        attr: { viewBox: `${exp.elemSpecs.targets.viewBoxHidden}` },
        onInterrupt() {
          console.log('interrupted in test target hide');
        },
      })
      // let eyes follow balloon already
      .fromTo([pupilLeft, irisLeft], {
        attr: {
          cx: `${exp.elemSpecs.eyes[currentAgent].left.center.x}`,
          cy: `${exp.elemSpecs.eyes[currentAgent].left.center.y}`,
        },
      }, {
        duration: `${exp.responseLog[exp.trials.count].durationAnimationCenterHidden}`,
        ease: 'none',
        attr: {
          cx: `${exp.elemSpecs.eyes[currentAgent].left.beginning.x}`,
          cy: `${exp.elemSpecs.eyes[currentAgent].left.beginning.y}`,
        },
        onInterrupt() {
          console.log('interrupted in test eyes left hide');
        },
      }, '<')
      .fromTo([pupilRight, irisRight], {
        attr: {
          cx: `${exp.elemSpecs.eyes[currentAgent].right.center.x}`,
          cy: `${exp.elemSpecs.eyes[currentAgent].right.center.y}`,
        },
      }, {
        duration: `${exp.responseLog[exp.trials.count].durationAnimationCenterHidden}`,
        ease: 'none',
        attr: {
          cx: `${exp.elemSpecs.eyes[currentAgent].right.beginning.x}`,
          cy: `${exp.elemSpecs.eyes[currentAgent].right.beginning.y}`,
        },
        onInterrupt() {
          console.log('interrupted in test eyes right hide');
        },
      }, '<');
    // then move balloon to final position
    timelineTest.fromTo(exp.targets[exp.trials.count], {
      attr: { viewBox: `${exp.elemSpecs.targets.viewBoxHidden}` },
    }, {
      duration: `${exp.responseLog[exp.trials.count].durationAnimationHiddenRandom}`,
      ease: 'none',
      attr: { viewBox: `${exp.positions[exp.trials.count].viewBoxRandom}` },
      onInterrupt() {
        console.log('interrupted in test target final');
      },
      onComplete() {
        setViewBoxAttr(exp.targets[exp.trials.count], exp.positions[exp.trials.count].viewBoxRandom);
      },
    })
      // eye movement from hidden to target
      .fromTo([pupilLeft, irisLeft], {
        attr: {
          cx: `${exp.elemSpecs.eyes[currentAgent].left.beginning.x}`,
          cy: `${exp.elemSpecs.eyes[currentAgent].left.beginning.y}`,
        },
      }, {
        duration: `${exp.responseLog[exp.trials.count].durationAnimationHiddenRandom}`,
        ease: 'none',
        attr: {
          cx: `${exp.elemSpecs.eyes[currentAgent].left.random.x}`,
          cy: `${exp.elemSpecs.eyes[currentAgent].left.random.y}`,
        },
        onInterrupt() {
          console.log('interrupted in test eyes left final');
        },
        onComplete() {
          setCircleAttr(pupilLeft, exp.elemSpecs.eyes[currentAgent].left.random);
          setCircleAttr(irisLeft, exp.elemSpecs.eyes[currentAgent].left.random);
        },
      }, '<')
      .fromTo([pupilRight, irisRight], {
        attr: {
          cx: `${exp.elemSpecs.eyes[currentAgent].right.beginning.x}`,
          cy: `${exp.elemSpecs.eyes[currentAgent].right.beginning.y}`,
        },
      }, {
        duration: `${exp.responseLog[exp.trials.count].durationAnimationHiddenRandom}`,
        ease: 'none',
        attr: {
          cx: `${exp.elemSpecs.eyes[currentAgent].right.random.x}`,
          cy: `${exp.elemSpecs.eyes[currentAgent].right.random.y}`,
        },
        onInterrupt() {
          console.log('interrupted in test eyes right final');
        },
        onComplete() {
          setCircleAttr(pupilRight, exp.elemSpecs.eyes[currentAgent].right.random);
          setCircleAttr(irisRight, exp.elemSpecs.eyes[currentAgent].right.random);
        },
      }, '<');

    // for tablet version, no boxes and let hedge move down a bit
    if (exp.subjData.touchScreen) {
      boxes.setAttribute('visibility', 'hidden');
      const hedgeDownY = hedge.getBBox().height - exp.targets[exp.trials.count].getBBox().height - 75;
      const hedgeDown = `0 -${hedgeDownY} 1920 1080`;

      timelineTest.fromTo(hedge, {
        attr: { viewBox: `${exp.elemSpecs.outerSVG.origViewBox}` },
      }, {
        duration: 1,
        ease: 'none',
        attr: { viewBox: `${hedgeDown}` },
        onInterrupt() {
          console.log('interrupted in test hedge');
        },
        onComplete() {
          setViewBoxAttr(hedge, hedgeDown);
        },
      })
        .then(() => {
          console.log('animation testtrial complete');
          resolve();
        });

      // for PC version, hide hedge and show boxes
    } else if (!exp.subjData.touchScreen) {
      const hedgeGone = `${exp.elemSpecs.outerSVG.origViewBoxX} -${exp.elemSpecs.outerSVG.origViewBoxHeight} ${exp.elemSpecs.outerSVG.origViewBoxWidth} ${exp.elemSpecs.outerSVG.origViewBoxHeight}`;

      timelineTest.fromTo(hedge, {
        attr: { viewBox: `${exp.elemSpecs.outerSVG.origViewBox}` },
      }, {
        duration: 1,
        ease: 'none',
        attr: { viewBox: `${hedgeGone}` },
        onInterrupt() {
          console.log('interrupted in test hedge');
        },
        onComplete() {
          setViewBoxAttr(hedge, hedgeGone);
        },
      })
        .then(() => {
          console.log('animation testtrial complete');
          resolve();
        });
    }
  }
});

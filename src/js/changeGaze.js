import { gsap } from 'gsap';
import setCircleCenter from './setCircleCenter';
import setTargetCenter from './setTargetCenter';

export default (exp, trialCount) => new Promise((resolve) => {
  document.getElementById('experiment-button').setAttribute('visibility', 'hidden');
  document.getElementById('cover-blurr').setAttribute('visibility', 'hidden');
  const currentAgent = `${exp.agents[trialCount].getAttribute('id')}`;
  const hedge = document.getElementById('hedge');
  const pupilLeft = document.getElementById(`${currentAgent}-pupil-left`);
  const pupilRight = document.getElementById(`${currentAgent}-pupil-right`);
  const irisLeft = document.getElementById(`${currentAgent}-iris-left`);
  const irisRight = document.getElementById(`${currentAgent}-iris-right`);

  const timelineFam = gsap.timeline();
  const timelineTest = gsap.timeline();

  // need to put it in function, so that we can put delay on it in animation
  const showBoxes = () => {
    hedge.setAttribute('visibility', 'hidden');
  };

  // animate target
  // for fam trials, just show full path. everything at the same time
  if (exp.trialType[trialCount] === 'fam') {
    timelineFam
      .to(exp.targets[trialCount], {
        delay: 1,
        duration: `${exp.responseLog[trialCount].durationAnimationTotal}`,
        ease: 'none',
        attr: { viewBox: `${exp.positions[trialCount].viewBoxRandom}` },
        onComplete() {
          setTargetCenter(exp.targets[trialCount], exp.positions[trialCount].viewBoxRandom);
        },
      })
      // animate left eye
      .to([pupilLeft, irisLeft],
        {
          duration: `${exp.responseLog[trialCount].durationAnimationTotal}`,
          ease: 'none',
          attr: {
            cx: `${exp.elemSpecs.eyes[currentAgent].left.random.x}`,
            cy: `${exp.elemSpecs.eyes[currentAgent].left.random.y}`,
          },
          onComplete() {
            setCircleCenter(pupilLeft, exp.elemSpecs.eyes[currentAgent].left.random);
            setCircleCenter(irisLeft, exp.elemSpecs.eyes[currentAgent].left.random);
          },
        }, '<')
      // animate right eye
      .to([pupilRight, irisRight],
        {
          duration: `${exp.responseLog[trialCount].durationAnimationTotal}`,
          ease: 'none',
          attr: {
            cx: `${exp.elemSpecs.eyes[currentAgent].right.random.x}`,
            cy: `${exp.elemSpecs.eyes[currentAgent].right.random.y}`,
          },
          onComplete() {
            setCircleCenter(pupilRight, exp.elemSpecs.eyes[currentAgent].right.random);
            setCircleCenter(irisRight, exp.elemSpecs.eyes[currentAgent].right.random);
            console.log('animation famtrial complete');
            resolve({
              pupilLeft, pupilRight,
            });
          },
        }, '<');

    // for test trials, first hide balloon, then move to final position
  } else {
    timelineTest
      // first: hide balloon
      .to(exp.targets[trialCount], {
        delay: 1,
        duration: `${exp.responseLog[trialCount].durationAnimationCenterHidden}`,
        ease: 'none',
        attr: { viewBox: `${exp.elemSpecs.targets.viewBoxHidden}` },
      })
      // let eyes follow balloon already
      .to([pupilLeft, irisLeft],
        {
          duration: `${exp.responseLog[trialCount].durationAnimationCenterHidden}`,
          ease: 'none',
          attr: {
            cx: `${exp.elemSpecs.eyes[currentAgent].left.beginning.x}`,
            cy: `${exp.elemSpecs.eyes[currentAgent].left.beginning.y}`,
          },
        }, '<')
      .to([pupilRight, irisRight],
        {
          duration: `${exp.responseLog[trialCount].durationAnimationCenterHidden}`,
          ease: 'none',
          attr: {
            cx: `${exp.elemSpecs.eyes[currentAgent].right.beginning.x}`,
            cy: `${exp.elemSpecs.eyes[currentAgent].right.beginning.y}`,
          },
        }, '<');
    // then move balloon to final position
    timelineTest.to(exp.targets[trialCount], {
      duration: `${exp.responseLog[trialCount].durationAnimationHiddenRandom}`,
      ease: 'none',
      attr: { viewBox: `${exp.positions[trialCount].viewBoxRandom}` },
      onComplete() {
        setTargetCenter(exp.targets[trialCount], exp.positions[trialCount].viewBoxRandom);
      },
    })
      // eye movement from hidden to target
      .to([pupilLeft, irisLeft],
        {
          duration: `${exp.responseLog[trialCount].durationAnimationHiddenRandom}`,
          ease: 'none',
          attr: {
            cx: `${exp.elemSpecs.eyes[currentAgent].left.random.x}`,
            cy: `${exp.elemSpecs.eyes[currentAgent].left.random.y}`,
          },
          onComplete() {
            setCircleCenter(pupilLeft, exp.elemSpecs.eyes[currentAgent].left.random);
            setCircleCenter(irisLeft, exp.elemSpecs.eyes[currentAgent].left.random);
          },
        }, '<')
      .to([pupilRight, irisRight],
        {
          duration: `${exp.responseLog[trialCount].durationAnimationHiddenRandom}`,
          ease: 'none',
          attr: {
            cx: `${exp.elemSpecs.eyes[currentAgent].right.random.x}`,
            cy: `${exp.elemSpecs.eyes[currentAgent].right.random.y}`,
          },
          onComplete() {
            setCircleCenter(pupilRight, exp.elemSpecs.eyes[currentAgent].right.random);
            setCircleCenter(irisRight, exp.elemSpecs.eyes[currentAgent].right.random);

            // for PC version, hide hedge and show boxes
            if (!exp.subjData.touchScreen) {
              timelineTest.add(showBoxes, '+=0.2'); // after gap
            }
          },
        }, '<')
      .then(() => {
        console.log('animation testtrial complete');
        resolve({
          pupilLeft, pupilRight,
        });
      });
  }
});

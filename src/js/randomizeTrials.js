import divideWithRemainder from './divideWithRemainder';
import shuffleArray from './shuffleArray';
import randomNumber from './randomNumber';

// ---------------------------------------------------------------------------------------------------------------------
// RANDOMIZATION OF OUR AGENTS, TARGETS AND TARGET POSITIONS
// saves all important arrays in our exp object
// ---------------------------------------------------------------------------------------------------------------------
export default (exp, agentsSingle, targetsSingle) => {
  // create array with entry for each touch, fam and test trial
  const touchTrials = new Array(exp.trials.touchNr).fill('touch');
  const famTrials = new Array(exp.trials.famNr).fill('fam');
  const testTrials = new Array(exp.trials.testNr).fill('test');
  exp.trials.type = touchTrials.concat(famTrials, testTrials);

  if (exp.subjData.touchScreen) {
    exp.trials.boxesNr = new Array(exp.trials.totalNr).fill(0);
  } else if (!exp.subjData.touchScreen) {
    exp.trials.boxesNr = [].concat(
      new Array(exp.trials.touchNr).fill(0),
      // change here how many boxes are shown
      new Array(exp.trials.famNr + exp.trials.testNr).fill(exp.trials.boxVersion),
    );
  }

  // create boolean that stores whether trial should have an instruction voice over
  exp.trials.voiceover = Array(exp.trials.totalNr).fill(false);
  for (let i = 1; i <= exp.trials.voiceoverNr; i++) {
    exp.trials.voiceover[0 + i - 1] = true;
    exp.trials.voiceover[exp.trials.touchNr + i - 1] = true;
    exp.trials.voiceover[exp.trials.touchNr + exp.trials.famNr + i - 1] = true;
  }

  // calculate how many times each agent should be repeated, based on trialNumber
  const agentsDiv = divideWithRemainder(exp.trials.type.length, agentsSingle.length);

  let agents = [];
  for (let i = 0; i < agentsDiv.quotient; i++) {
    const agentsShuffled = shuffleArray(agentsSingle);
    agents = agents.concat(agentsShuffled);
  }

  // if our trialNumber is not divisable by number of agents, put random agents for remainder number:
  // create random array with agents
  // keep only as many entries in array as we need (remove rest)
  // combine with list of repeated agents
  if (agentsDiv.remainder > 0) {
    const agentsTmp = shuffleArray(agentsSingle);
    agentsTmp.splice(0, agentsTmp.length - agentsDiv.remainder);
    agents = agents.concat(agentsTmp);
  }

  exp.agents = agents;

  // SAME FOR TARGET
  const targetsDiv = divideWithRemainder(exp.trials.type.length, targetsSingle.length);

  let targets = [];
  for (let i = 0; i < targetsDiv.quotient; i++) {
    const targetsShuffled = shuffleArray(targetsSingle);
    targets = targets.concat(targetsShuffled);
  }

  if (targetsDiv.remainder > 0) {
    const targetsTmp = shuffleArray(targetsSingle);
    targetsTmp.splice(0, targetsTmp.length - targetsDiv.remainder);
    targets = targets.concat(targetsTmp);
  }
  exp.targets = targets;

  // FOR POSITIONS OF TARGET:
  // for fam trials and touchscreen with hedge:
  // ten equally big sections, where targets can land
  let positions = [];
  const positionsSingleContinuous = [];
  const bins = 10;
  let prevMax = 0;
  for (let i = 1; i <= bins; i++) {
    const section = {
      bin: i,
      type: 'randomLocation',
      x: randomNumber(prevMax, (exp.elemSpecs.targets.borderRight / bins) * i),
      y: exp.elemSpecs.targets.groundY,
    };
    prevMax = (exp.elemSpecs.targets.borderRight / bins) * i;
    positionsSingleContinuous.push(section);
  }

  // for touchscreen with hedge, the target lands in random locations for all trials
  // TODO if we want to show boxes/hedge indepedent of touchscreen, this has to change!
  if (exp.subjData.touchScreen) {
    // for touch+fam trials that are less than all nr of bins:
    // take the most extreme positions
    if (exp.trials.touchNr + exp.trials.famNr <= bins) {
      let lower = 0;
      let upper = bins - 1;
      for (let i = 0; i < exp.trials.touchNr + exp.trials.famNr; i++) {
      // alternate from which end of the array we take the position
      // for even numbers, take from the upper end; for odd, take from lower end
        if (i % 2 === 0) {
          positions.push(positionsSingleContinuous[upper]);
          upper--;
        }
        if (i % 2 !== 0) {
          positions.push(positionsSingleContinuous[lower]);
          lower++;
        }
      }
    }
    // TODO do we actually want to shuffle here?
    // positions = shuffleArray(positions);

    // how many trials are completely randomized
    const randomPos = exp.trials.touchNr + exp.trials.famNr <= bins ? exp.trials.testNr : exp.trials.totalNr;

    // how many times can we repeat each section
    const positionsDiv = divideWithRemainder(randomPos, positionsSingleContinuous.length);

    for (let i = 0; i < positionsDiv.quotient; i++) {
      const positionsShuffled = shuffleArray(positionsSingleContinuous);
      positions = positions.concat(positionsShuffled);
    }

    // if division with remainder, fill up array
    if (positionsDiv.remainder > 0) {
      const positionsTmp = shuffleArray(positionsSingleContinuous);
      positionsTmp.splice(0, positionsTmp.length - positionsDiv.remainder);
      positions = positions.concat(positionsTmp);
    }

  // for PC version with boxes: target can only land in boxes
  } else if (!exp.subjData.touchScreen) {
    const positionsSingleBoxes = [];
    const boxes = Array.from(document.querySelectorAll(`[id^= "boxes${exp.trials.boxVersion}-front-box"]`));
    boxes.forEach((box, i) => {
      const section = {
        // so that it starts with 1
        bin: i + 1,
        type: 'boxLocation',
        // add half a target width for placing upper left balloon corner in middle of box
        x: box.getBBox().x + box.getBBox().width / 2 - targetsSingle[0].getBBox().width / 2,
        y: exp.elemSpecs.targets.groundY,
      };
      positionsSingleBoxes.push(section);
    });

    const positionsDiv = divideWithRemainder(exp.trials.totalNr, positionsSingleBoxes.length);

    positionsSingleBoxes.forEach((section) => {
      positions = positions.concat(new Array(positionsDiv.quotient).fill(section));
    });
    positions = shuffleArray(positions);

    if (positionsDiv.remainder > 0) {
      const positionsTmp = shuffleArray(positionsSingleBoxes);
      positionsTmp.splice(0, positionsTmp.length - positionsDiv.remainder);
      positions = positions.concat(positionsTmp);
    }
  }
  exp.positions = positions;
  exp.responseLog = [];
};

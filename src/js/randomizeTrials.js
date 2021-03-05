import divideWithRemainder from './divideWithRemainder';
import shuffleArray from './shuffleArray';
import randomNumber from './randomNumber';

// ---------------------------------------------------------------------------------------------------------------------
// RANDOMIZATION OF OUR AGENTS, TARGETS AND TARGET POSITIONS
// saves all important arrays in our exp object
// ---------------------------------------------------------------------------------------------------------------------
export default (exp, agentsSingle, targetsSingle) => {
  // create array with entry for each fam and test trial
  exp.trials.type = [].concat(new Array(exp.trials.famNr).fill('fam'), new Array(exp.trials.testNr).fill('test'));

  // calculate how many times each agent should be repeated, based on trialNumber
  const agentsDiv = divideWithRemainder(exp.trials.type.length, agentsSingle.length);

  let agents = [];
  agentsSingle.forEach((agent) => {
    agents = agents.concat(new Array(agentsDiv.quotient).fill(agent));
  });
  agents = shuffleArray(agents);

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
  targetsSingle.forEach((target) => {
    targets = targets.concat(new Array(targetsDiv.quotient).fill(target));
  });
  targets = shuffleArray(targets);

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
  let prevMax = 0;
  for (let i = 1; i <= 10; i++) {
    const randomLocation = randomNumber(prevMax, (exp.elemSpecs.targets.borderRight / 10) * i);
    const viewBoxRandom = exp.elemSpecs.targets.viewBoxRandom.replace('x', randomLocation);
    const section = {
      bin: i,
      type: 'randomLocation',
      viewBoxRandom,
    };
    prevMax = (exp.elemSpecs.targets.borderRight / 10) * i;
    positionsSingleContinuous.push(section);
  }

  // for touchscreen with hedge, the target lands in random locations for all trials
  if (exp.subjData.touchScreen) {
    // how many times can we repeat each section
    const positionsDiv = divideWithRemainder(exp.trials.type.length, positionsSingleContinuous.length);
    positionsSingleContinuous.forEach((section) => {
      positions = positions.concat(new Array(positionsDiv.quotient).fill(section));
    });
    positions = shuffleArray(positions);

    // if division with remainder, fill up array
    if (positionsDiv.remainder > 0) {
      const positionsTmp = shuffleArray(positionsSingleContinuous);
      positionsTmp.splice(0, positionsTmp.length - positionsDiv.remainder);
      positions = positions.concat(positionsTmp);
    }

    // for PC version with boxes:
  } else if (!exp.subjData.touchScreen) {
    // for fam trials, random location (same as tablet hedge version)
    // how many times can we repeat each section
    // let positionsFam = [];
    // const positionsDivFam = divideWithRemainder(exp.trials.famNr, positionsSingleContinuous.length);
    // positionsSingleContinuous.forEach((section) => {
    //   positionsFam = positionsFam.concat(new Array(positionsDivFam.quotient).fill(section));
    // });
    // positionsFam = shuffleArray(positionsFam);

    // // if division with remainder, fill up array
    // if (positionsDivFam.remainder > 0) {
    //   const positionsTmp = shuffleArray(positionsSingleContinuous);
    //   positionsTmp.splice(0, positionsTmp.length - positionsDivFam.remainder);
    //   positionsFam = positionsFam.concat(positionsTmp);
    // }

    // for test trials, target can only land in boxes
    const positionsSingleBoxes = [];
    const box1 = document.getElementById('box1');
    const box2 = document.getElementById('box2');
    const box3 = document.getElementById('box3');
    const box4 = document.getElementById('box4');
    const box5 = document.getElementById('box5');

    [box1, box2, box3, box4, box5].forEach((box, i) => {
      const section = {
        // so that it starts with 1
        bin: i + 1,
        type: 'boxLocation',
        // add half a target width for placing upper left balloon corner in middle of box
        viewBoxRandom: exp.elemSpecs.targets.viewBoxRandom.replace('x', ((box.getBBox().x + box.getBBox().width / 2) - targetsSingle[0].getBBox().width / 2)),
      };
      positionsSingleBoxes.push(section);
    });

    const positionsDivTest = divideWithRemainder(exp.trials.testNr, positionsSingleBoxes.length);

    let positionsTest = [];
    positionsSingleBoxes.forEach((section) => {
      positionsTest = positionsTest.concat(new Array(positionsDivTest.quotient).fill(section));
    });
    positionsTest = shuffleArray(positionsTest);

    if (positionsDivTest.remainder > 0) {
      const positionsTmp = shuffleArray(positionsSingleBoxes);
      positionsTmp.splice(0, positionsTmp.length - positionsDivTest.remainder);
      positionsTest = positionsTest.concat(positionsTmp);
    }

    // combine fam and test trial positions
    // positions = positionsFam.concat(positionsTest);
    positions = positionsTest;
  }
  exp.positions = positions;
  exp.responseLog = [];
};

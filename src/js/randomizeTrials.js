import divideWithRemainder from './divideWithRemainder';
import shuffleArray from './shuffleArray';
import checkForTouchscreen from './checkForTouchscreen';

export default (famNr, testNr, agentsSingle, targetsSingle, targetPositionRight) => {
  const touchScreen = checkForTouchscreen();
  console.log('touchScreen', touchScreen);

  // create array with entry for each fam and test trial
  const trialType = [].concat(new Array(famNr).fill('fam'), new Array(testNr).fill('test'));

  // calculate how many times each agent should be repeated, based on trialNumber
  const agentsDiv = divideWithRemainder(trialType.length, agentsSingle.length);

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
  console.log('agents', agents);

  // SAME FOR TARGET
  const targetsDiv = divideWithRemainder(trialType.length, targetsSingle.length);

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
  console.log('targets', targets);

  const positionsSingle = [];

  // for touchscreen & hedge: ten equally big sections, where targets can land
  if (touchScreen) {
    let prevMax = 0;
    for (let i = 1; i <= 10; i++) {
      const section = {
        bin: i,
        min: prevMax,
        max: (targetPositionRight / 10) * i,
      };
      prevMax = section.max;
      positionsSingle.push(section);
    }
  // for PC version with boxes
  } else if (!touchScreen) {
    const box1 = document.getElementById('box1');
    const box2 = document.getElementById('box2');
    const box3 = document.getElementById('box3');
    const box4 = document.getElementById('box4');
    const box5 = document.getElementById('box5');

    [box1, box2, box3, box4, box5].forEach((box, i) => {
      const section = {
        // so that it starts with 1
        bin: i + 1,
        // add half a target width for placing upper left balloon corner in middle of box
        x: (box.getBBox().x + box.getBBox().width / 2) - targetsSingle[0].getBBox().width / 2,
      };
      positionsSingle.push(section);
    });
  }

  const positionsDiv = divideWithRemainder(trialType.length, positionsSingle.length);

  let positions = [];
  positionsSingle.forEach((section) => {
    positions = positions.concat(new Array(positionsDiv.quotient).fill(section));
  });
  positions = shuffleArray(positions);

  if (positionsDiv.remainder > 0) {
    const positionsTmp = shuffleArray(positionsSingle);
    positionsTmp.splice(0, positionsTmp.length - positionsDiv.remainder);
    positions = positions.concat(positionsTmp);
  }
  console.log('positions', positions);

  return {
    trialType, agents, targets, positions,
  };
};

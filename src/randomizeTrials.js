import divideWithRemainder from './js/divideWithRemainder';
import shuffleArray from './js/shuffleArray';

export default (famNr, testNr, agentsSingle, targetsSingle) => {
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
  return { trialType, agents, targets };
};

export default (agents, trialCount) => {
  for (let i = 0; i < agents.length; i++) {
    if (trialCount === i) {
      eval(agents[i]).setAttribute('visibility', 'visible');
    } else {
      eval(agents[i]).setAttribute('visibility', 'hidden');
    }
  }
};

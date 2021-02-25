// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR SHOWING & HIDING ELEMENTS
// for targets & agents, show only those whose trial it is
// ---------------------------------------------------------------------------------------------------------------------
export default (elements, trialCount) => {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i] === elements[trialCount]) {
      elements[i].setAttribute('visibility', 'visible');
    } else {
      elements[i].setAttribute('visibility', 'hidden');
    }
  }
};

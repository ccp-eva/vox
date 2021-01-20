export default (elements, trialCount) => {
  for (let i = 0; i < elements.length; i++) {
    if (i === trialCount) {
      elements[i].setAttribute('visibility', 'visible');
    } else {
      elements[i].setAttribute('visibility', 'hidden');
    }
  }
};

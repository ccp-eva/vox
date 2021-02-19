export default (visibleElements, hiddenElements) => {
  visibleElements.forEach((element) => {
    element.setAttribute('visibility', 'visible');
  });
  hiddenElements.forEach((element) => {
    element.setAttribute('visibility', 'hidden');
  });
};

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR SHOWING AND HIDING LAYERS
// first argument array gets set to visible, second to hidden
// ---------------------------------------------------------------------------------------------------------------------
export default (visibleElements, hiddenElements) => {
  visibleElements.forEach((element) => {
    element.setAttribute('visibility', 'visible');
  });
  hiddenElements.forEach((element) => {
    element.setAttribute('visibility', 'hidden');
  });
};

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR SETTING CIRCLE ATTRIBUTES
// ---------------------------------------------------------------------------------------------------------------------
export default (target, newCoords) => {
  function moveCenter() {
    target.setAttribute('cx', newCoords.x);
    target.setAttribute('cy', newCoords.y);
    requestAnimationFrame(moveCenter);
  }
  requestAnimationFrame(moveCenter);
};

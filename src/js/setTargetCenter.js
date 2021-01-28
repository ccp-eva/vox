export default (target, newViewBox) => {
  function moveViewBox() {
    target.setAttribute('viewBox', newViewBox);
    requestAnimationFrame(moveViewBox);
  }
  requestAnimationFrame(moveViewBox);
};

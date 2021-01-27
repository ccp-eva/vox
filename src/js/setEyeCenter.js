export default (target, newCoords) => {
  const oldX = parseFloat(target.getAttribute('cx'));
  const oldY = parseFloat(target.getAttribute('cy'));
  const newX = newCoords.x;
  const newY = newCoords.y;

  function moveCenter() {
    const nextX = oldX + (newX - oldX);
    const nextY = oldY + (newY - oldY);
    target.setAttribute('cx', nextX);
    target.setAttribute('cy', nextY);
    requestAnimationFrame(moveCenter);
  }

  requestAnimationFrame(moveCenter);
};

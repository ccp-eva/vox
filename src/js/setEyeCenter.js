export default (target, newCoords) => {
  const oldX = parseFloat(target.getAttribute('cx'));
  const oldY = parseFloat(target.getAttribute('cy'));
  const newX = newCoords.x;
  const newY = newCoords.y;
  // Goes from 0 to 1 (to reach final position)
  // 0.5 stops half way
  let animProgress = 0;
  // Change in animProgress per interval function invocation.
  const animStep = 1;

  // recursive function for moving the target
  function moveCenter() {
    animProgress += animStep;
    // stop animation once the newCoords are reached
    if (animProgress > 1) { animProgress = 1; }
    // Calculate new center coords corresponding to our animation progress
    const nextX = oldX + animProgress * (newX - oldX);
    const nextY = oldY + animProgress * (newY - oldY);
    target.setAttribute('cx', nextX);
    target.setAttribute('cy', nextY);
    requestAnimationFrame(moveCenter);
  }

  // call recursive function once to start process
  requestAnimationFrame(moveCenter);
};

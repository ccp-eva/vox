export default (target, newCoords) => {
  const oldX = parseFloat(target.getAttribute('cx'));
  const oldY = parseFloat(target.getAttribute('cy'));
  const newX = newCoords.x;
  const newY = newCoords.y;
  // Goes from 0 to 1 (to reach final position)
  // 0.5 stops half way
  let animProgress = 0;
  const animStep = 0.02; // Change in animProgress per interval function invocation.

  const interval = setInterval(() => {
    animProgress += animStep;
    if (animProgress > 1) { animProgress = 1; }
    // Calculate a new viewBox corresponding to our animation progress
    const nextX = oldX + animProgress * (newX - oldX);
    const nextY = oldY + animProgress * (newY - oldY);
    target.setAttribute('cx', nextX);
    target.setAttribute('cy', nextY);
    if (animProgress >= 1) { clearInterval(interval); }
  }, 10);
};

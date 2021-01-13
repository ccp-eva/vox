// https://stackoverflow.com/questions/46060518/animating-attribute-values-with-javascript-zooming-in-the-svg-viewbox
export default (target, oldViewBox, newViewBox) => {
  const oldX = parseFloat(oldViewBox.split(' ')[0]);
  const oldY = parseFloat(oldViewBox.split(' ')[1]);
  const oldWidth = parseFloat(oldViewBox.split(' ')[2]);
  const oldHeight = parseFloat(oldViewBox.split(' ')[3]);

  const newX = parseFloat(newViewBox.split(' ')[0]);
  const newY = parseFloat(newViewBox.split(' ')[1]);
  const newWidth = parseFloat(newViewBox.split(' ')[2]);
  const newHeight = parseFloat(newViewBox.split(' ')[3]);

  // Goes from 0 to 1 (to reach final position)
  // 0.5 stops half way
  let animProgress = 0;
  const animStep = 0.02; // Change in animProgress per interval function invocation.

  const interval = setInterval(() => {
    animProgress += animStep;
    if (animProgress > 1) { animProgress = 1; }
    // Calculate a new viewBox corresponding to our animation progress
    const nextViewBox = [
      oldX + animProgress * (newX - oldX),
      oldY + animProgress * (newY - oldY),
      oldWidth + animProgress * (newWidth - oldWidth),
      oldHeight + animProgress * (newHeight - oldHeight),
    ];
    target.setAttribute('viewBox', nextViewBox.join(' '));
    if (animProgress >= 1) { clearInterval(interval); }
  }, 10);
};

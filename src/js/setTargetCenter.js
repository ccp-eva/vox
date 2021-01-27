export default (target, newViewBox) => {
  const oldX = parseFloat(target.getAttribute('viewBox').split(' ')[0]);
  const oldY = parseFloat(target.getAttribute('viewBox').split(' ')[1]);
  const oldWidth = parseFloat(target.getAttribute('viewBox').split(' ')[2]);
  const oldHeight = parseFloat(target.getAttribute('viewBox').split(' ')[3]);

  const newX = parseFloat(newViewBox.split(' ')[0]);
  const newY = parseFloat(newViewBox.split(' ')[1]);
  const newWidth = parseFloat(newViewBox.split(' ')[2]);
  const newHeight = parseFloat(newViewBox.split(' ')[3]);

  // recursive function for moving the viewBox
  function moveViewBox() {
    const nextViewBox = [
      oldX + (newX - oldX),
      oldY + (newY - oldY),
      oldWidth + (newWidth - oldWidth),
      oldHeight + (newHeight - oldHeight),
    ];
    target.setAttribute('viewBox', nextViewBox.join(' '));
    requestAnimationFrame(moveViewBox);
  }

  // call recursive function once to start process
  requestAnimationFrame(moveViewBox);
};

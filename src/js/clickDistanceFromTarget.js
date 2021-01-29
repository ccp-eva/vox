export default (event, target, outerSVG, responseLog) => {
  const { offsetWidth } = document.body;
  const { offsetHeight } = document.body;
  const origViewBoxWidth = parseFloat(outerSVG.getAttribute('viewBox').split(' ')[2]);
  const origViewBoxHeight = parseFloat(outerSVG.getAttribute('viewBox').split(' ')[3]);

  const windowScaling = { width: origViewBoxWidth / offsetWidth, height: origViewBoxHeight / offsetHeight };

  const clickCoords = {
    x: windowScaling.width * event.offsetX,
    y: windowScaling.height * event.offsetY,
  };
  console.log('');
  console.log('clickCoords', clickCoords);

  const targetCenterX = parseFloat(target.getAttribute('viewBox').split(' ')[0]);
  const targetCenterY = parseFloat(target.getAttribute('viewBox').split(' ')[1]);

  // clicked on target?
  const targetHit = {
    x: -(targetCenterX - target.getBBox().width / 2),
    y: -(targetCenterY - target.getBBox().height / 2),
  };
  console.log('targetHit', targetHit);

  const clickDeviation = {
    x: Math.abs(targetHit.x - clickCoords.x),
    y: Math.abs(targetHit.y - clickCoords.y),
  };
  responseLog.push(clickDeviation);
};

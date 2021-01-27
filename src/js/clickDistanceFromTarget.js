export default (event, target, outerSVG) => {
  const { offsetWidth } = document.body;
  const { offsetHeight } = document.body;
  const origViewBoxWidth = parseFloat(outerSVG.getAttribute('viewBox').split(' ')[2]);
  const origViewBoxHeight = parseFloat(outerSVG.getAttribute('viewBox').split(' ')[3]);

  const windowScaling = { width: origViewBoxWidth / offsetWidth, height: origViewBoxHeight / offsetHeight };
  console.log('sanity check: 1920 - 1080?', offsetWidth * windowScaling.width, offsetHeight * windowScaling.height);
  console.log('');

  // eslint-disable-next-line max-len
  const clickCoords = {
    x: windowScaling.width * event.offsetX,
    y: windowScaling.height * event.offsetY,
  };
  console.log('clickCoords : ', clickCoords);

  // clicked on target?
  const targetCenterX = parseFloat(target.getAttribute('viewBox').split(' ')[0]);
  const targetCenterY = parseFloat(target.getAttribute('viewBox').split(' ')[1]);

  const targetHit = {
    x: -(targetCenterX - target.getBBox().width / 2),
    y: -(targetCenterY - target.getBBox().height / 2),
  };
  console.log('targetHit', targetHit);

  const clickDeviation = {
    x: Math.abs(targetHit.x - clickCoords.x),
    y: Math.abs(targetHit.y - clickCoords.y),
  };
  console.log('distance from target', clickDeviation);
};

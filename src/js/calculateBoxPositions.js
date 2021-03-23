export default () => {
  const b = [];

  // special case for one-box-version
  b.boxes1 = [document.getElementById('boxes1-front')];

  // get all svg elements
  for (let i = 2; i <= 8; i++) {
    b[`boxes${i}`] = Array.from(document.getElementById(`boxes${i}-front`).children);
  }

  // for each box, calculate CenterX and CenterY positions
  const boxCoords = [];
  for (let i = 1; i <= 8; i++) {
    for (let j = 0; j < i; j++) {
      const currentBox = b[`boxes${i}`][j];
      boxCoords[`boxes${i}Box${j + 1}CenterX`] = currentBox.getBBox().x + currentBox.getBBox().width / 2;
      boxCoords[`boxes${i}Box${j + 1}CenterY`] = currentBox.getBBox().y + currentBox.getBBox().height / 2;
    }
  }
  return boxCoords;
};

// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR CALCULATING DISTANCE BETWEEN TWO VIEWBOXES
// ---------------------------------------------------------------------------------------------------------------------
export default (viewBox1, viewBox2) => {
  const x1 = parseFloat(viewBox1.split(' ')[0]);
  const y1 = parseFloat(viewBox1.split(' ')[1]);
  const x2 = parseFloat(viewBox2.split(' ')[0]);
  const y2 = parseFloat(viewBox2.split(' ')[1]);
  return (Math.abs(Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)));
};

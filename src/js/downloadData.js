export default (safe, ID) => {
  const toSave = JSON.stringify(safe, null, 1);
  const day = new Date().toISOString().substr(0, 10);
  // note: it's UTC time (so for germany add +1)
  const time = new Date().toISOString().substr(11, 8);
  console.log(time);

  const hiddenElement = document.createElement('a');
  hiddenElement.href = `data:text/json;charset=utf-8,${encodeURI(toSave)}`;
  hiddenElement.target = '_blank';
  hiddenElement.download = `gazefollowing-${ID}-${day}-${time}.json`;
  hiddenElement.click();
  console.log('downloaded data');
};

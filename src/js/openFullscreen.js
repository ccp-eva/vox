// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR ENFORCING FULLSCREEN
// ---------------------------------------------------------------------------------------------------------------------
export default () => {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
};

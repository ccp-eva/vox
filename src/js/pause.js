// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR LETTING THE BROWSER PAUSE/SLEEP
// with Promise, so that we can wait for it
// ---------------------------------------------------------------------------------------------------------------------
export default (ms) => new Promise((resolve) => setTimeout(resolve, ms));

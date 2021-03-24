// ---------------------------------------------------------------------------------------------------------------------
// PLAYS AUDIO AND RETURNS PROMISE (so that we can await end of audio)
// ---------------------------------------------------------------------------------------------------------------------
export default (audio, button) => new Promise((resolve) => { // return a promise
  button.setAttribute('visibility', 'hidden');
  // for developing, play sound way faster
  // audio.playbackRate = 10;
  audio.play();
  audio.onended = resolve;
});

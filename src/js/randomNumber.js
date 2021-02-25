// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR CALCULATING RANDOM NUMBER
// ---------------------------------------------------------------------------------------------------------------------
// any random number between min (included) and max (not included):
export default (min, max) => Math.random() * (max - min) + min;

// // integer random number between min (included) and max (included):
// export default (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

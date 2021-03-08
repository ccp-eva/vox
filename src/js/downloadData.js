// ---------------------------------------------------------------------------------------------------------------------
// FUNCTION FOR DOWNLOADING DATA LOCALLY; WITH BLOB
// ---------------------------------------------------------------------------------------------------------------------
export default (safe, ID) => {
  fetch('data/data.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: { data: JSON.stringify(safe), subjId: ID },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

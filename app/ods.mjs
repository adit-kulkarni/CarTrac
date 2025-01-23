// Define the API URL
const url = "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/";

// Fetch data from the API
fetch(url)
  .then(response => {
    // Check if the response is successful (status 200)
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse JSON data
  })
  .then(data => {
    // Extract records (assuming records are stored in the 'records' key)
    const records = data.records || [];

    // Loop through the records and log the relevant car information
    records.forEach(record => {
      const fields = record.fields || {};

      // Retrieve car information (make, model, engine, top speed)
      const carMake = fields.make || 'N/A';
      const carModel = fields.model || 'N/A';
      const carEngine = fields.engine || 'N/A';
      const carTopSpeed = fields.top_speed || 'N/A';

      // Log the information to the console
      console.log(`Make: ${carMake}, Model: ${carModel}, Engine: ${carEngine}, Top Speed: ${carTopSpeed}`);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

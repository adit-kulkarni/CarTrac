import axios from "axios";

const OPENDATASOFT_API_URL = "https://public.opendatasoft.com/api/records/1.0/search/";

const fetchCarData = async () => {
  try {
    // Example query for car makes, models, and details
    const response = await axios.get(OPENDATASOFT_API_URL, {
      params: {
        dataset: "all-vehicles-model",
        rows: 500, // Limit the number of results
        facet: "make", // Facet for car makes
      },
    });

    // Extracting car makes from the API response
    const makes = Array.from(new Set(response.data.records.map((record) => record.fields.make)));
    console.log("Car Makes:", makes);

    // Example to fetch models for a specific make
    // const modelsResponse = await axios.get(OPENDATASOFT_API_URL, {
    //   params: {
    //     dataset: "all-vehicles-model",
    //     rows: 10, // Limit the number of results
    //     q: "Toyota", // Query for a specific make
    //   },
    // });

    // const models = modelsResponse.data.records.map((record) => record.fields.model);
    // console.log("Models for Toyota:", models);
  } catch (error) {
    console.error("Error fetching data from OpenDataSoft API:", error.message);
  }
};

// Call the function to test the API
fetchCarData();

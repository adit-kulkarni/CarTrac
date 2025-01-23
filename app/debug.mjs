import axios from "axios";

const loginUrl = 'https://carapi.app/api/auth/login';
const trimsUrl = 'https://carapi.app/api/makes';

const apiToken = '24f1bb06-1bd5-4d03-9b7e-8499342291cd'; // Replace with your API token
const apiSecret = 'bc90cd8e3d8ddd9a6cf482c41b52089c'; // Replace with your API secret

async function authenticateAndFetchTrims() {
  try {
    // Step 1: Authenticate
    console.log('Authenticating...');
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Accept': 'text/plain',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_token: apiToken,
        api_secret: apiSecret,
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Authentication failed: ${loginResponse.statusText}`);
    }

    const jwt = await loginResponse.text();
    console.log('Authentication successful. JWT:', jwt);

    // Step 2: Fetch trims
    console.log('Fetching trims...');
    const trimsResponse = await fetch(trimsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
    });

    if (!trimsResponse.ok) {
      throw new Error(`Failed to fetch trims: ${trimsResponse.statusText}`);
    }

    const trimsData = await trimsResponse.json();
    console.log('Trims data:', trimsData);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

authenticateAndFetchTrims();


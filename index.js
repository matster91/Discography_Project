const express = require('express');
const SpotifyWebApi = require('spotify-web-api-js');

const app = express();
const port = 3000;

// Set up a route for using the access token
app.get('/example', async (req, res) => {
  // Retrieve the access token and refresh token from where you saved them
  const refreshToken = 'AQBQor3h5FjFq6VRYddBnbJe7JbTX_2ilsc3HzMzn5LAzz4-9bAlLDHDePu3p3tqsAhHjXZ2KTjCrN6hXk-khMbW9y63_vnKS2TCXYAiOtRtgEDUNgGbH9t4NnSjiZh17w0';

  // Set up the Spotify Web API instance
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setRefreshToken(refreshToken);

  // Check if the access token is still valid
  try {
    await spotifyApi.getMe();
  } catch (error) {
    // If the access token is invalid, use the refresh token to get a new access token
    if (error.statusCode === 401) {
      try {
        const data = await spotifyApi.refreshAccessToken();
        const newAccessToken = data.body.access_token;
        spotifyApi.setAccessToken(newAccessToken);
      } catch (error) {
        console.error(error);
        res.status(500).send('Failed to refresh access token');
        return;
      }
    } else {
      console.error(error);
      res.status(500).send('Failed to retrieve user data');
      return;
    }
  }

  // Use the access token to make Spotify API requests
  const data = await spotifyApi.getMe();
  console.log('Data:', data);

  res.send('Success!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
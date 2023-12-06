const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

const rapidApiKey = '564ea2c962msh3a29125df3c8c9ep14d798jsnb011c7b66f1b';

app.get('/audio', async (req, res) => {
  try {
    const youtubeVideoId = req.query.id;

    if (!youtubeVideoId) {
      return res.status(400).json({ error: 'Please provide a valid YouTube video ID' });
    }

    const response = await axios.request({
      method: 'GET',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: { id: youtubeVideoId },
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
      },
      responseType: 'stream', // Important for streaming response
    });

    if (response.status === 200) {
      res.header('Content-Disposition', `attachment; filename="audio.mp3"`);
      response.data.pipe(res);
    } else {
      res.status(500).json({ error: 'Failed to fetch audio' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

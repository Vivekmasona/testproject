const express = require('express');
const http = require('http');
const ytdl = require('ytdl-core');
const app = express();
const PORT = 3000;

const rapidApiKey = '564ea2c962msh3a29125df3c8c9ep14d798jsnb011c7b66f1b';

app.get('/audio', async (req, res) => {
  try {
    const youtubeVideoId = req.query.id;

    if (!youtubeVideoId) {
      return res.status(400).json({ error: 'Please provide a valid YouTube video ID' });
    }

    const options = {
      method: 'GET',
      hostname: 'youtube-mp36.p.rapidapi.com',
      path: `/dl?id=${youtubeVideoId}`,
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
      },
    };

    const request = http.request(options, (rapidApiResponse) => {
      if (rapidApiResponse.statusCode === 200) {
        res.header('Content-Disposition', `attachment; filename="audio.mp3"`);
        rapidApiResponse.pipe(res);
      } else {
        res.status(500).json({ error: 'Failed to fetch audio' });
      }
    });

    request.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

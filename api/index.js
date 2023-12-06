const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

// Function to check if the input is a valid YouTube URL
const matchYoutubeUrl = (url) => {
  const pattern = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return !!url.match(pattern) && url.match(pattern)[1];
};

// Route to handle YouTube video conversion using a query parameter
app.get('/convert', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Please provide a YouTube video URL as a query parameter' });
  }

  const newUrl = matchYoutubeUrl(url);

  if (!newUrl) {
    return res.status(400).json({ error: 'Invalid YouTube video URL format' });
  }

  try {
    const response = await axios.request({
      method: 'GET',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: { id: newUrl },
      headers: {
        'X-RapidAPI-Key': 'your-api-key',
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
      }
    });

    if (response.data.status === 'ok') {
      return res.status(200).json(response.data);
    } else {
      if (response.data.status === 'processing') {
        return res.status(400).json({ error: 'Please click "Convert" button or try another link' });
      } else {
        return res.status(400).json({ error: response.data.msg });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


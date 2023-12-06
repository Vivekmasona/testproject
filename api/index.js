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

// Route to handle YouTube video conversion
app.post('/convert', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Please provide a YouTube video URL' });
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
        'X-RapidAPI-Key': '564ea2c962msh3a29125df3c8c9ep14d798jsnb011c7b66f1b',
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


module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const { q, order } = req.query;
    if (!q) return res.status(400).json({ error: 'Missing query' });
    
    /* Return up to 5 results and pick one randomly for variety */
    const maxResults = 5;
    const sortOrder = order || 'relevance';
    const url = 'https://www.googleapis.com/youtube/v3/search'
      + '?part=snippet&type=video&maxResults=' + maxResults
      + '&order=' + sortOrder
      + '&q=' + encodeURIComponent(q)
      + '&key=' + process.env.YOUTUBE_API_KEY;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.items || !data.items.length) {
      return res.status(404).json({ error: 'No results' });
    }
    
    /* Pick random result from top 5 for variety */
    const idx = Math.floor(Math.random() * Math.min(data.items.length, 5));
    const video = data.items[idx];
    
    res.status(200).json({
      videoId: video.id.videoId,
      title: video.snippet.title,
      channel: video.snippet.channelTitle
    });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}

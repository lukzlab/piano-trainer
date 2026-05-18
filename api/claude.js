module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { prompt } = req.body;
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 500, temperature: 0.1 }
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data).substring(0, 300));

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Text extracted:', text.substring(0, 100));

    if (!text) {
      return res.status(500).json({ error: 'Pas de texte extrait', raw: data });
    }

    res.status(200).json({
      choices: [{ message: { content: text } }]
    });

  } catch(err) {
    console.error('Erreur:', err.message);
    res.status(500).json({ error: err.message });
  }
}

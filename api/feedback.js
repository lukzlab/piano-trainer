const fs = require('fs');
const path = require('path');

const FEEDBACK_FILE = path.join(process.cwd(), 'feedback.json');

function readFeedbacks() {
  try {
    if (fs.existsSync(FEEDBACK_FILE)) {
      return JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function writeFeedbacks(feedbacks) {
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2), 'utf8');
}

function getBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch (e) { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      return res.status(200).json(readFeedbacks());
    }

    const body = await getBody(req);

    if (req.method === 'POST') {
      if (!body.text) return res.status(400).json({ error: 'Missing text' });
      const now = new Date();
      const entry = {
        id: body.id || Date.now(),
        text: body.text.trim(),
        date: body.date || now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isoDate: body.isoDate || now.toISOString(),
        treated: false
      };
      const feedbacks = readFeedbacks();
      /* Avoid duplicate if client retries */
      if (!feedbacks.find(f => f.id === entry.id)) {
        feedbacks.unshift(entry);
        writeFeedbacks(feedbacks);
      }
      return res.status(201).json(entry);
    }

    if (req.method === 'PATCH') {
      if (!body.id) return res.status(400).json({ error: 'Missing id' });
      const feedbacks = readFeedbacks();
      const fb = feedbacks.find(f => f.id === Number(body.id));
      if (!fb) return res.status(404).json({ error: 'Not found' });
      fb.treated = !fb.treated;
      writeFeedbacks(feedbacks);
      return res.status(200).json(fb);
    }

    if (req.method === 'DELETE') {
      if (!body.id) return res.status(400).json({ error: 'Missing id' });
      const feedbacks = readFeedbacks().filter(f => f.id !== Number(body.id));
      writeFeedbacks(feedbacks);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).end();
  } catch (e) {
    /* On Vercel (read-only FS), write ops fail — return empty for GET, 503 for mutations */
    if (req.method === 'GET') return res.status(200).json([]);
    return res.status(503).json({ error: 'Storage unavailable (Vercel — use local dev for persistence)', offline: true });
  }
};

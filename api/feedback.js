const fs = require('fs');
const path = require('path');

const FEEDBACK_FILE = path.join(process.cwd(), 'feedback.json');
const GH_TOKEN = process.env.GITHUB_TOKEN;
const GH_OWNER = process.env.GITHUB_OWNER || 'lukzlab';
const GH_REPO = process.env.GITHUB_REPO || 'piano-trainer';
const GH_FILE = 'feedback.json';
const GH_BRANCH = process.env.GITHUB_BRANCH || 'master';
const GH_API = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_FILE}`;

/* ── GitHub API (Vercel) ── */
async function ghRead() {
  const res = await fetch(GH_API + `?ref=${GH_BRANCH}`, {
    headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: 'application/vnd.github.v3+json' }
  });
  if (!res.ok) return { feedbacks: [], sha: null };
  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf8');
  return { feedbacks: JSON.parse(content), sha: data.sha };
}

async function ghWrite(feedbacks, sha) {
  const content = Buffer.from(JSON.stringify(feedbacks, null, 2) + '\n').toString('base64');
  const res = await fetch(GH_API, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GH_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'feedback: mise à jour depuis le site',
      content,
      sha,
      branch: GH_BRANCH
    })
  });
  if (!res.ok) throw new Error(`GitHub write failed: ${res.status}`);
}

/* ── Filesystem (local dev) ── */
function fsRead() {
  try {
    if (fs.existsSync(FEEDBACK_FILE)) return JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
  } catch (e) {}
  return [];
}

function fsWrite(feedbacks) {
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2) + '\n', 'utf8');
}

/* ── Body parser ── */
function getBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch (e) { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}

/* ── Handler ── */
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const useGitHub = !!GH_TOKEN;

  try {
    /* ── GET ── */
    if (req.method === 'GET') {
      if (useGitHub) {
        const { feedbacks } = await ghRead();
        return res.status(200).json(feedbacks);
      }
      return res.status(200).json(fsRead());
    }

    const body = await getBody(req);

    /* ── POST ── */
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
      if (useGitHub) {
        const { feedbacks, sha } = await ghRead();
        if (!feedbacks.find(f => f.id === entry.id)) {
          feedbacks.unshift(entry);
          await ghWrite(feedbacks, sha);
        }
      } else {
        const feedbacks = fsRead();
        if (!feedbacks.find(f => f.id === entry.id)) {
          feedbacks.unshift(entry);
          fsWrite(feedbacks);
        }
      }
      return res.status(201).json(entry);
    }

    /* ── PATCH (toggle treated) ── */
    if (req.method === 'PATCH') {
      if (!body.id) return res.status(400).json({ error: 'Missing id' });
      if (useGitHub) {
        const { feedbacks, sha } = await ghRead();
        const fb = feedbacks.find(f => f.id === Number(body.id));
        if (!fb) return res.status(404).json({ error: 'Not found' });
        fb.treated = !fb.treated;
        await ghWrite(feedbacks, sha);
        return res.status(200).json(fb);
      } else {
        const feedbacks = fsRead();
        const fb = feedbacks.find(f => f.id === Number(body.id));
        if (!fb) return res.status(404).json({ error: 'Not found' });
        fb.treated = !fb.treated;
        fsWrite(feedbacks);
        return res.status(200).json(fb);
      }
    }

    /* ── DELETE ── */
    if (req.method === 'DELETE') {
      if (!body.id) return res.status(400).json({ error: 'Missing id' });
      if (useGitHub) {
        const { feedbacks, sha } = await ghRead();
        await ghWrite(feedbacks.filter(f => f.id !== Number(body.id)), sha);
      } else {
        fsWrite(fsRead().filter(f => f.id !== Number(body.id)));
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(405).end();

  } catch (e) {
    console.error('feedback API error:', e.message);
    if (req.method === 'GET') return res.status(200).json([]);
    return res.status(503).json({ error: e.message });
  }
};

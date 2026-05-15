/* ────────────────────────────────────────────────────────
   scales.js  –  Scales library page logic
   ──────────────────────────────────────────────────────── */
(() => {
  let state = {
    tonic:    'C',
    scaleKey: 'major',
    category: 'Toutes',
  };

  let piano;

  /* ── Bootstrap ── */
  document.addEventListener('DOMContentLoaded', () => {
    buildTonicSelector();
    buildCategoryFilter();
    piano = new PianoKeyboard('scale-piano', { octaves: 2, startOctave: 3 });
    piano.render();
    buildScalesGrid();
    updateDisplay();
  });

  /* ── Tonic selector ── */
  function buildTonicSelector() {
    const el = document.getElementById('tonic-selector');
    MusicData.NOTES.forEach(note => {
      const btn = document.createElement('button');
      btn.className = 'pill' + (note === state.tonic ? ' pill--active' : '');
      btn.textContent = note;
      btn.addEventListener('click', () => {
        state.tonic = note;
        el.querySelectorAll('.pill').forEach(p => p.classList.remove('pill--active'));
        btn.classList.add('pill--active');
        buildScalesGrid();
        updateDisplay();
      });
      el.appendChild(btn);
    });
  }

  /* ── Category filter ── */
  function buildCategoryFilter() {
    const el = document.getElementById('category-filter');
    MusicData.getCategories().forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'pill' + (cat === state.category ? ' pill--active' : '');
      btn.textContent = cat;
      btn.dataset.cat = cat;
      btn.addEventListener('click', () => {
        state.category = cat;
        el.querySelectorAll('.pill').forEach(p => p.classList.remove('pill--active'));
        btn.classList.add('pill--active');
        buildScalesGrid();
        /* keep current scale visible; if filtered out, pick first */
        const scale = MusicData.SCALES[state.scaleKey];
        if (cat !== 'Toutes' && scale && scale.category !== cat) {
          const first = MusicData.getScalesByCategory(cat)[0];
          if (first) state.scaleKey = first[0];
        }
        updateDisplay();
      });
      el.appendChild(btn);
    });
  }

  /* ── Scale grid ── */
  function buildScalesGrid() {
    const grid = document.getElementById('scales-grid');
    grid.innerHTML = '';
    MusicData.getScalesByCategory(state.category).forEach(([key, scale]) => {
      const notes = MusicData.getScaleNotes(state.tonic, key);
      const card = document.createElement('div');
      card.className = 'scale-card' + (key === state.scaleKey ? ' active' : '');
      card.innerHTML = `
        <div class="scale-card__name">${scale.name}</div>
        <div class="scale-card__category">${scale.category}</div>
        <div class="scale-card__notes">
          ${notes.map(n => `<span>${n}</span>`).join('')}
        </div>`;
      card.addEventListener('click', () => {
        state.scaleKey = key;
        grid.querySelectorAll('.scale-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        updateDisplay();
      });
      grid.appendChild(card);
    });
  }

  /* ── Main display update ── */
  function updateDisplay() {
    const scale  = MusicData.SCALES[state.scaleKey];
    const notes  = MusicData.getScaleNotes(state.tonic, state.scaleKey);
    const root   = notes[0];

    /* piano */
    piano.highlight(notes, root);

    /* title */
    document.getElementById('scale-name').textContent =
      `${state.tonic} ${scale.name}`;
    document.getElementById('scale-description').textContent = scale.description;

    /* note badges */
    const badgesEl = document.getElementById('scale-notes');
    badgesEl.innerHTML = notes.map((n, i) => `
      <div class="note-badge ${i === 0 ? 'note-badge--root' : ''}">
        <div class="note-badge__note">${n}</div>
        <div class="note-badge__degree">${scale.degrees[i] ?? ''}</div>
      </div>`).join('');
  }
})();

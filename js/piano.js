/* ────────────────────────────────────────────────────────
   piano.js  –  Reusable piano keyboard component
   ──────────────────────────────────────────────────────── */

/*
  Black key offsets (left edge, as multiple of white-key-width):
  C# = 0.72, D# = 1.72, F# = 3.72, G# = 4.72, A# = 5.72
  Centering formula: position_of_gap - half_black_key_width
  gap after nth white key = n * wkw
  bkw ≈ 0.55 * wkw → half ≈ 0.275
*/
const BLACK_KEY_OFFSETS = {
  'C#': 0.72, 'D#': 1.72, 'F#': 3.72, 'G#': 4.72, 'A#': 5.72
};
const WHITE_NOTES  = ['C','D','E','F','G','A','B'];

class PianoKeyboard {
  constructor(containerId, options = {}) {
    this.container = typeof containerId === 'string'
      ? document.getElementById(containerId)
      : containerId;
    this.octaves      = options.octaves    ?? 2;
    this.startOctave  = options.startOctave ?? 4;
    this.onKeyClick   = options.onKeyClick  ?? null;
    this._active = new Set();  // highlighted notes (not root)
    this._roots  = new Set();  // root / tonic notes
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.container.className = 'piano';
    const inner = document.createElement('div');
    inner.className = 'piano__inner';
    for (let o = this.startOctave; o < this.startOctave + this.octaves; o++) {
      inner.appendChild(this._buildOctave(o));
    }
    this.container.appendChild(inner);
  }

  _buildOctave(oct) {
    const wrap = document.createElement('div');
    wrap.className = 'piano__octave';

    WHITE_NOTES.forEach(n => {
      const key = this._makeKey(n, oct, 'white');
      if (n === 'C') {
        const lbl = document.createElement('span');
        lbl.className = 'piano__label';
        lbl.textContent = `C${oct}`;
        key.appendChild(lbl);
      }
      wrap.appendChild(key);
    });

    Object.entries(BLACK_KEY_OFFSETS).forEach(([n, offset]) => {
      const key = this._makeKey(n, oct, 'black');
      key.style.setProperty('--bk-offset', offset);
      wrap.appendChild(key);
    });

    return wrap;
  }

  _makeKey(note, octave, type) {
    const key = document.createElement('div');
    key.className = `piano__key piano__key--${type}`;
    key.dataset.note   = note;
    key.dataset.octave = octave;
    this._applyState(key, note);
    if (this.onKeyClick) {
      key.addEventListener('click', e => {
        e.stopPropagation();
        this.onKeyClick(note, octave);
      });
    }
    return key;
  }

  _applyState(key, note) {
    key.classList.toggle('piano__key--root',   this._roots.has(note));
    key.classList.toggle('piano__key--active',
      this._active.has(note) && !this._roots.has(note));
  }

  /* highlight(notes, rootNote?)
     rootNote gets a distinct colour; remaining notes in _active */
  highlight(notes, rootNote = null) {
    this._active = new Set(notes);
    this._roots  = rootNote ? new Set([rootNote]) : new Set();
    this._refresh();
  }

  _refresh() {
    if (!this.container) return;
    this.container.querySelectorAll('.piano__key').forEach(key => {
      this._applyState(key, key.dataset.note);
    });
  }

  clear() {
    this._active.clear();
    this._roots.clear();
    this._refresh();
  }
}

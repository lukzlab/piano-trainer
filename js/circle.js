/* ────────────────────────────────────────────────────────
   circle.js  –  Circle of fifths SVG + interaction
   ──────────────────────────────────────────────────────── */
(() => {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const CX = 300, CY = 300;
  const R_OUTER2 = 275, R_OUTER1 = 195;   // major ring
  const R_INNER2 = 193, R_INNER1 = 125;   // minor ring
  const R_CENTER = 123;                   // center disc

  const COL_MAJOR_DEFAULT   = '#EDE9FF';
  const COL_MAJOR_HOVER     = '#D5CEFF';
  const COL_MAJOR_SELECTED  = '#7F77DD';
  const COL_MINOR_DEFAULT   = '#EDF8D8';
  const COL_MINOR_HOVER     = '#D0EFA8';
  const COL_MINOR_SELECTED  = '#97C459';
  const COL_CENTER          = '#F8F8FC';
  const COL_BORDER          = '#FFFFFF';

  let selectedIdx = 0;
  let piano;

  /* ── helpers ── */
  function polar(cx, cy, r, angleDeg) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function sectorPath(r1, r2, startDeg, endDeg) {
    const s1 = polar(CX, CY, r2, startDeg);
    const e1 = polar(CX, CY, r2, endDeg);
    const s2 = polar(CX, CY, r1, endDeg);
    const e2 = polar(CX, CY, r1, startDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return [
      `M ${s1.x} ${s1.y}`,
      `A ${r2} ${r2} 0 ${large} 1 ${e1.x} ${e1.y}`,
      `L ${s2.x} ${s2.y}`,
      `A ${r1} ${r1} 0 ${large} 0 ${e2.x} ${e2.y}`,
      'Z'
    ].join(' ');
  }

  function midPoint(r, startDeg, endDeg) {
    return polar(CX, CY, r, (startDeg + endDeg) / 2);
  }

  function svgEl(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }

  /* ── Build SVG ── */
  function buildCircle() {
    const svg = document.getElementById('circle-svg');
    svg.innerHTML = '';

    /* Gradient defs */
    const defs = svgEl('defs', {});
    svg.appendChild(defs);

    /* Center circle */
    const center = svgEl('circle', {
      cx: CX, cy: CY, r: R_CENTER,
      fill: COL_CENTER, stroke: COL_BORDER, 'stroke-width': 2
    });
    svg.appendChild(center);

    const centerText = svgEl('text', {
      x: CX, y: CY - 8,
      class: 'cof-text',
      'font-size': 13,
      fill: '#999',
    });
    centerText.textContent = 'Cercle des';
    svg.appendChild(centerText);

    const centerText2 = svgEl('text', {
      x: CX, y: CY + 12,
      class: 'cof-text',
      'font-size': 13,
      fill: '#999',
    });
    centerText2.textContent = 'quintes';
    svg.appendChild(centerText2);

    const GAP_DEG = 0.8;
    const SEGMENT = 30;

    MusicData.CIRCLE_OF_FIFTHS.forEach((entry, i) => {
      const startDeg = i * SEGMENT + GAP_DEG / 2;
      const endDeg   = (i + 1) * SEGMENT - GAP_DEG / 2;

      /* Major sector */
      const majorPath = svgEl('path', {
        d:      sectorPath(R_OUTER1, R_OUTER2, startDeg, endDeg),
        fill:   i === selectedIdx ? COL_MAJOR_SELECTED : COL_MAJOR_DEFAULT,
        stroke: COL_BORDER,
        'stroke-width': 1.5,
        class: 'cof-sector',
        'data-idx': i,
        'data-ring': 'major',
      });

      /* Minor sector */
      const minorPath = svgEl('path', {
        d:      sectorPath(R_INNER1, R_INNER2, startDeg, endDeg),
        fill:   i === selectedIdx ? COL_MINOR_SELECTED : COL_MINOR_DEFAULT,
        stroke: COL_BORDER,
        'stroke-width': 1.5,
        class: 'cof-sector',
        'data-idx': i,
        'data-ring': 'minor',
      });

      /* Major label */
      const mMid = midPoint((R_OUTER1 + R_OUTER2) / 2, startDeg, endDeg);
      const majorLabel = svgEl('text', {
        x: mMid.x, y: mMid.y,
        class: 'cof-text',
        'font-size': 15,
        fill: i === selectedIdx ? '#fff' : '#1A1A2E',
      });
      majorLabel.textContent = entry.major;

      /* Minor label */
      const nMid = midPoint((R_INNER1 + R_INNER2) / 2, startDeg, endDeg);
      const minorLabel = svgEl('text', {
        x: nMid.x, y: nMid.y,
        class: 'cof-text',
        'font-size': 10,
        fill: i === selectedIdx ? '#fff' : '#6B6B8A',
      });
      minorLabel.textContent = entry.minor;

      /* Hover effect + click */
      [majorPath, minorPath].forEach(path => {
        path.addEventListener('mouseenter', () => {
          if (i !== selectedIdx) {
            path.getAttribute('data-ring') === 'major'
              ? (majorPath.setAttribute('fill', COL_MAJOR_HOVER))
              : (minorPath.setAttribute('fill', COL_MINOR_HOVER));
          }
        });
        path.addEventListener('mouseleave', () => {
          if (i !== selectedIdx) {
            majorPath.setAttribute('fill', COL_MAJOR_DEFAULT);
            minorPath.setAttribute('fill', COL_MINOR_DEFAULT);
          }
        });
        path.addEventListener('click', () => selectKey(i));
      });

      svg.appendChild(majorPath);
      svg.appendChild(minorPath);
      svg.appendChild(majorLabel);
      svg.appendChild(minorLabel);
    });
  }

  /* ── Select a key ── */
  function selectKey(idx) {
    selectedIdx = idx;
    buildCircle();             // rebuild to update colours
    updateInfo();
  }

  /* ── Info panel ── */
  function updateInfo() {
    const entry = MusicData.CIRCLE_OF_FIFTHS[selectedIdx];
    const noteIdx = entry.noteIndex;
    const root  = MusicData.NOTES[noteIdx];
    const notes = MusicData.getScaleNotes(root, 'major');
    const scale = MusicData.SCALES.major;

    document.getElementById('info-major').textContent = `${entry.major} Majeur`;
    document.getElementById('info-minor').textContent = `${entry.minor} (relative mineure)`;
    document.getElementById('info-acc').textContent   = entry.accLabel;

    /* Note badges */
    const notesEl = document.getElementById('info-notes');
    notesEl.innerHTML = notes.map((n, i) => `
      <div class="note-badge ${i === 0 ? 'note-badge--root' : ''}">
        <div class="note-badge__note">${n}</div>
        <div class="note-badge__degree">${scale.degrees[i]}</div>
      </div>`).join('');

    /* Piano */
    piano.highlight(notes, notes[0]);
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    piano = new PianoKeyboard('circle-piano', {
      octaves: 1, startOctave: 4,
    });
    piano.render();
    buildCircle();
    updateInfo();
  });
})();

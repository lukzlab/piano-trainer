/* ────────────────────────────────────────────────────────
   music-data.js  –  All static musical data
   ──────────────────────────────────────────────────────── */
const MusicData = (() => {

  const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

  const NOTE_FR = {
    'C':'Do','C#':'Do#','D':'Ré','D#':'Ré#','E':'Mi',
    'F':'Fa','F#':'Fa#','G':'Sol','G#':'Sol#','A':'La','A#':'La#','B':'Si'
  };

  const INTERVAL_NAMES = [
    'Tonique','2nde m.','2nde M.','3ce m.','3ce M.',
    'Quarte','Triton','Quinte','6te m.','6te M.','7ème m.','7ème M.'
  ];

  const SCALES = {
    major: {
      name: 'Majeure', nameEn: 'Major', category: 'Diatonique',
      intervals: [0,2,4,5,7,9,11],
      degrees:   ['I','II','III','IV','V','VI','VII'],
      description: 'La gamme la plus fondamentale de la musique occidentale. Son caractère est lumineux, positif et stable.'
    },
    naturalMinor: {
      name: 'Mineure naturelle', nameEn: 'Natural Minor', category: 'Diatonique',
      intervals: [0,2,3,5,7,8,10],
      degrees:   ['I','II','♭III','IV','V','♭VI','♭VII'],
      description: 'Aussi appelée mode éolien. Son caractère sombre et mélancolique en fait une des gammes les plus expressives.'
    },
    harmonicMinor: {
      name: 'Mineure harmonique', nameEn: 'Harmonic Minor', category: 'Diatonique',
      intervals: [0,2,3,5,7,8,11],
      degrees:   ['I','II','♭III','IV','V','♭VI','VII'],
      description: 'Mineure naturelle avec septième rehaussée. Très utilisée en musique classique et en flamenco.'
    },
    melodicMinor: {
      name: 'Mineure mélodique', nameEn: 'Melodic Minor', category: 'Diatonique',
      intervals: [0,2,3,5,7,9,11],
      degrees:   ['I','II','♭III','IV','V','VI','VII'],
      description: 'Mineure avec sixte et septième rehaussées en montant. Base incontournable du jazz moderne.'
    },
    pentatonicMajor: {
      name: 'Pentatonique majeure', nameEn: 'Major Pentatonic', category: 'Pentatonique',
      intervals: [0,2,4,7,9],
      degrees:   ['I','II','III','V','VI'],
      description: '5 notes de la gamme majeure (sans IV ni VII). Présente dans toutes les musiques du monde, très accessible.'
    },
    pentatonicMinor: {
      name: 'Pentatonique mineure', nameEn: 'Minor Pentatonic', category: 'Pentatonique',
      intervals: [0,3,5,7,10],
      degrees:   ['I','♭III','IV','V','♭VII'],
      description: 'Base absolue du blues et du rock. 5 notes qui sonnent juste sur pratiquement tout accord.'
    },
    blues: {
      name: 'Blues', nameEn: 'Blues', category: 'Blues',
      intervals: [0,3,5,6,7,10],
      degrees:   ['I','♭III','IV','♭V','V','♭VII'],
      description: 'Pentatonique mineure + blue note (♭5). La "note bleue" crée cette tension si caractéristique du blues.'
    },
    dorian: {
      name: 'Dorien', nameEn: 'Dorian', category: 'Modal',
      intervals: [0,2,3,5,7,9,10],
      degrees:   ['I','II','♭III','IV','V','VI','♭VII'],
      description: 'Mode mineur avec sixte majeure, ce qui lui donne une couleur plus lumineuse. Populaire en jazz et en musique celtique.'
    },
    phrygian: {
      name: 'Phrygien', nameEn: 'Phrygian', category: 'Modal',
      intervals: [0,1,3,5,7,8,10],
      degrees:   ['I','♭II','♭III','IV','V','♭VI','♭VII'],
      description: 'Mode mineur avec seconde mineure. Son caractère oriental et intense le rend populaire en flamenco et en métal.'
    },
    lydian: {
      name: 'Lydien', nameEn: 'Lydian', category: 'Modal',
      intervals: [0,2,4,6,7,9,11],
      degrees:   ['I','II','III','♯IV','V','VI','VII'],
      description: 'Mode majeur avec quarte augmentée. Son caractère rêveur et flottant est très utilisé en musique de film.'
    },
    mixolydian: {
      name: 'Mixolydien', nameEn: 'Mixolydian', category: 'Modal',
      intervals: [0,2,4,5,7,9,10],
      degrees:   ['I','II','III','IV','V','VI','♭VII'],
      description: 'Mode majeur avec septième mineure. Omniprésent dans le rock, le blues et la musique folk.'
    },
    locrian: {
      name: 'Locrien', nameEn: 'Locrian', category: 'Modal',
      intervals: [0,1,3,5,6,8,10],
      degrees:   ['I','♭II','♭III','IV','♭V','♭VI','♭VII'],
      description: 'Le mode le plus instable avec sa quinte diminuée. Très rare, utilisé principalement en jazz et métal progressif.'
    },
  };

  /* Circle of fifths — clockwise from C (top) */
  const CIRCLE_OF_FIFTHS = [
    { major:'C',   minor:'Am',  acc:  0, noteIndex: 0, accLabel: '0 altération'  },
    { major:'G',   minor:'Em',  acc:  1, noteIndex: 7, accLabel: '1 dièse ♯'     },
    { major:'D',   minor:'Bm',  acc:  2, noteIndex: 2, accLabel: '2 dièses ♯♯'   },
    { major:'A',   minor:'F#m', acc:  3, noteIndex: 9, accLabel: '3 dièses'       },
    { major:'E',   minor:'C#m', acc:  4, noteIndex: 4, accLabel: '4 dièses'       },
    { major:'B',   minor:'G#m', acc:  5, noteIndex:11, accLabel: '5 dièses'       },
    { major:'F#',  minor:'D#m', acc:  6, noteIndex: 6, accLabel: '6 ♯ / 6 ♭'      },
    { major:'D♭',  minor:'B♭m', acc: -5, noteIndex: 1, accLabel: '5 bémols'       },
    { major:'A♭',  minor:'Fm',  acc: -4, noteIndex: 8, accLabel: '4 bémols'       },
    { major:'E♭',  minor:'Cm',  acc: -3, noteIndex: 3, accLabel: '3 bémols'       },
    { major:'B♭',  minor:'Gm',  acc: -2, noteIndex:10, accLabel: '2 bémols ♭♭'   },
    { major:'F',   minor:'Dm',  acc: -1, noteIndex: 5, accLabel: '1 bémol ♭'      },
  ];

  /* ── helpers ── */
  function getScaleNotes(rootNote, scaleType) {
    const scale = SCALES[scaleType];
    if (!scale) return [];
    const rootIdx = NOTES.indexOf(rootNote);
    if (rootIdx === -1) return [];
    return scale.intervals.map(i => NOTES[(rootIdx + i) % 12]);
  }

  function getCategories() {
    const cats = new Set(Object.values(SCALES).map(s => s.category));
    return ['Toutes', ...cats];
  }

  function getScalesByCategory(category) {
    if (category === 'Toutes') return Object.entries(SCALES);
    return Object.entries(SCALES).filter(([,s]) => s.category === category);
  }

  return {
    NOTES, NOTE_FR, INTERVAL_NAMES, SCALES,
    CIRCLE_OF_FIFTHS, getScaleNotes, getCategories, getScalesByCategory
  };
})();

---
name: features-overview
description: "Synthèse complète des fonctionnalités de Piano Lab — référence d'audit"
metadata:
  type: project
  updated: 2026-05-24
---

# Piano Lab — Vue d'ensemble des fonctionnalités

> App single-file : `e:\Piano-Lab\index.html` (~5100 lignes)
> Backend : serveur Node local exposant `/api/claude` (LLM) et `/api/youtube` (recherche YT)
> Repo : `lukzlab/piano-trainer` (GitHub)

---

## 1. Auth Gate

**Accès :** au chargement de la page, avant tout contenu.

- Écran de connexion plein écran (fond sombre)
- Mot de passe hardcodé en base64 dans le code : `_AP = atob('cGlhbm9sYWI=')` → `pianolab`
- Validation stockée en `localStorage` clé `pl_auth = '1'` → login persistant par navigateur
- Raccourci clavier : `Entrée` soumet le formulaire
- Message d'erreur animé sur mauvais mot de passe

---

## 2. Structure générale de l'interface

```
┌─────────────────────────────────────────────────────────────┐
│ Top Bar : Play · BPM · Métronome · Style · Backing Track YT │
│           [caché quand Practice est ouvert]                  │
├──────────┬──────────────────────────────────────────────────┤
│ Sidebar  │  Colonne gauche   │   Panneau principal (droite)  │
│          │  COF (cercle)     │   Vue Gamme ou Progression    │
│          │  Piano clavier    │                               │
└──────────┴───────────────────┴───────────────────────────────┘
```

**Panneau Practice** : overlay fixe `position:fixed;right:0` qui s'ouvre par-dessus le layout principal.

---

## 3. Sidebar

- Logo cliquable → déplier/replier la sidebar
- **Section Explorer :** liste des progressions personnalisées sauvegardées + bouton Practice
- **Section Entrée :** bouton Importer (recherche AI)
- Bouton réduire/développer avec animation

---

## 4. Top Bar Audio

Masquée quand le panneau Practice est ouvert (`body:has(.practice-overlay.open) #atb-left { display:none }`).

| Élément | Fonction |
|---|---|
| Bouton ▶ | Play/pause lecture audio (gamme, accord ou progression) |
| BPM slider | Tempo global 60–180 BPM |
| Bouton métronome | On/off métronome |
| Slider volume métronome | Contrôle `_metroVol` (0–1) |
| Select STYLE | Style backing track YT : Pad, Jazz, Bossa, Funk, Rock, Blues, Latin, R&B, Drums |
| Bouton Backing track YT | Ouvre le module YouTube (dans Practice si ouvert) |
| Toggle Lecture son auto | Active/désactive `_autoSound` — joue un son sur chaque sélection |
| Toggle Infos suppl. | Affiche/masque les labels pédagogiques sur la COF |
| Bouton thème | Bascule Light ↔ Graphite |
| Bouton Réglages | Ouvre le drawer de paramètres |
| Date MAJ GitHub | `"dernière MAJ à: jj/mm/aa hh:mm"` en vert — cache localStorage `gh_update_date` |

---

## 5. Drawer de réglages (panneau glissant)

- **Section Lecture :** tempo slider, mesure (2/4, 4/4, 3/4), toggle auto-son
- **Section Métronome :** timbre (Triangle/Woodblock/Click/Cloche/Percussion), volume
- **Section Backing harmonique :** styles (Pad/Jazz/Bossa/Funk), volume — lecteur d'accords/gammes en boucle via Web Audio (différent du backing YT)

---

## 6. Cercle des Quintes (COF)

Élément SVG central dessiné dynamiquement via `drawCOF()`.

### Logique visuelle
- Anneau extérieur : gammes **majeures** (12 segments)
- Anneau intérieur : gammes **mineures relatives** (12 segments)
- Navigation par flèches latérales : ← quarte descendante / → quinte ascendante (`navigateCircle`)
- Couleurs : tonique (ocre/doré), notes dans la gamme (bg3), accord sélectionné (chord-sel), hors gamme (neutre)
- Mode pédagogique : labels avec nom de la gamme relative au centre

### Interactions
- **Clic segment** : change la tonique (`st.root`) → redessine tout via `updateAll()`
- **Clic anneau mineur** : change vers la gamme mineure relative
- **Drag depuis la COF → Practice overlay** :
  - Pointer Events (`pointerdown/move/up`, `setPointerCapture`)
  - Ghost div coloré qui suit le curseur/doigt
  - Seuil 8px : tap = changement gamme, drag = ajout accord à la séquence practice
  - `touch-action:none` sur `#cof` → tablette OK

---

## 7. Piano virtuel

Construit dynamiquement via `buildPiano()`. Étendue configurée par `MIDI_START=36, MIDI_END=71` (3 octaves par défaut, ajustable −/+).

### Modes
| Mode | Comportement d'un clic |
|---|---|
| **Gamme** | Toute touche change la tonique (`st.root`) |
| **Accord** | Touche dans la gamme → sélectionne l'accord du degré correspondant |

### Affichage
- Notes colorées selon leur rôle : tonique (ocre), dans la gamme (clair), accord sélectionné (chord-sel)
- Labels octave (C2, C3, C4)
- Sous-titre : nom de l'accord + notes (ex : `Am7 : A - C - E - G`)
- Boutons enrichissements contextuels sous le clavier (voir §10)

### Inversions
- Boutons `⟨ ⟩` pour cycler les inversions de l'accord actif
- `_pianoInvPos` mémorise l'inversion courante
- Label d'inversion affiché (`root position`, `1st inv.`…)

### Contrôles
- Nb d'octaves : −/+ (min 1, max 5)
- Bascule mode Gamme / Accord

---

## 8. Panneau principal (droite)

Deux onglets :
- **Vue Gamme** (`st.viewMode = 'scale'`)
- **Vue Progression** (`st.viewMode = 'prog'`)

### Vue Gamme

- Sélecteur de gamme : boutons (Majeure, Min. nat., Min. harm., Min. mel., Dorien, Phrygien, Lydien, Mixolydien, Penta maj., Penta min., Blues)
- Texte harmonique descriptif (`SCALE_HARMONY[scale.id]`)
- **Grille des degrés** : I à VII avec :
  - Nom romain + type (M / m / ° / +)
  - Nom de l'accord + fonction (Tonique, Sous-dominante, Dominante…)
  - Degré selectionné : affiche les enrichissements disponibles
  - Clic → met en évidence sur le piano et la COF, joue l'accord (si auto-son actif)
- Popup sélecteur de gamme (bouton flottant sur COF)

### Vue Progression

Onglet Progressions avec deux sous-sections :

**Progressions standard (10 au total)**

| Nom | Catégorie |
|---|---|
| I-V-VI-IV | Pop |
| I-IV-V | Pop |
| VI-IV-I-V | Pop |
| I-VI-IV-V | Pop |
| II-V-I | Jazz |
| I-VI-II-V | Jazz |
| I-IV-I-V | Blues |
| I-III-IV-V | Rock |
| II-IV-I | Soul |
| I-IV-VI-V | Gospel |

- Morceaux connus associés à chaque progression (`PROG_SONGS`)
- Clic sur un accord de la progression → affiche sur piano + COF + joue
- Enrichissements par étape (stockés dans `stdProg.enrichPerStep`)
- Inversions par étape (`stdProg.invPerStep`)

**Progressions personnalisées**

- Créées depuis le mode Build ou importées depuis une fiche morceau
- Sauvegardées en `localStorage` clé `piano_trainer_progs`
- Affiché dans la sidebar et dans le quick panel
- Suppression individuelle

---

## 9. Module Build (constructeur de progressions)

- Bouton "Construire" dans le panneau prog
- Mode build : cliquer sur les degrés de la gamme pour les ajouter à la séquence
- Sélection d'enrichissement par accord
- Nommage de la progression
- Sauvegarde → ajoutée aux progressions personnalisées

---

## 10. Enrichissements d'accords

Disponibles depuis :
- Le panneau gamme (degré actif)
- Le panneau progression (accord actif)
- Le panneau Practice (accord affiché)
- Les boutons sous le piano (contextuels)

| Groupe | Enrichissements |
|---|---|
| Maj | Maj7, add9, 6, sus2, sus4 |
| Dom (V degré) | 7, 9, 11, 13, 7sus4 |
| Min | min7, min9, min11, mMaj7 |
| Dim | Dim7, m7b5 |
| Aug | Aug7 |

Chaque enrichissement modifie les notes MIDI affichées sur le piano et jouées.

---

## 11. Module Import (recherche IA)

Entrée : sidebar bouton "Importer", ou raccourci dans le panneau.

### Flux artiste
1. Saisir un nom d'artiste
2. API `/api/claude` → prompt structuré → JSON avec 5 morceaux + accords
3. Liste de résultats → clic → fiche morceau

### Flux morceau
1. Saisir "Titre - Artiste"
2. API `/api/claude` → JSON structuré avec sections (Intro, Couplet, Refrain, Bridge, Solo, Outro)
3. Affichage direct de la fiche morceau

### Résultats rapides (quickImport)
- Boutons prédéfinis dans la modale pour des artistes/morceaux fréquents

---

## 12. Fiche Morceau (Song Detail Panel)

S'ouvre en remplacement du panneau principal.

- Titre, artiste, tonalité, BPM
- **Barre de transposition** : 12 boutons (C à B), transpose toute la fiche
- **Bouton "Pratiquer ce morceau"** → ouvre Practice avec la séquence du morceau (source = 'song')
- **Sections dépliables** : Intro, Couplet, Refrain, Bridge, Solo, Outro…
  - Clic section → affiche accords sur COF + piano
  - Clic accord individuel (chip) → joue l'accord + highlight piano/COF
  - Note descriptive de la section
- **Bouton "Enregistrer la section comme progression"** → ajoute aux progressions custom
- **Section YouTube** : bouton "Charger le morceau" → recherche YT automatique et embed

---

## 13. Mode Practice (overlay)

Hub central d'entraînement. `position:fixed;right:0;width:var(--rp-width)`.

### Ouverture
- Depuis sidebar (bouton Practice) → séquence basée sur gamme courante
- Depuis fiche morceau → séquence de la section active
- Depuis bouton Backing Track → ouvre Practice + section YT immédiatement
- À l'ouverture → `_setPianoMode('accord')` + piano sync accord courant
- À la fermeture → `_setPianoMode('gamme')` + piano nettoyé

### Contenu du panneau (de haut en bas)
1. Bouton Fermer (✕)
2. Titre (gamme ou morceau)
3. Nom de section
4. Affichage accord : **précédent** · **COURANT** · **suivant**
5. **Ligne enrichissements** : boutons contextuels (Maj/Maj7/add9… ou Min/Min7…)
6. Indicateur de beat (points animés)
7. Contrôles : BPM −/+ · ▶/⏸ · Mesure −/+
8. Bouton ⏮ (rembobine YT au début) + Bouton TAP
9. Prog dots (position dans la séquence)
10. **Section Séquence** : pills drag&drop + ✕ retirer + ↺ reset
11. **Section Outils** : métronome (on/off + volume) + select style + bouton Backing Track
12. **Section YouTube** (si active) : iframe + titre + "⟳ Autres vidéos" + picker

### Logique de lecture
| État | Comportement |
|---|---|
| `practiceToggle()` | Play/pause practice + contrôle YT simultané |
| Beat 0 (début mesure) | Avance à l'accord suivant + joue l'accord (Web Audio) |
| Chaque beat | Click métronome (timbre + volume configurables) |
| Volume = 0 | Silence total (early return dans `_playNote` et `_metroClick`) |

### Raccourcis clavier (quand Practice est ouvert)
| Touche | Action |
|---|---|
| `Espace` | Tap Tempo |
| `Entrée` | Play / Pause |

### Tap Tempo
- Bouton TAP + touche `Espace` + MIDI note-on (si clavier connecté)
- Taps enregistrés (max 8, fenêtre de 2,5s)
- BPM calculé **à la fin de la session de taps** (pas en temps réel)
- Arrondi à la dizaine la plus proche
- Appliqué à practice + sync YT si en lecture

### Séquence éditable
- Drag & drop HTML5 natif pour réordonner les pills
- Bouton ✕ par pill pour retirer un accord
- Bouton ↺ reset → revient à `allChords` (snapshot d'origine)
- COF → Practice : drag depuis n'importe quel segment → ajoute l'accord

### Enrichissements (bidirectionnel)
- `_getActiveChord()` retourne le contexte practice en priorité si overlay ouvert
- `_setPianoEnrich(eid)` met à jour `ch.enrich`, `ch.label`, `ch.midis`
- Piano et practice restent synchronisés

### Synchronisation gamme
- `_practiceRebuildIfOpen()` appelé depuis `updateAll()` : rebuild auto de la séquence si gamme/tonique change sur la roue et `source !== 'song'`

---

## 14. Module Backing Track YouTube

### Flux d'ouverture
1. 5 recherches parallèles sur les variantes (root + genre + style + BPM + time sig)
2. **Picker direct** : liste de vidéos avec badge `cfg ✓` (vert) si config sauvegardée
3. Sélection → iframe chargée en **pause** (`autoplay=0`)
4. Le bouton ▶ Practice démarre la vidéo en même temps que la séquence

### Variantes de recherche
```
"{root} {genre} {sig}backing track {style} {bpm} bpm"
"{root} {genre} jam track {style}"
"{style} {sig}backing track {root} {genre} {bpm}bpm"
"{root} {genre} play along {style} piano"
"{genre} {sig}backing track {root} {style} live"
```

### Styles disponibles
Pad, Jazz, Bossa, Funk, Rock, Blues, Latin, R&B, Drums → mapping YT dans `_ytBackingStyles`

### Analyse automatique de la description YT (`_parseYtMetadata`)
Détecte dans titre + description :
- **Tonalité** : patterns `key of X Y`, `in X Y`, `X Y backing`, `Xm backing track`
- **Progression** : lignes avec ≥ 2 accords valides et densité ≥ 40%
- **BPM** : regex `/\b(\d{2,3})\s*bpm\b/i` → arrondi à la dizaine

`_applyYtMetadata(meta)` → applique root/scale + chords + BPM au practice, affiche "Auto: ..."

### Persistance par vidéo (`yt_cfg_<videoId>` — localStorage)
Sauvegarde : `{root, scale, chords, bpm}`
Déclencheurs de sauvegarde :
- Changement BPM manuel (`practiceChangeBpm`)
- Fin session tap tempo (`_tapTimer`)
- Enrichissement d'accord (`_setPianoEnrich` mode practice)
- Drop depuis COF (`_cofDragEnd`)
- Réordonnancement pill (dragdrop)
- Suppression accord (`practiceSeqRemove`)
- Reset séquence (`_practiceResetSeq`)

Restauration : au clic sur une vidéo dans le picker → si config trouvée → applique directement (skip auto-parse).

### Contrôles YT synchronisés avec Practice
| Action Practice | Effet YT |
|---|---|
| ▶ Play | `playVideo` via postMessage |
| ⏸ Pause | `pauseVideo` via postMessage |
| Fermer Practice | `pauseVideo` |
| Rouvrir Practice | `playVideo` si était en lecture |
| Bouton ⏮ | `seekTo(0, true)` + `pauseVideo` |

---

## 15. Module Écoute (Ear Training)

Accessible depuis le panneau principal (onglet ou bouton dédié).

### Niveaux
| Niveau | Exercice |
|---|---|
| 1 | Identifier la tonique d'une gamme (6 choix parmi 12) |
| 2 | Identifier le mode : Majeur, Mineur nat., Dorien, Phrygien, Lydien, Mixolydien (aléatoire) |
| 3 | Identifier la progression parmi 4 propositions |

- Feedback immédiat correct/incorrect
- Hint affiché sous la question
- Bouton "Suivant" → nouvelle question

---

## 16. Module Audio (Web Audio API)

### Métronome
- 5 timbres : Triangle, Woodblock, Click, Cloche, Percussion
- Lecture temps fort/faible différenciée (accent sur beat 0)
- `_metroVol` contrôle le volume (partagé avec le son d'accord)
- Mesures : 2/4, 3/4, 4/4, 6/8

### Sons d'accords
- `_playNote(midi, when, dur)` : synthèse additive (4 harmoniques, type sine, gain envelope)
- `_playChord(midis, when, withDecay)` : joue un tableau de notes simultanément
- `_playScale()` : gamme ascendante note par note
- `_playProgression()` : séquence d'accords au tempo courant
- Tous respectent `_metroVol` → volume 0 = silence (early return)

### Backing harmonique (drawer)
- `btToggle()` : play/pause backing pad
- Styles : Pad, Jazz, Bossa, Funk (rendu Web Audio, différent du YT)
- Volume séparé (`bt-vol`)

---

## 17. Thèmes

| Thème | Classe body | Description |
|---|---|---|
| Light | `body.light` | Fond blanc, accents chauds |
| Graphite | `body.graphite` | Fond sombre, teintes neutres |

Basculé avec `toggleTheme()`, sauvegardé dans `localStorage` clé `piano_trainer_theme`.
Variables CSS : `--bg`, `--bg2`, `--bg3`, `--surface`, `--text`, `--text2`, `--text3`, `--accent`, `--tonic`, `--tonic-bg`, `--chord-sel`, `--cof-border`, `--border`, `--border2`.

---

## 18. État global

```js
var st = { root: 0, scale: 'major', viewMode: 'scale' };

var _practiceState = {
  playing: false, chords: [], allChords: [],
  idx: 0, beat: 0, sig: 4, bpm: 120, timer: null, source: null
};

var _cofDrag = { active, dragging, startX, startY, chord, ghost };
var _ytSearchCtx = { root, genre, style, bpm, variants };
var _ytCurrentVideoId = null;
var _metroVol = 0.5;  // 0–1, contrôle métronome + sons d'accords
var _audioBpm = 120;
var _autoSound = false;
```

---

## 19. API Backend

| Endpoint | Usage |
|---|---|
| `POST /api/claude` | LLM — import morceau/artiste, analyse harmonique |
| `GET /api/youtube?q=...` | Recherche YT — retourne `{videoId, title, description}` |

---

## 20. Persistance localStorage

| Clé | Contenu |
|---|---|
| `piano_trainer_theme` | `'light'` ou `'graphite'` |
| `piano_trainer_progs` | JSON des progressions personnalisées |
| `gh_update_date` | Cache de la date de dernier commit GitHub |
| `pl_auth` | `'1'` si authentifié |
| `yt_cfg_<videoId>` | `{root, scale, chords, bpm}` par vidéo YT |

---

## 21. Points techniques notables

- **App single-file** : tout CSS, HTML, JS dans `index.html`
- **Pas de framework** : vanilla JS pur, pas de build step
- **COF dessiné en SVG** via canvas-like JS (segments path calculés)
- **Pointer Events API** pour le drag COF → compatibilité desktop + tablette
- **Web MIDI API** : si clavier MIDI connecté, note-on → tap tempo (practice ouvert)
- **CSS `:has()` selector** : cache la top bar quand practice est ouvert
- **`display:contents`** sur `#atb-left` : préserve le flex layout sous-jacent
- **`body:has(.practice-overlay.open) #atb-left`** : masquage CSS pur sans JS
- **Exponential ramps Web Audio** : `Math.max(0.001, ...)` pour éviter les erreurs à volume 0

# Piano Lab — Synthèse de session (23 mai 2026)

## Fichier principal
- **Path local** : `/mnt/user-data/outputs/index.html` (4237 lignes, 173 fonctions JS)
- **Déployé** : `piano-trainer-dun.vercel.app`
- **Repo** : `github.com/lukzlab/piano-trainer`
- **Proxies Vercel** : `api/claude.js` (Groq llama-3.3-70b) · `api/youtube.js` (YouTube Data API v3)
- **Env vars** : `GROQ_API_KEY` · `YOUTUBE_API_KEY`

---

## Stack & architecture

- **Single file** HTML/CSS/JS vanilla — tout dans `index.html`
- **Layout fixe** : `position:fixed;inset:0` → sidebar(160px/44px) | centre(1fr) | panneau droit(280px)
- **Persistence** : `localStorage` (`piano_trainer_progs` + `piano_trainer_theme`)
- **Device cible** : Samsung Galaxy Tab, paysage, Chrome

---

## Design system — tokens CSS actuels

### Theme Light (actif par défaut, classe `body.light`)
```css
--bg:#FAFAF8; --bg2:#F4F1EB; --bg3:#EDE9E2;
--surface:#fff; --surface2:#F8F6F0;
--border:#E8E4DC; --border2:#DDD9D0;
--text:#1A1814; --text2:#6B6355; --text3:#B0A898;
--accent:#8B5E3C; --tonic:#C0392B; --tonic-light:#F1948A; --tonic-bg:#FADBD8;
--cof-bg:#F8F6F0;
--logo-font:'Instrument Serif',serif; --ui-font:'DM Sans',sans-serif;
```

### Theme Graphite (classe `body.graphite`)
```css
--bg:#0e1018; --surface:#1A1A22; --accent:#f59e0b; --tonic:#f59e0b;
--text:#e9e7df; --text2:rgba(233,231,223,0.55); --text3:rgba(233,231,223,0.32);
--logo-font:'DM Sans',sans-serif;
```

### Polices Google Fonts importées
```
DM Sans 300/400/500/600 · DM Mono 300/400/500 · Instrument Serif · Syne 400/600/700/800
```

---

## Structure UI

### Sidebar gauche
- **Section EXPLORER** : Gammes (sous-menu flyout) · Progressions (sous-menu flyout) · Practice · Comparer · Fiches
- **Section ENTRÉE** : Importer
- **Bas** : bouton Thème · bouton toggle `←/→`
- Logo = icône diapason SVG + "PIANO LAB" (sans "CAHIER DE" — supprimé cette session)

### Barre audio (top)
- `▶ BPM 120 ── ⊙ métro ── STYLE [dropdown] ▶ YT ♬ ⚙ Réglages`
- Bouton Réglages : visible, fond `var(--bg2)`, hover rouge accent
- Drawer réglages : slide-down overlay (Lecture · Métronome · Backing harmonique)

### Centre — Roue des quintes (drawCOF)
- **viewBox** `0 0 600 600`, CX=CY=300
- **Rayons** : ROUT=280 · RMID=200 · RINNER=130 · RCNTR=90
- **4 niveaux** : tonique=`var(--tonic)` · IV/V=`var(--tonic-bg)` · relatifs min=`var(--scale-bg)` · hors gamme=`var(--surface2)`
- **Labels notes** (light) : `C_LABEL_WHITE/DIM = var(--text)` (noir), `C_LABEL_GHOST = var(--text3)`, `C_LABEL_ON_TONIC = #fff`
- **Centre SVG** : note tonique (ex: "C") en `wheel-tonality` à CY-8
- **Bouton gamme HTML overlay** : pill arrondie "Majeure ▾" centré à `translate(-50%,-50%) translateY(18px)` — ouvre popover groupé (Communs/Modes/Mineures/Pentatoniques)
- **Flèches nav** ◄ ► : navigation IV/V circulaire

### Panneau droit (`.rp`)
- `background:var(--surface); color:var(--text); border-left:1px solid var(--border)`
- Override graphite : `body.graphite .rp { background:#13151f; color:#e9e7df }`
- **Mode Gamme** : titre (panel-title) + fiche harmonique (rp-desc) + liste degrés
  - Chaque degré : num romain · nom accord · rôle fonctionnel · chip M/m/°
  - Supprimé cette session : rp-eyebrow "CHAPITRE I · GAMME" (était doublon)
- **Mode Progression** : titre progression + étapes cliquables

### Piano (bas)
- 3 octaves, MIDI 36-71
- Tonique : `var(--tonic)` · Gamme : `var(--tonic-light)` · Accord actif : octave centrale uniquement

---

## État JS global

```javascript
var st = {root:0, scale:'major', viewMode:'scale'};
var stdProg = {idx:0, activeStep:-1, enrichPerStep:{}};
var customProg = {idx:-1, activeStep:-1, transpMode:'root'};
var scaleState = {activeDeg:-1, activeEnrich:''};
var buildMode = false;
var bld = {currentNote:null, currentEnrich:'', sequence:[]};
var customProgs = []; // persisté localStorage
var isDark = false;   // persisté localStorage
```

---

## Corrections appliquées cette session

| # | Problème | Fix |
|---|----------|-----|
| 1 | Thème light avait tokens ambre/caramel incorrects | Restauré tokens ivoire/terracotta originaux |
| 2 | Police "Inter Tight" au lieu de DM Sans | Remplacé partout + import GFonts corrigé |
| 3 | Texte panneau droit illisible en light | `.rp` avait `color:#e9e7df` hardcodé → `color:var(--text)` |
| 4 | Superposition "TONALITÉ / C" + bouton gamme | SVG gardé pour note tonique, bouton HTML pour gamme, positionnement corrigé |
| 5 | Notes de la roue blanches en light | `C_LABEL_WHITE/DIM = var(--text)` dans le bloc light de drawCOF |
| 6 | "CAHIER DE" dans le logo | Supprimé |
| 7 | "C Majeure" en doublon dans panneau droit | Supprimé le rp-eyebrow "CHAPITRE I · GAMME" |
| 8 | Practice/Comparer/Fiches sous "Entrée" | Remontés dans section "Explorer" |
| 9 | Bouton Réglages invisible | Agrandi, fond bg2, label texte, hover accent |

---

## Bugs connus / à surveiller

- `.deg-desc` : vérifier rendu en light après fix `var(--text2)`
- Bouton gamme au centre : vérifier alignement vertical précis sur tablette
- Backing rythmique synthé retiré (qualité insuffisante) — à reprendre si besoin
- `body.graphite .rp-desc` a encore une couleur hardcodée `rgba(233,231,223,0.55)` — acceptable car c'est le thème dark

---

## Backlog features

- [ ] **Exercices guidés** — transitions gammes/accords, validation
- [ ] **Follow Along** — sync manuelle accords/YouTube (barre espace)
- [ ] **Compositeur de structure** — Intro/Couplet/Bridge/Refrain/Outro
- [ ] **Analyse audio** — Essentia.js / Basic Pitch
- [ ] **Live MIDI** — détection accords temps réel
- [ ] **Extensions grid horizontal** (brief Claude Design)
- [ ] **Responsive tablette** amélioré
- [ ] **Migration cloud** — Supabase/Firebase

---

## Workflow déploiement

```bash
# Depuis le dossier repo local
cp ~/Downloads/index.html ~/piano-trainer/index.html
cd ~/piano-trainer
git add index.html
git commit -m "description"
git push origin master
# → Vercel redéploie automatiquement sur master
```

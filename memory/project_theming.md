---
name: project-theming
description: "Thème doré créé + dark mode cohérent + système --chord-sel pour la couleur de sélection d'accord"
metadata: 
  node_type: memory
  type: project
  originSessionId: ce73d059-0e61-48fe-afde-1f08c51bdd4a
---

## Système de thèmes

3 thèmes actifs cyclés via `toggleTheme()` : `light → dore → graphite`

**Variables clés partagées par thème :**
- `--chord-sel` : couleur sélection accord dans la roue COF (résolu via `getComputedStyle(document.body)`)
- `--cof-border` : bordure des segments COF (séparé de `--piano-border`)
- `--bg3` : gris gamme (COF in-scale + touches piano gamme)

**Thème doré (`body.dore`) :**
- Tonic : `#E8A836`
- Texte principal : `#1F2230`, secondaire : `#5F6472`, labels : `#8B90A0`
- Fond global : `#FBF9F9`, cards/surface : `#F9F9F8`
- `--chord-sel` : `#E8C0BC` (rose poudré désaturé)
- `--bg3` : `#F5F3EF`

**Thème light :**
- `--bg3` aligné à `#F5F3EF` (même gris gamme que doré)
- `--chord-sel` : `#E8C0BC` (même rose que doré)

**Thème graphite (dark) :**
- Tonic : `#c8973d` (ambre moins saturé, plus orangé)
- Texte roue : blanc `#e9e7df` (toutes classes)
- Hors-gamme COF : `#1d2133`
- Piano touches gamme : `#2c3050` (wk) / `#1e2240` (bk)
- Texte sur tonic : `#000` (noir pur)

**Why:** Sessions de travail progressif sur l'identité visuelle de l'app.
**How to apply:** Toujours utiliser `getComputedStyle(document.body)` pour lire les CSS vars dans le JS du COF. Les variables `--chord-sel` et `--cof-border` sont dédiées au COF.

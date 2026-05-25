---
name: project-roadmap
description: "Backlog des évolutions prévues pour Piano-Lab, par ordre de priorité implicite"
metadata: 
  node_type: memory
  type: project
  originSessionId: ce73d059-0e61-48fe-afde-1f08c51bdd4a
---

Roadmap discutée le 2026-05-24. Aucun délai fixé, ordre indicatif.

## Design piano — pistes à approfondir

Deux directions à explorer pour le rendu visuel du clavier piano :
- **Version effet 3D** — profondeur, ombres, perspective sur les touches
- **Version aplat couleur** — design flat, sans ombres, touches différenciées par couleur franche

Ces deux directions sont à prototyper et comparer. Ne pas implémenter sans validation visuelle préalable.

---

## Court terme (prochaines sessions)

**Compatibilité tablette / écran vertical**
Optimiser le layout pour les orientations portrait et les écrans ≤ 1024px. Le drag COF fonctionne déjà (Pointer Events + touch-action:none), mais la grille principale et le panneau practice nécessitent des ajustements responsives. Priorité : pratique sur iPad en vertical.


**Menu central gamme — overlay progression standard**
Ajouter un second tableau à droite en overlay sur le menu gamme, listant les progressions standard. Permet une multi-sélection gamme + progression. Améliore le mode practice (combinaison des deux contextes pour construire la séquence).

**Améliorations interface practice**
Practice mode est le hub central — BPM/métronome/style backing track y sont déjà migrés. Continuer à consolider : revoir ce qui reste dans la top bar et envisager de tout basculer dans practice.

**Optimisation recherche Backing Track YT**
Vérifier la qualité et la pertinence des requêtes générées. Possibilité d'affiner les variantes, tester des endpoints alternatifs.

**Traduction notation internationale → française (option)**
Do Ré Mi Fa Sol La Si vs C D E F G A B. Option de bascule, les deux notations coexistent.

**Normalisation nomenclature accords**
Simplifier/normaliser : M7 au lieu de Maj7, m7 au lieu de min7, etc. Choix d'un standard cohérent dans toute l'interface.

## Moyen terme

**Mode Live MIDI**
Connexion MIDI entrante (Web MIDI API). Détecter les notes jouées, les afficher sur le piano/COF, potentiellement identifier les accords en temps réel.

**Affichage partitions**
Rendu sous forme de portée musicale (SVG ou VexFlow). Afficher les accords/gammes sélectionnés en notation standard.

**Composer — structure entière**
Outil de composition : enchaîner des sections (intro, verse, chorus…), chaque section avec sa propre gamme, progression, tempo. Vue d'ensemble du morceau.

**Exercices d'écoute / entraînement sonore**
Remise en place des exercices d'oreille : identifier un accord, un intervalle, une gamme à l'écoute. Mode quiz.

**Patterns main gauche / main droite**
Bibliothèque de patterns rythmiques et mélodiques pour étudier des mouvements spécifiques (arpèges, walking bass, comping…). Associés à une gamme/accord.

## Long terme

**Enregistrement MIDI + loop**
Enregistrer ce qu'on joue en MIDI, créer une boucle facilement. Intégration avec le mode practice/backing track.

---

**Why:** Feuille de route partagée lors d'une session de travail intensif sur le practice mode. Permet de ne pas oublier les idées entre sessions et de prioriser les prochains développements.

**How to apply:** En début de session, proposer de reprendre un item de cette liste si l'utilisateur ne donne pas de direction précise. Vérifier si des items ont été partiellement implémentés avant de les traiter.

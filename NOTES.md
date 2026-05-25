# Piano Trainer — Commandes utiles

## Workflow quotidien

### Avant de commencer
```bash
git pull
```
Récupère la dernière version depuis GitHub.

### Publier une modif sur Vercel
```bash
git add index.html
git commit -m "description de ce que tu as changé"
git push
```
30 secondes après le push, Vercel redéploie automatiquement.

---

## Commandes Git essentielles

| Commande | Ce que ça fait |
|---|---|
| `git pull` | Récupère les dernières modifs depuis GitHub |
| `git add index.html` | Sélectionne le fichier à envoyer |
| `git commit -m "msg"` | Décrit ce que tu as changé |
| `git push` | Envoie sur GitHub → déclenche Vercel |
| `git status` | Voit ce qui a changé localement |
| `git log --oneline` | Historique des commits |

---

## Live Server

- Lancer : clic sur **Go Live** en bas à droite de VS Code
- URL locale : `http://127.0.0.1:5500`
- Arrêter : clic sur le port affiché en bas à droite

---

## Liens projet

- Repo GitHub : https://github.com/lukzlab/piano-trainer
- App en ligne : https://piano-trainer-dun.vercel.app
- Proxy API : `api/claude.js` → Groq `llama-3.3-70b-versatile`

---

## En cas de problème

### Conflit au pull
```bash
git fetch origin
git reset --hard origin/master
```
Réinitialise le dossier local sur la version GitHub (écrase les modifs locales non commitées).

### Voir ce qui diffère
```bash
git diff index.html
```


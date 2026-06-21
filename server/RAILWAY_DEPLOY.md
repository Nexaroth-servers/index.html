# Déployer le backend sur Railway

Ces instructions expliquent comment déployer le dossier `server/` (Node/Express) sur Railway (https://railway.app).

Option A — Déploiement via l'interface Railway (recommandé)
1. Connectez-vous sur https://railway.app et créez un nouveau projet.
2. Choisissez "Deploy from GitHub" et autorisez Railway à accéder à votre dépôt `Nexaroth-servers/index.html`.
3. Sélectionnez le repository et choisissez la branche `main`.
4. Configurez le chemin de déploiement sur `server/` (si Railway le demande).
5. Définissez les variables d'environnement dans Railway:
   - JWT_SECRET : une chaîne secrète robuste
   - WEBHOOK_SECRET : une chaîne secrète pour sécuriser les webhooks
   - PORT : 3000 (Railway l'override généralement)
6. Railway détectera automatiquement Node.js et executera `npm install` puis `npm start`.

Option B — Déployer via Docker (si vous préférez)
1. Railway supporte les projets Docker. Le repository contient `server/Dockerfile`.
2. Lors de la création du service, choisissez Dockerfile et pointez sur `server/Dockerfile` (ou utilisez la racine et spécifiez le contexte `server/`).
3. Définissez les variables d'environnement (JWT_SECRET, WEBHOOK_SECRET).

Après le déploiement
- Vous aurez une URL publique fournie par Railway (ex: https://your-project.up.railway.app)
- Mettez à jour `shop.html` si vous hébergez les pages statiques ailleurs et souhaitez pointer l'API vers cette URL. Exemple : remplacer `const API_BASE = '/'` par `const API_BASE = 'https://your-project.up.railway.app/'`.

Notes de sécurité
- Ne stockez pas `JWT_SECRET` ou `WEBHOOK_SECRET` dans le code. Utilisez les variables d'environnement Railway.
- Activez HTTPS et vérifiez les webhooks côté serveur (Railway fournit HTTPS par défaut).

Si vous voulez, je peux :
- Générer et committer automatiquement une mise à jour de `shop.html` pour pointer vers l'URL publique une fois que vous m'avez fourni l'URL Railway.
- Préparer un workflow GitHub Actions pour déployer automatiquement (nécessite token Railway API).

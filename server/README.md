# Nexaroth - Backend & Shop Integration

Ce dépôt contient une intégration de démonstration pour la boutique Nexaroth.

Fichiers ajoutés :
- server/ : backend Node.js (Express) minimal avec SQLite pour gérer soldes, articles et achats.
- download.html : page de téléchargement multilingue (FR/EN/RU/DE/ES).
- shop.html : boutique intégrée (front-end) — mise à jour pour fonctionner avec le backend.

Comment lancer le backend (localement) :

1. Installer les dépendances

   cd server
   npm install

2. Copier le fichier d'exemple d'environnement

   cp .env.example .env
   # modifier JWT_SECRET et WEBHOOK_SECRET

3. Lancer le serveur

   npm start

Le serveur écoute par défaut sur http://localhost:3000

Endpoints utiles (demo)
- POST /api/login { username }
  → { token, user_id }
- GET /api/balance
  (Authorization: Bearer <token>)
  → { vote, donation }
- GET /api/items
  → liste des articles
- POST /api/purchase { item_id, method } (Authorization: Bearer <token>)
  → effectue la réduction des points et retourne success
- POST /webhook/vote { user_id, amount } (Header: x-webhook-token = WEBHOOK_SECRET)
- POST /webhook/donate { user_id, amount } (Header: x-webhook-token = WEBHOOK_SECRET)

Notes importantes
- Ce backend est un exemple de démonstration. Pour la production :
  - Utiliser HTTPS, secrets robustes, validation des entrées, logging,
  - Intégrer un vrai processeur de paiement (Stripe/PayPal) et vérifier webhooks côté serveur,
  - Fortifier l'authentification et la gestion des sessions.

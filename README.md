<p align="center"><img src="public/logo.svg" alt="Logo AetherFetch" width="64"></p>
<h1 align="center">AetherFetch</h1>
<p align="center">Une boîte mail temporaire, simple et rapide.</p>
<p align="center">
  <a href="https://aetherfetch.vercel.app/">Ouvrir l'application</a> ·
  <a href="#installation-locale">Installation</a> ·
  <a href="#fonctionnement">Fonctionnement</a>
</p>

AetherFetch permet de créer une adresse temporaire, de consulter les messages reçus et de gérer plusieurs comptes dans une interface adaptée au mobile. Le service repose actuellement sur **[mail.tm](https://mail.tm)** : il n'héberge pas son propre serveur de messagerie et ne fournit pas encore d'adresses sur un domaine AetherFetch.

## Fonctionnalités

- Création d'un compte temporaire et connexion à un compte existant.
- Gestion de plusieurs comptes enregistrés, avec favoris, archives et libellés.
- Réception des nouveaux messages via Mercure SSE, avec actualisation périodique en secours.
- Lecture des messages, recherche parmi les messages chargés, pagination et suppression.
- Accès rapide aux codes et liens de confirmation détectés dans un message.
- Consultation des pièces jointes fournies par mail.tm.
- Raccourcis clavier : `C` pour copier l'adresse et `R` pour actualiser la boîte de réception.

## Installation locale

Prérequis : Node.js et npm.

```bash
git clone https://github.com/qbpg/AetherFetch.git
cd AetherFetch
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). Le développement local utilise le proxy Cloudflare Worker configuré dans `src/app/api/mailbox/[...path]/route.ts` ; une connexion à ce Worker et à mail.tm est nécessaire. Aucune variable d'environnement locale n'est requise par le code actuel.

| Commande | Action |
| --- | --- |
| `npm run dev` | Démarrer le serveur de développement |
| `npm run build` | Compiler l'application |
| `npm start` | Démarrer la version compilée |
| `npm run lint` | Vérifier le code avec ESLint |

## Fonctionnement

```text
Navigateur → /api/mailbox/* (Next.js) → Cloudflare Worker → API mail.tm
Navigateur → Mercure mail.tm (notifications de nouveaux messages)
```

Le navigateur appelle la route API de Next.js, qui relaie les requêtes vers le Worker défini dans le code. Le Worker communique avec l'API mail.tm. La connexion Mercure sert à signaler de nouveaux messages ; l'application garde une actualisation périodique si la connexion en direct échoue.

**Données locales :** la session et les comptes enregistrés, y compris leurs mots de passe, sont stockés dans le `localStorage` du navigateur. Ils peuvent être perdus si les données du navigateur sont effacées. Évitez d'enregistrer des comptes sur un appareil partagé et n'utilisez pas ces boîtes pour des informations sensibles.

### Modifier le proxy

Le fichier `cf-proxy/wrangler.toml` définit `MAIL_TM_BASE` (actuellement `https://api.mail.tm`). Après déploiement de votre Worker, adaptez la constante `WORKER_URL` dans `src/app/api/mailbox/[...path]/route.ts` à son URL. Elle est actuellement codée en dur ; déployer un nouveau Worker sans modifier cette constante ne changera pas la destination de l'application.

```bash
cd cf-proxy
npx wrangler deploy
```

Pour déployer le frontend sur Vercel, importez le dépôt dans Vercel et configurez le Worker avant de tester les opérations de création de compte et de lecture des messages.

## Technologies

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, lucide-react, Cloudflare Worker, API mail.tm et Mercure SSE.

## Limites

- Les adresses et les messages dépendent des domaines et de la disponibilité de mail.tm.
- Le projet ne gère pas encore un domaine de messagerie personnalisé ou une infrastructure de réception indépendante.
- Les résultats de recherche portent sur les messages déjà chargés dans l'interface.

## Licence

[MIT](LICENSE).

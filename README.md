# GOCOINS

GOCOINS est une boutique frontend de démonstration pour découvrir une expérience
de recharge de jeux vidéo : consultation des jeux et des packs, choix d’un
montant et saisie des informations nécessaires à une commande.

L’interface est conçue pour être responsive et propose un thème clair ou sombre,
un bandeau d’accueil animé par des vidéos et une ambiance sonore facultative.

> **Version frontend uniquement :** aucun serveur ni service de paiement n’est
> connecté. Les prix et commandes sont des données de démonstration ; aucune
> recharge, vérification de joueur ou transaction réelle n’est effectuée.

## Fonctionnalités

- Accueil avec catalogue, packs populaires et aperçu du parcours de recharge.
- Jeux et offres de démonstration pour Free Fire et PUBG Mobile.
- Modale de commande de démonstration avec choix des packs et montant
  personnalisé lorsque celui-ci est disponible.
- Préférences de thème mémorisées dans le navigateur.
- Bandeau vidéo avec rotation des clips du dossier `VIDEO/`.
- Mélodie générée par le navigateur, activable et désactivable par l’utilisateur.
- Mise en page adaptée aux écrans mobiles et aux ordinateurs.

## Prérequis

- Node.js 20.19+ ou 22.12+.
- npm.

## Installation et démarrage

Depuis la racine du projet :

```sh
npm install
npm run dev
```

Vite affiche dans le terminal l’adresse locale à ouvrir dans le navigateur
(généralement <http://localhost:5173>).

Aucun fichier `.env` ou `.env.local` n’est requis pour lancer cette version.

## Commandes disponibles

| Commande | Description |
| --- | --- |
| `npm run dev` | Démarre le serveur de développement Vite. |
| `npm run build` | Génère la version de production dans `dist/`. |
| `npm run preview` | Sert localement la version compilée. |
| `npm run lint` | Vérifie le code avec ESLint. |
| `npm run typecheck` | Vérifie les types TypeScript. |

Avant de publier une modification, lancez les vérifications suivantes :

```sh
npm run lint
npm run typecheck
npm run build
```

## Pages

| Adresse | Contenu |
| --- | --- |
| `/` | Accueil et catalogue de jeux. |
| `/recharger` | Page indiquant que la gestion des recharges attend le backend. |
| `/commande/:orderId` | Écran de caisse provisoire. |
| `/commandes` | Écran provisoire de l’historique des commandes. |
| `/suivi/:orderId` | Écran provisoire du suivi. |
| `/compte` | Écran provisoire des récompenses. |
| `/aide` | Écran provisoire d’aide. |
| `/admin/*` | Indique que l’administration n’est pas incluse. |

Les écrans marqués comme provisoires ou en attente du backend ne sont pas des
fonctionnalités opérationnelles. La modale de commande accessible depuis le
catalogue sert uniquement à présenter le parcours de démonstration.

## Organisation du code

```text
src/
├── api/          # Accès aux données locales et stockage navigateur
├── components/   # Navigation, thème, modales et composants partagés
├── data/         # Catalogue et types TypeScript
├── hooks/        # Hooks React
├── pages/        # Pages de la boutique
├── App.tsx       # Routes et layout général
└── index.css     # Styles globaux, palette et thèmes
VIDEO/            # Clips utilisés par le bandeau d’accueil
```

Les données de démonstration sont définies dans `src/data/`. Certaines
informations de commande peuvent être conservées dans le `localStorage` du
navigateur ; elles ne sont pas synchronisées entre appareils.

## Médias et connexion

Le bandeau utilise les clips suivants :

- `VIDEO/VID-20261104-WA0050.mp4`
- `VIDEO/VID-20261104-WA0052.mp4`
- `VIDEO/VID-20261104-WA0054(1).mp4`

Les autres vidéos ne sont pas nécessaires au site et sont exclues de Git par
`.gitignore`. La police Rajdhani et la police Manrope sont chargées depuis
Google Fonts ; les visuels de démonstration du catalogue utilisent
placehold.co. Une connexion Internet est donc nécessaire pour récupérer ces
ressources externes.

## Publication

Le projet peut être compilé avec `npm run build`, puis le contenu de `dist/`
peut être déployé sur un hébergeur de sites statiques. Configurez l’hébergeur
pour rediriger les routes inconnues vers `index.html`, afin que les routes
React Router fonctionnent après actualisation d’une page.

Pour mettre en place de vrais paiements, commandes, comptes ou outils
d’administration, il faudra ajouter et configurer un backend sécurisé. Les clés
privées et secrets ne doivent jamais être intégrés au frontend.

# GOCOINS Frontend

Boutique de recharges et d’accessoires numériques pour jeux vidéo (Free Fire,
PUBG, Minecraft et autres).

Frontend React/Vite de GOCOINS, fonctionnant sans serveur backend :
le catalogue est fourni localement et les commandes de démonstration sont
stockées dans le navigateur.

## Démarrer

```sh
npm install
npm run dev
```

## Vérifier et construire

```sh
npm run lint
npm run typecheck
npm run build
```

## Pages

- `/` : accueil et catalogue
- `/recharger` : sélection des jeux et des packs
- `/commande/:orderId` : écran de caisse provisoire
- `/commandes` : écran de commandes provisoire
- `/suivi/:orderId` : écran de suivi provisoire
- `/compte` : écran des récompenses provisoire
- `/aide` : écran d’aide provisoire

L’administration et l’intégration Supabase ne font pas partie de cette version
frontend autonome. Les paiements, la vérification des joueurs et le suivi ne
sont pas des opérations réelles.

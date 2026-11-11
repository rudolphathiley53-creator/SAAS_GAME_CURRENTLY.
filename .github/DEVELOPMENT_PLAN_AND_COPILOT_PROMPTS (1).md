# PLAN DE RÉALISATION ET PROMPTS GITHUB COPILOT
## Plateforme Gaming Store & AI Credits

> **Document opérationnel de développement assisté par GitHub Copilot**
>
> Version : 1.0  
> Date : 11 novembre 2026  
> Référence principale : `STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md`  
> Marché initial : Togo — devise XOF — interface initiale en français  
> Architecture : monolithe modulaire Next.js App Router + TypeScript, Supabase/PostgreSQL/RLS, workers persistants et LiteLLM sur infrastructure séparée.

---

# 0. Comment utiliser ce document

Ce fichier découpe la réalisation de la plateforme en phases ordonnées et fournit un prompt prêt à transmettre à GitHub Copilot pour chaque phase. Il doit être utilisé **avec** `STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md`, qui reste la source de vérité architecturale.

## 0.1 Documents à placer dans le dépôt

```text
/
├── STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md
├── docs/
│   ├── DEVELOPMENT_PLAN_AND_COPILOT_PROMPTS.md
│   ├── cahier_des_charges_technique_gaming_ai_v1.docx
│   └── supabase_schema_v1.sql
├── README.md
└── ...
```

Si le cahier des charges DOCX ou le SQL ne sont pas présents dans le dépôt, ne pas les inventer : demander à l'utilisateur de les ajouter ou travailler à partir des migrations réellement présentes.

## 0.2 Règle de priorité documentaire

Avant chaque tâche, Copilot doit lire :

1. `STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md` ;
2. les sections pertinentes du cahier des charges ;
3. les migrations Supabase réellement présentes ;
4. les contrats officiels du fournisseur concerné, lorsqu'une intégration externe est demandée ;
5. le code existant et les tests.

En cas de divergence, ne pas corriger silencieusement la conception. Signaler la divergence, expliquer son impact et proposer une décision avant de modifier le schéma ou un contrat externe.

## 0.3 Légende

- **[BASELINE]** : élément prévu par la structure globale.
- **[RECOMMANDATION]** : garde-fou ou détail d'implémentation nécessaire à une réalisation fiable.
- **[À DÉCIDER]** : décision produit ou technique non confirmée.
- **[À VALIDER FOURNISSEUR]** : dépend d'une capacité réelle, d'une autorisation ou de la documentation d'un tiers.

## 0.4 Mode opératoire obligatoire

Pour chaque phase :

1. Ouvrir le dépôt dans VS Code.
2. Ouvrir GitHub Copilot Chat en mode Agent si disponible.
3. Coller le prompt de la phase.
4. Laisser Copilot effectuer d'abord l'audit et proposer son plan.
5. Vérifier le plan et répondre à ses questions.
6. Lui demander d'implémenter par petits lots cohérents.
7. Exécuter les commandes de validation.
8. Examiner le diff Git et les migrations.
9. Valider les critères d'acceptation avant de passer à la phase suivante.
10. Mettre à jour `docs/PROGRESS.md`.

**Ne pas lancer toutes les phases en une seule demande.** Les phases financières et les intégrations externes doivent être testées indépendamment.

---

# 1. Vue d'ensemble des phases

| Phase | Domaine | Résultat attendu | Dépend de |
|---|---|---|---|
| 0 | Cadrage technique et fondations | Dépôt propre, configuration, qualité, structure modulaire | Rien |
| 1 | Supabase, authentification et profils | Utilisateurs, rôles, RLS et session fiables | Phase 0 |
| 2 | Catalogue Gaming, panier et commandes | Parcours de commande sans paiement réel | Phase 1 |
| 3 | Paiements Mobile Money | Paiements vérifiés, webhooks idempotents | Phase 2 |
| 4 | Fournisseurs Gaming et livraison | Achat fournisseur et livraison traçable | Phase 3 |
| 5 | Wallet et ledger financier | Recharge, solde disponible, réservations et écritures | Phase 3, socle Phase 1 |
| 6 | AI Gateway et crédits IA | Clés individuelles, proxy, mesure et débit | Phase 5 |
| 7 | Administration, support et reporting | Exploitation de la plateforme | Phases 1 à 6 |
| 8 | Sécurité, tests, observabilité et lancement | Version candidate à la production | Toutes |

**Ordre commercial recommandé :** réaliser et valider les phases 0 à 4 pour lancer un premier produit Gaming. Construire ensuite les phases 5 et 6. Les outils d'administration minimum nécessaires aux opérations doivent toutefois exister dès les premières phases ; la phase 7 les complète.

---

# 2. Règles communes à tous les prompts Copilot

Les prompts ci-dessous supposent que Copilot agit comme ingénieur logiciel dans le dépôt courant. Les règles suivantes s'appliquent à chaque phase.

## 2.1 Architecture et qualité

- Respecter le monolithe modulaire décrit dans le document de référence.
- Utiliser Next.js App Router et TypeScript strict.
- Séparer interface, cas d'usage métier, accès aux données et adaptateurs externes.
- Réutiliser les composants et conventions déjà présents.
- Ne pas introduire une seconde architecture ou un framework sans justification et accord.
- Ne pas déplacer ou renommer massivement des fichiers sans nécessité.
- Ne pas dupliquer une règle métier dans plusieurs composants.
- Utiliser des schémas de validation à la frontière des entrées externes.
- Garder les fonctions métier testables sans navigateur.

## 2.2 Données et sécurité

- Le serveur est l'autorité pour les prix, les commandes, les paiements, les soldes, les rôles et les livraisons.
- Ne jamais faire confiance à une valeur financière envoyée par le navigateur.
- Les montants de vente en XOF sont des entiers ; ne pas utiliser `float` ou `Number` non contrôlé pour l'argent.
- Les coûts et prix unitaires fractionnaires doivent utiliser une représentation décimale sûre.
- Les secrets restent côté serveur et ne sont jamais préfixés `NEXT_PUBLIC_`.
- Toute nouvelle table exposée via Supabase doit avoir des politiques RLS explicites.
- Ne jamais donner au client le rôle `service_role` ni une clé fournisseur.
- Toute opération financière doit être traçable et atomique.
- Les webhooks et tâches doivent être idempotents.
- Ne pas écrire de code qui prétend confirmer un paiement ou une livraison sans preuve du prestataire.

## 2.3 Intégrations externes

- Lire la documentation officielle fournie dans le dépôt ou par l'utilisateur.
- Vérifier les pays, produits, devises, méthodes de paiement, conditions commerciales et droits de revente.
- Encapsuler chaque prestataire derrière une interface/adaptateur.
- Si les identifiants ou la documentation ne sont pas disponibles, créer uniquement un adaptateur mock clairement marqué `MOCK` ou `SANDBOX`.
- Ne jamais inventer endpoint, payload, signature, statut ou méthode de paiement.
- Distinguer les statuts internes des statuts du prestataire.
- Prévoir timeouts, erreurs réseau, retry contrôlé, journalisation et réconciliation.

## 2.4 Méthode de travail

Pour chaque prompt de phase, Copilot doit :

1. lire les documents et le code ;
2. résumer l'état réel du dépôt ;
3. lister les écarts par rapport à la structure globale ;
4. proposer un plan de fichiers et de migrations ;
5. attendre validation si une décision bloquante est inconnue ;
6. implémenter un lot à la fois ;
7. écrire ou mettre à jour les tests ;
8. lancer les vérifications disponibles ;
9. présenter les fichiers modifiés, les commandes exécutées, les résultats et les limites ;
10. mettre à jour `docs/PROGRESS.md` et les documents techniques concernés.

---

# 3. Phase 0 — Cadrage, initialisation et fondations

**Objectif :** obtenir un dépôt Next.js propre, typé, testable et organisé conformément à la structure cible, sans commencer les fonctionnalités commerciales.

**Référence :** sections 4, 5, 13, 16, 19 et 21 de `STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md`.

## Livrables

- Application Next.js App Router + TypeScript.
- Configuration de lint, formatage et tests.
- Tailwind CSS et conventions de composants.
- Structure de dossiers modulaire.
- Configuration des environnements.
- Fichiers `.env.example` sans secrets.
- Documentation initiale.
- CI minimale si le dépôt est déjà connecté à GitHub.

## Prompt Copilot — Phase 0

```text
Tu es l'ingénieur logiciel principal chargé de préparer le socle de la plateforme Gaming Store & AI Credits.

SOURCE DE VÉRITÉ
Lis intégralement ou par sections pertinentes :
- STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md
- le cahier des charges technique s'il est présent ;
- le README et tous les fichiers de configuration existants.

OBJECTIF
Préparer le dépôt et l'architecture de base. Ne développe pas encore les fonctionnalités métier de paiement, de livraison, de wallet ou d'AI Gateway.

STACK CIBLE
- Next.js App Router
- TypeScript strict
- Supabase prévu pour Auth et PostgreSQL
- Tailwind CSS
- composants UI réutilisables
- tests unitaires et tests de composants adaptés au projet
- déploiement cible Vercel pour l'application web
- workers séparés pour les tâches persistantes futures

TRAVAIL DEMANDÉ
1. Audite le dépôt avant toute modification.
2. Identifie les versions et dépendances existantes.
3. Propose l'arborescence conforme à la section 5 du document de référence.
4. Crée uniquement les dossiers et fichiers de fondation nécessaires.
5. Configure TypeScript strict et les scripts npm/pnpm réellement adaptés au gestionnaire détecté.
6. Configure ESLint et le formatage selon les conventions du projet.
7. Configure Tailwind et un système de composants UI réutilisables.
8. Prépare les clients Supabase browser/server séparés, sans inventer de secrets.
9. Prépare les fichiers de configuration et de validation des variables d'environnement.
10. Ajoute un .env.example avec des valeurs fictives clairement identifiées.
11. Crée les documents :
    - docs/PROGRESS.md
    - docs/DECISIONS.md
    - docs/DEVELOPMENT_PLAN_AND_COPILOT_PROMPTS.md si absent
12. Ajoute une page d'accueil technique minimale et responsive, sans fausses données commerciales.
13. Prépare les commandes de vérification et une CI simple si le contexte GitHub le permet.

CONTRAINTES
- Ne remplace pas une configuration existante qui fonctionne sans justification.
- Ne crée pas de fausses intégrations.
- Aucun secret dans le dépôt.
- N'installe pas de dépendance redondante.
- Ne commence pas le catalogue, les paiements ou les fonctionnalités wallet.
- Respecte les conventions de la structure cible ; si une divergence est nécessaire, documente-la.

ACCEPTATION
- L'application démarre localement.
- Le build de production passe.
- Le lint passe.
- Le contrôle TypeScript passe.
- Les tests de base passent.
- .env.example est complet mais ne contient aucun vrai secret.
- L'arborescence est documentée.
- PROGRESS.md décrit exactement ce qui est fait et ce qui ne l'est pas.

MÉTHODE
Commence par l'audit et le plan. Attends mon accord avant les changements structurants. Ensuite implémente par lots et rapporte les commandes réellement exécutées.
```

## Vérifications manuelles

```bash
npm install
npm run dev
npm run lint
npx tsc --noEmit
npm run build
```

Adapter les commandes au gestionnaire de paquets détecté (`pnpm`, `npm` ou `yarn`).

**Ne pas passer à la phase 1** si l'application ne démarre pas ou si le build échoue.

---

# 4. Phase 1 — Supabase, authentification, profils et autorisations

**Objectif :** mettre en place l'identité utilisateur, les profils, les rôles et l'isolation des données.

**Référence :** sections 3, 7, 11.1, 16.4 et 21.

## Livrables

- Projet Supabase configuré.
- Migrations versionnées.
- Tables conformes à la baseline réellement validée.
- Authentification par téléphone/OTP si le fournisseur et le projet Supabase le permettent.
- Profils utilisateur.
- Rôles contrôlés côté serveur.
- Politiques RLS.
- Middleware/guards serveur.
- Tests d'accès autorisé et interdit.

## Point de contrôle préalable

Le schéma de référence V1 est une baseline, pas une preuve que toutes les tables et fonctions sont déjà déployées. Comparer le fichier SQL existant à la section 7 du document et produire une migration cohérente. Ne pas réécrire l'historique des migrations déjà appliquées.

## Prompt Copilot — Phase 1

```text
Tu implémentes la couche identité, profils et autorisations de la plateforme Gaming Store & AI Credits.

DOCUMENTS À LIRE
- STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md : sections 3, 7, 11.1 et 16.4.
- Les migrations Supabase présentes dans supabase/migrations.
- La configuration Supabase de la phase 0.

OBJECTIF
Permettre à un utilisateur de s'inscrire, de se connecter, de gérer son profil et d'accéder uniquement à ses propres données. Préparer une séparation fiable entre client, opérateur et administrateur.

FONCTIONNALITÉS
1. Configurer les clients Supabase browser et server.
2. Mettre en place le flux Auth retenu par le projet.
3. Pour le téléphone/OTP, vérifier la disponibilité et la configuration réelle du fournisseur SMS ; ne pas prétendre qu'un OTP fonctionne si le fournisseur n'est pas configuré.
4. Créer ou synchroniser le profil après création d'un utilisateur Auth.
5. Gérer les champs de profil prévus par le schéma de référence.
6. Définir les rôles exacts de la baseline.
7. Créer des guards serveur pour les routes privées et admin.
8. Configurer les politiques RLS pour chaque table concernée.
9. Empêcher un utilisateur de modifier lui-même son rôle, son statut de vérification ou ses privilèges.
10. Ajouter les pages de connexion, inscription, vérification OTP, déconnexion et profil selon les routes du projet.
11. Prévoir les états loading, erreur, OTP expiré et session expirée.
12. Ajouter des tests d'accès multi-utilisateurs.

SÉCURITÉ
- Ne jamais faire confiance au rôle transmis par le client.
- Ne pas exposer SUPABASE_SERVICE_ROLE_KEY au navigateur.
- Toute route sensible doit vérifier la session et l'autorisation côté serveur.
- Les politiques RLS doivent être testées avec deux utilisateurs différents.
- Ne pas accorder l'accès global aux tables pour simplifier le développement.
- Éviter les politiques récursives et les fonctions SECURITY DEFINER non justifiées.

MIGRATIONS
- Inspecte d'abord les migrations existantes.
- Ne modifie pas une migration déjà appliquée.
- Toute évolution doit être une nouvelle migration.
- Explique les risques et la stratégie de retour arrière.
- Fournis les commandes Supabase nécessaires.

ACCEPTATION
- Un utilisateur peut s'inscrire et se connecter avec le fournisseur réellement configuré.
- Son profil est créé une seule fois.
- Un utilisateur ne lit ni ne modifie les données privées d'un autre.
- Un utilisateur ne peut pas s'attribuer le rôle admin.
- Les routes admin sont bloquées côté serveur pour un client normal.
- Les tests RLS et d'autorisation passent.
- Les types TypeScript Supabase sont régénérés et cohérents.

Commence par un audit des migrations et un plan de sécurité. N'implémente pas les paiements ni le wallet dans cette phase.
```

## Vérifications manuelles

- Tester deux comptes distincts.
- Vérifier l'accès direct à une route protégée.
- Tester les politiques RLS depuis un client authentifié.
- Vérifier qu'un utilisateur ne peut pas modifier son rôle via une requête directe.
- Vérifier les redirections après expiration de session.

---

# 5. Phase 2 — Catalogue Gaming, panier et commandes

**Objectif :** permettre de parcourir les produits, choisir une variante et créer une commande persistée, sans encaisser ni livrer réellement.

**Référence :** sections 2.1.A, 6.2, 6.3, 6.4, 7, 8, 9.2, 12 et 15.

## Livrables

- Catégories et catalogue.
- Produits et variantes.
- Filtres et détails produit.
- Champs spécifiques au jeu si requis.
- Panier ou récapitulatif.
- Création de commande côté serveur.
- Historique et détail de commande.
- Interface admin minimale pour publier et désactiver les produits.

## Prompt Copilot — Phase 2

```text
Tu implémentes le catalogue Gaming, le panier et le cycle initial de commande.

DOCUMENTS À LIRE
- STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md : sections 2.1.A, 6.2, 6.3, 6.4, 7, 8, 9.2, 12 et 15.
- Le schéma SQL réellement présent et les types Supabase générés.
- Les composants et conventions UI existants.

OBJECTIF
Construire un parcours Gaming complet jusqu'à la création d'une commande en attente de paiement. Aucun paiement réel ni achat fournisseur ne doit être simulé comme s'il avait réussi.

CATALOGUE
1. Afficher uniquement les catégories, produits et variantes publiés et disponibles.
2. Créer les pages de navigation et de détail.
3. Afficher les informations de région, plateforme, dénomination et conditions d'utilisation disponibles en base.
4. Gérer les variantes/SKU internes.
5. Gérer les champs requis pour certains top-ups (par exemple identifiant joueur, serveur ou région) uniquement lorsque le produit le déclare.
6. Implémenter recherche, filtres, tri et pagination si prévus par la structure.
7. Prévoir les états catalogue vide, produit indisponible, erreur et chargement.

PANIER ET COMMANDE
1. Construire un panier simple adapté au MVP.
2. Recalculer côté serveur les prix à partir des variantes actives.
3. Ne jamais accepter le total envoyé par le navigateur comme source de vérité.
4. Valider les quantités, la disponibilité et les données de top-up.
5. Créer la commande et ses lignes de manière transactionnelle.
6. Enregistrer un snapshot du nom, SKU, variante, prix et devise au moment de l'achat.
7. Définir les transitions d'état autorisées selon la machine d'état du document.
8. Prévenir les doubles soumissions et les commandes dupliquées.
9. Ajouter les pages de confirmation et d'historique client.

ADMIN MINIMAL
Créer les écrans strictement nécessaires pour créer, modifier, publier, dépublier et ordonner catégories, produits et variantes. Protéger ces actions par un contrôle de rôle serveur.

CONTRAINTES
- Pas de paiement réel.
- Pas de livraison réelle.
- Ne pas créer de faux produits ou de fausses disponibilités en production.
- Les données de démonstration doivent être clairement isolées et supprimables.
- Respecter les tables et relations existantes.
- Toute nouvelle colonne passe par une migration.

ACCEPTATION
- Un visiteur peut parcourir le catalogue public.
- Un client connecté peut sélectionner une variante et créer une commande.
- Le total est calculé côté serveur.
- Les données de la commande sont cohérentes et persistées.
- Un utilisateur ne consulte que ses commandes.
- Un admin peut gérer le catalogue.
- Les statuts impossibles sont refusés.
- Les tests couvrent prix falsifié, variante inactive, quantité invalide, données de top-up manquantes et double soumission.

Commence par cartographier les routes et tables existantes. Propose ensuite les composants et cas d'usage avant l'implémentation.
```

## Vérifications manuelles

- Modifier le prix dans les outils du navigateur : le serveur doit ignorer cette valeur.
- Commander une variante désactivée : la commande doit être refusée.
- Recharger la page après création : la commande doit rester consultable.
- Se connecter avec un autre compte : la commande ne doit pas être visible.

---

# 6. Phase 3 — Paiements Mobile Money et webhooks

**Objectif :** encaisser les commandes par l'intermédiaire d'un agrégateur effectivement sélectionné et vérifier les paiements côté serveur.

**Référence :** sections 2.1.B, 6.5, 8.5, 9.2, 11.4, 14 et 15.

## Décisions bloquantes

- Agrégateur définitif : **[À DÉCIDER]**.
- Disponibilité réelle de Flooz et Mixx : **[À VALIDER FOURNISSEUR]**.
- Devises, frais, délais de règlement, remboursements et procédure KYC : **[À VALIDER FOURNISSEUR]**.
- Documentation officielle, clés sandbox et procédure de signature webhook : **[À FOURNIR]**.

Ne pas choisir un prestataire à la place du propriétaire du produit. Ne pas inventer son API.

## Livrables

- Interface `PaymentProvider`.
- Adaptateur sandbox ou réel documenté.
- Création d'intention de paiement.
- Page de statut.
- Endpoint webhook.
- Vérification signature et montant.
- Événements webhook persistés.
- Idempotence et réconciliation.
- Tests de paiement confirmé, refusé, expiré et rejoué.

## Prompt Copilot — Phase 3

```text
Tu implémentes le module de paiement Mobile Money de la plateforme.

DOCUMENTS À LIRE
- STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md : sections 2.1.B, 6.5, 8.5, 9.2, 9.4, 11.4, 14 et 15.
- Le schéma et les migrations de commandes/paiements.
- La documentation officielle de l'agrégateur sélectionné, fournie dans le dépôt ou dans le contexte de travail.

OBJECTIF
Créer un flux de paiement fiable pour les commandes Gaming. Le navigateur ne confirme jamais un paiement. Seule une notification authentifiée ou une vérification serveur-à-serveur conforme à la documentation du prestataire peut confirmer le règlement.

ÉTAPE 1 — AUDIT FOURNISSEUR
Avant de coder, confirme que la documentation disponible décrit :
- création de transaction ;
- référence marchande ;
- montant et devise ;
- méthodes réellement supportées au Togo ;
- retour utilisateur ;
- webhook ;
- mécanisme d'authentification/signature ;
- vérification de statut ;
- expiration et remboursement.
Si un élément manque, liste la question à poser au prestataire. N'invente rien.

ÉTAPE 2 — ADAPTATEUR
1. Définir un contrat PaymentProvider indépendant du fournisseur.
2. Isoler le code spécifique du prestataire dans son adaptateur.
3. Normaliser les statuts externes vers les statuts internes.
4. Gérer timeout, erreur réseau et réponse ambiguë.
5. Séparer sandbox et production.
6. Ne jamais retourner de secret au frontend.

ÉTAPE 3 — CRÉATION DE PAIEMENT
1. Vérifier que la commande appartient à l'utilisateur.
2. Vérifier son état et son montant calculé côté serveur.
3. Créer une référence marchande unique.
4. Créer une tentative de paiement persistée.
5. Appeler le prestataire.
6. Enregistrer sa référence et les métadonnées non sensibles.
7. Retourner au frontend uniquement les informations nécessaires pour continuer le paiement.
8. Prévoir l'expiration et la reprise du statut.

ÉTAPE 4 — WEBHOOK
1. Lire le corps brut si la signature l'exige.
2. Vérifier la signature selon la documentation officielle.
3. Vérifier référence, montant, devise, compte marchand et statut.
4. Persister l'événement brut avec les informations sensibles expurgées ou protégées.
5. Rendre le traitement idempotent.
6. Rejeter ou mettre en quarantaine les événements incohérents.
7. Mettre à jour paiement et commande dans une transaction DB.
8. Déclencher la suite du workflow via l'outbox persistante, jamais par un appel fragile depuis le navigateur.
9. Répondre au webhook selon le protocole documenté.

ÉTAPE 5 — RÉCONCILIATION
Prévoir un job pour vérifier les paiements restés en attente lorsque l'API du prestataire le permet. Une réponse réseau ambiguë ne doit pas déclencher une nouvelle collecte sans vérification.

SÉCURITÉ ET INTÉGRITÉ
- Un webhook répété ne crédite ni ne livre deux fois.
- Un montant inférieur, supérieur ou une devise inattendue ne confirme pas la commande.
- Une redirection navigateur n'est jamais une preuve de paiement.
- Les logs ne contiennent ni secret, ni OTP, ni données de paiement inutiles.
- Les remboursements sont audités et soumis aux capacités réelles du prestataire.

ACCEPTATION
- Tests sandbox documentés.
- Webhook authentique accepté.
- Signature invalide rejetée.
- Doublon idempotent sans effet supplémentaire.
- Mauvais montant/devise mis en anomalie.
- Commande mise à jour une seule fois.
- Événement persistant et traçable.
- Tests de concurrence et de rejeu réussis.

Si aucune documentation fournisseur n'est disponible, implémente uniquement le contrat et un adaptateur mock explicitement non production. N'affirme pas que Flooz ou Mixx fonctionne.
```

## Vérifications manuelles

- Envoyer deux fois le même webhook.
- Envoyer un webhook avec montant différent.
- Envoyer une signature invalide.
- Fermer le navigateur après initiation : le webhook doit tout de même traiter le paiement.
- Simuler un timeout fournisseur : ne pas créer une seconde collecte aveuglément.

---

# 7. Phase 4 — Fournisseurs Gaming et livraison numérique

**Objectif :** acheter ou approvisionner un produit chez un fournisseur autorisé, puis livrer le code ou confirmer le top-up de façon traçable.

**Référence :** sections 2.1.C, 6.6, 6.7, 9.2, 11.3, 14 et 15.

## Décisions bloquantes

- Fournisseur initial : **[À DÉCIDER]**.
- Autorisation de revente et couverture pays/produit : **[À VALIDER FOURNISSEUR]**.
- API, sandbox, mécanisme d'achat et de consultation : **[À FOURNIR]**.
- Type de livraison : code, top-up joueur ou confirmation externe : selon produit.

## Prompt Copilot — Phase 4

```text
Tu implémentes les adaptateurs fournisseurs Gaming et le processus de livraison numérique.

DOCUMENTS À LIRE
- STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md : sections 2.1.C, 6.6, 6.7, 9.2, 11.3, 14 et 15.
- Les tables providers, provider_products, deliveries, orders, order_items et job_outbox réellement présentes.
- La documentation officielle du fournisseur choisi.

OBJECTIF
Après confirmation serveur du paiement, déclencher une opération fournisseur et enregistrer le résultat de livraison. Aucun code ou top-up ne doit être présenté comme livré avant confirmation suffisante du fournisseur.

ADAPTATEUR FOURNISSEUR
1. Définir un contrat commun pour consulter les produits, obtenir un prix si supporté, acheter, consulter le statut et récupérer le résultat.
2. Créer un adaptateur par fournisseur.
3. Mapper les SKU internes vers les références externes.
4. Normaliser les statuts sans perdre la référence et le statut d'origine.
5. Ajouter timeout, erreurs classifiées, logs expurgés et gestion de réponse ambiguë.
6. Séparer sandbox et production.
7. Ne jamais inventer d'endpoint ou de payload.

ORCHESTRATION DE LIVRAISON
1. Le paiement confirmé déclenche un job persistant via job_outbox.
2. Le worker revendique le job de manière sûre.
3. Il vérifie que la commande est payable et que la ligne n'a pas déjà été livrée.
4. Il vérifie le mapping fournisseur et la disponibilité connue.
5. Il effectue l'achat une seule fois selon les garanties du fournisseur.
6. Il enregistre la référence externe et le statut.
7. Il récupère le code ou la confirmation de top-up.
8. Il chiffre/protège les secrets de livraison au repos selon l'architecture.
9. Il rend le résultat visible uniquement au propriétaire de la commande et aux rôles opérationnels autorisés.
10. Il envoie une notification sans inclure le code secret dans un canal non sécurisé.
11. En cas d'échec ou de résultat incertain, il place la livraison en revue/réconciliation au lieu de répéter aveuglément l'achat.

ÉTATS ET REPRISE
Respecte la machine d'état définie dans le document de référence. Distingue au minimum attente, traitement, livré, échec et revue manuelle selon les ENUM réellement validés.

INTERFACE CLIENT
- Liste des commandes.
- Détail et statut.
- Affichage sécurisé du code si applicable.
- Masquage par défaut et action explicite pour révéler le code.
- Informations de support en cas de livraison en attente.

ADMIN OPÉRATIONNEL
- Voir les livraisons en attente/en anomalie.
- Consulter les références externes et erreurs expurgées.
- Déclencher une réconciliation autorisée.
- Marquer une résolution manuelle uniquement avec motif et audit.
- Ne pas permettre de marquer arbitrairement une livraison comme réussie sans preuve.

ACCEPTATION
- Paiement non confirmé : aucune commande fournisseur.
- Paiement confirmé : un job de livraison est créé.
- Job rejoué : aucune double livraison.
- Résultat fournisseur stocké et consultable.
- Code secret non accessible à un autre utilisateur.
- Échec fournisseur visible et récupérable.
- Cas de réponse ambiguë envoyé en réconciliation.
- Tests worker, idempotence, autorisation et secret de livraison réussis.

Si l'API fournisseur n'est pas fournie, implémente le contrat et un mock de test isolé. Le mock ne doit jamais être activé par défaut en production.
```

---

# 8. Phase 5 — Wallet, ledger et comptabilité prépayée

**Objectif :** construire un portefeuille XOF fiable pour les crédits IA et les opérations prépayées prévues.

**Référence :** sections 2.1.E, 6.8, 7, 9.4, 10, 11, 14 et 15.

## Livrables

- Wallet par utilisateur.
- Ledger append-only.
- Solde comptable et solde réservé.
- Recharge via paiement confirmé.
- Réservation et libération de fonds.
- Débit/règlement atomique.
- Ajustement et remboursement audités.
- Historique client et vues admin.

## Prompt Copilot — Phase 5

```text
Tu implémentes le Wallet XOF et son ledger financier.

DOCUMENTS À LIRE
- STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md : sections 2.1.E, 6.8, 7, 9.4, 10, 11, 14 et 15.
- Les migrations wallets, wallet_transactions, wallet_reservations et payments.
- Les fonctions SQL et tests existants.

OBJECTIF
Créer un système de solde prépayé auditable, résistant aux doubles crédits, doubles débits et dépenses concurrentes.

MODÈLE FINANCIER
- Les montants de vente XOF sont des entiers.
- Le ledger est append-only : ne pas modifier ou supprimer une écriture financière validée.
- Le solde disponible est calculé conformément au document de référence : solde comptable moins fonds réservés.
- Toute correction passe par une écriture compensatoire avec motif et acteur.
- Les opérations doivent être transactionnelles côté PostgreSQL.

FONCTIONNALITÉS
1. Créer un wallet selon la règle de création du profil.
2. Afficher solde comptable, montant réservé et disponible.
3. Créer une recharge via un paiement confirmé.
4. Garantir qu'un paiement ne crée qu'un crédit.
5. Ajouter l'historique paginé des transactions.
6. Mettre en place les réservations temporaires.
7. Permettre la capture d'une réservation jusqu'au montant final.
8. Libérer le reliquat.
9. Expirer ou libérer les réservations abandonnées selon une règle documentée.
10. Gérer remboursements et ajustements via fonctions serveur autorisées.
11. Ajouter audit et motif obligatoire pour les actions manuelles.

CONCURRENCE ET ATOMICITÉ
- Utiliser les fonctions SQL transactionnelles prévues ou les faire évoluer par migration.
- Verrouiller les lignes ou utiliser une stratégie atomique appropriée.
- Deux dépenses simultanées ne doivent jamais consommer plus que le disponible.
- Une même clé d'idempotence ne doit produire qu'une opération.
- Un retry après timeout doit permettre de retrouver le résultat de l'opération.
- Ne jamais calculer puis mettre à jour un solde uniquement dans le code frontend.

AUTORISATIONS
- Un utilisateur lit uniquement son wallet et son historique.
- Le client ne peut pas s'auto-créditer.
- Les fonctions de crédit/débit sensibles sont appelées exclusivement par le backend autorisé.
- Les ajustements admin sont soumis à rôle, motif et audit.
- Aucune clé service role ne va au navigateur.

TESTS OBLIGATOIRES
- Crédit en double.
- Débit supérieur au disponible.
- Deux débits concurrents.
- Réservation puis capture.
- Réservation puis libération.
- Capture partielle et restitution du reliquat.
- Timeout suivi d'un retry.
- Tentative d'auto-crédit par un utilisateur.
- Tentative de lecture du wallet d'un autre utilisateur.

ACCEPTATION
Le ledger permet de reconstituer l'historique financier. Les invariants de solde restent vrais sous concurrence. Aucun utilisateur ne peut créer ou modifier directement une écriture financière.
```

---

# 9. Phase 6 — AI Gateway, clés API et facturation

**Objectif :** fournir à chaque client un accès API individuel aux modèles autorisés, avec contrôle du budget et débit du wallet.

**Référence :** sections 2.1.F, 6.9, 7, 8, 9.5, 10.4, 11.5, 14 et 15.

## Décisions bloquantes

- Routeur et fournisseurs IA autorisés : **[À DÉCIDER]**.
- Utilisation de LiteLLM Proxy et versions supportées : à valider avec la documentation du déploiement.
- Conditions de revente, sous-comptes, clés virtuelles et affichage des prix : **[À VALIDER FOURNISSEUR]**.
- Politique de conversion, marge et préautorisation : **[À DÉCIDER]**.

## Prompt Copilot — Phase 6

```text
Tu implémentes le module AI Credits et l'intégration avec LiteLLM Proxy.

DOCUMENTS À LIRE
- STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md : sections 2.1.F, 6.9, 7, 8, 9.5, 10.4, 11.5, 14 et 15.
- Les tables ai_models, api_keys, ai_usage_logs, wallets, wallet_transactions, wallet_reservations et job_outbox.
- La documentation officielle LiteLLM et celle des fournisseurs de modèles réellement sélectionnés.

OBJECTIF
Permettre à un client de créer une clé API personnelle, d'appeler les modèles autorisés via la passerelle et de voir sa consommation facturée en XOF.

ARCHITECTURE
- LiteLLM Proxy est un service séparé, non intégré directement au runtime frontend.
- Le backend de la plateforme gère les utilisateurs, les droits, les crédits, les clés virtuelles et la facturation.
- Les clés maîtres fournisseur restent exclusivement dans le service sécurisé.
- Le client ne reçoit que sa clé virtuelle individuelle.
- Les tarifs et règles de facturation sont versionnés.

GESTION DES CLÉS
1. Créer une clé pour un utilisateur authentifié.
2. Associer la clé à un budget et aux modèles autorisés.
3. Afficher le secret uniquement au moment de sa création si c'est le comportement retenu.
4. Ne jamais stocker une clé en clair si un hash ou un stockage chiffré conforme suffit au besoin.
5. Révoquer, désactiver et renouveler une clé.
6. Empêcher un utilisateur de consulter les clés d'un autre.
7. Synchroniser l'état interne et l'état LiteLLM avec une stratégie de reprise.

FLUX D'APPEL ET FACTURATION
1. Authentifier la clé virtuelle.
2. Identifier l'utilisateur et ses permissions.
3. Vérifier le modèle et ses limites.
4. Estimer le coût maximal ou appliquer une préautorisation prudente.
5. Réserver les fonds disponibles dans le wallet.
6. Transmettre la requête au proxy.
7. Récupérer les métriques réelles d'utilisation disponibles.
8. Calculer le coût fournisseur avec une version de tarif identifiée.
9. Calculer le prix client selon la règle de marge validée.
10. Capturer le montant final et libérer le reliquat.
11. Enregistrer un usage log idempotent.
12. En cas d'échec, libérer ou corriger la réservation selon le résultat réel.
13. Gérer les réponses streamées et les interruptions sans perdre la comptabilisation.

PRÉCISION FINANCIÈRE
- Ne pas supposer qu'un token a le même prix pour tous les modèles.
- Distinguer tokens input, output, cache et autres unités facturées disponibles.
- Conserver le modèle, le fournisseur, le tarif et la devise utilisés au moment de l'appel.
- Utiliser des calculs décimaux sûrs pour les coûts fractionnaires.
- Ne pas facturer deux fois un même identifiant d'usage.
- Définir une politique pour les requêtes dont le coût final est inconnu ou dont la réponse réseau est interrompue.

TABLEAU DE BORD CLIENT
- Liste des clés.
- Création/révocation.
- Modèles disponibles et prix.
- Solde disponible.
- Historique de consommation.
- Détail des usages et unités facturées.
- Limites et erreurs compréhensibles.

ADMIN
- Gestion des modèles et de leur disponibilité.
- Gestion des tarifs versionnés.
- Gestion des marges.
- Suivi coûts fournisseur / revenus client.
- Suspension d'une clé ou d'un modèle.
- Journal d'audit.

SÉCURITÉ
- Rate limiting.
- Limites de budget.
- Protection contre l'épuisement du solde.
- Masquage des secrets dans les logs.
- Aucune clé maître dans le navigateur.
- Ne pas exposer le proxy d'administration LiteLLM au public.
- Vérifier les conditions de redistribution des fournisseurs avant activation commerciale.

ACCEPTATION
- Une clé client ne peut appeler que les modèles autorisés.
- Une clé révoquée ne fonctionne plus.
- Un wallet insuffisant bloque l'appel avant consommation non maîtrisée.
- Les usages sont enregistrés une seule fois.
- Les montants sont calculés selon un tarif versionné.
- Les fonds non consommés sont libérés.
- Les appels concurrents ne provoquent pas de solde négatif.
- Les erreurs, timeouts et streams interrompus sont testés.
- L'intégration réelle est activée uniquement avec une configuration et une autorisation validées.

Commence par un diagramme de séquence et une analyse des limites de facturation LiteLLM avant d'écrire le code.
```

---

# 10. Phase 7 — Administration, support et reporting

**Objectif :** fournir à l'équipe opérationnelle les outils nécessaires pour gérer les ventes, les incidents, les marges et les clients.

**Référence :** sections 2.1.G, 6.11, 6.12, 12.4, 14 et 15.

## Livrables

- Dashboard admin protégé.
- Gestion utilisateurs et rôles.
- Gestion catalogue, variantes et prix.
- Gestion commandes, paiements et livraisons.
- Gestion fournisseurs et mappings.
- Gestion wallet avec actions contrôlées.
- Gestion modèles, tarifs et clés IA.
- Support et notes internes.
- Reporting ventes, coûts et marges.
- Audit des actions administratives.

## Prompt Copilot — Phase 7

```text
Tu implémentes le back-office d'administration, les outils de support et le reporting.

DOCUMENTS À LIRE
- STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md : sections 2.1.G, 6.11, 6.12, 12.4, 14 et 15.
- Les règles de rôles et permissions.
- Les tables, migrations et modules déjà implémentés.

OBJECTIF
Créer une interface d'exploitation sécurisée qui permet de gérer le commerce Gaming et AI Credits sans contourner les règles métier ou financières.

DOMAINES ADMIN
1. Vue d'ensemble : ventes, commandes, paiements, livraisons et incidents.
2. Utilisateurs : recherche, profil, statut et rôle selon permission.
3. Catalogue : catégories, produits, variantes, prix, publication.
4. Fournisseurs : statut, mapping produits, coûts et erreurs.
5. Commandes : filtres, détails, transitions permises.
6. Paiements : références, montants, statuts, événements webhook.
7. Livraisons : attente, succès, échec, revue et réconciliation.
8. Wallet : consultation, historique et ajustement contrôlé.
9. AI Gateway : modèles, tarifs, marges, clés et usages.
10. Support : notes internes, incidents et historique.
11. Audit : acteur, action, ressource, date et motif.

RÈGLES
- Toute action admin sensible est autorisée côté serveur.
- Ne pas se contenter de masquer un bouton dans l'interface.
- Les actions financières utilisent les fonctions métier transactionnelles.
- Aucun admin ne modifie directement une écriture ledger.
- Les remboursements et ajustements exigent un motif.
- Les actions de support ne doivent pas révéler les secrets de livraison ou les clés maîtres.
- Les actions critiques produisent une entrée d'audit.
- Les listes sont paginées et filtrées côté serveur.
- Les tableaux ne doivent pas charger toutes les lignes en mémoire.
- Les données de reporting doivent distinguer revenus encaissés, coûts fournisseurs, remboursements, soldes wallet et marges.

UX
- Navigation par domaines.
- Recherche et filtres.
- Détails avec timeline d'événements.
- Confirmation explicite des actions destructrices ou financières.
- États vides, erreurs et chargements.
- Responsive, mais priorité à l'efficacité desktop pour l'équipe opérationnelle.

REPORTING
Définir clairement chaque indicateur et sa source. Ne pas assimiler recharge wallet, chiffre d'affaires Gaming, solde wallet et revenu reconnu. Afficher les dates, devises et règles de calcul.

ACCEPTATION
- Un client normal ne peut accéder à aucune route admin.
- Les rôles opérationnels ont des permissions minimales.
- Les actions sensibles sont auditées.
- Les listes sont paginées.
- Les statuts affichés proviennent de la base et des adaptateurs, pas de données statiques.
- Les chiffres financiers sont reproductibles à partir des écritures.
- Les actions de remboursement et ajustement respectent le ledger.
- Les tests d'autorisation et d'audit passent.
```

---

# 11. Phase 8 — Sécurité, qualité, observabilité et mise en production

**Objectif :** valider l'ensemble des flux, sécuriser les données et préparer une mise en production contrôlée.

**Référence :** sections 11, 13, 14, 15, 16, 19 et 21.

## Livrables

- Matrice de tests complète.
- Tests unitaires, intégration et E2E.
- Audit RLS.
- Tests de webhooks et idempotence.
- Logs structurés et alertes.
- Runbooks opérationnels.
- CI/CD.
- Sauvegarde et restauration testées.
- Checklist de lancement.
- Procédure de retour arrière.

## Prompt Copilot — Phase 8

```text
Tu réalises le hardening final et la préparation de production de la plateforme Gaming Store & AI Credits.

DOCUMENTS À LIRE
- STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md : sections 11, 13, 14, 15, 16, 19 et 21.
- Toute la documentation et les migrations.
- Les tests existants et les workflows CI/CD.

OBJECTIF
Évaluer et corriger les risques avant lancement. Ne déclare jamais la plateforme prête sur la seule base d'un build réussi.

AUDIT SÉCURITÉ
1. Vérifier toutes les routes publiques, client, admin, webhook et internes.
2. Vérifier toutes les politiques RLS.
3. Vérifier les contrôles d'autorisation côté serveur.
4. Rechercher les secrets exposés, logs sensibles et variables mal préfixées.
5. Vérifier la protection des codes de livraison.
6. Vérifier la gestion des clés API client et maîtres.
7. Vérifier rate limiting, validation d'entrée et protections contre abus.
8. Vérifier les dépendances et vulnérabilités connues selon les outils disponibles.
9. Vérifier CORS, headers, cookies, CSRF selon les mécanismes utilisés.
10. Vérifier les accès au service worker, jobs internes et endpoints administratifs.

AUDIT FINANCIER
1. Vérifier les calculs XOF et les arrondis.
2. Vérifier le ledger append-only.
3. Vérifier les opérations concurrentes.
4. Vérifier les doubles webhooks.
5. Vérifier les paiements à statut ambigu.
6. Vérifier les remboursements et compensations.
7. Vérifier les réservations wallet et appels IA concurrents.
8. Vérifier qu'aucun statut frontend ne peut déclencher une livraison ou un crédit.

TESTS
- Unitaires pour les règles métier.
- Intégration DB pour les transactions et RLS.
- Tests contractuels pour chaque adaptateur.
- E2E pour inscription, commande, paiement, livraison et wallet.
- Tests IA : clé invalide, clé révoquée, budget insuffisant, modèle interdit, timeout, stream interrompu et double usage.
- Tests de charge raisonnables sur les endpoints critiques.
- Tests de reprise worker et de job bloqué.

OBSERVABILITÉ
- Logs structurés avec correlation ID.
- Métriques de paiements, webhooks, commandes et livraisons.
- Métriques de consommation et coûts IA.
- Alertes sur échecs répétés, backlog outbox et anomalies financières.
- Aucun secret ou code cadeau en clair dans les logs.

EXPLOITATION
Créer/compléter les runbooks :
- paiement confirmé mais commande non mise à jour ;
- webhook absent ou invalide ;
- livraison en attente ou ambiguë ;
- fournisseur indisponible ;
- remboursement ;
- solde wallet incohérent ;
- job outbox bloqué ;
- clé API compromise ;
- incident LiteLLM ;
- restauration après incident.

DÉPLOIEMENT
- Vérifier les variables d'environnement par environnement.
- Vérifier les migrations avant déploiement.
- Définir l'ordre de déploiement application, worker, LiteLLM et base.
- Définir la stratégie de rollback.
- Vérifier les sauvegardes et réaliser un test de restauration.
- Ne pas lancer de migration destructive sans plan explicite.
- Ne pas activer les vrais fournisseurs avant validation contractuelle et technique.

RAPPORT FINAL
Produire :
1. liste des tests exécutés et résultats réels ;
2. vulnérabilités et risques restants ;
3. éléments bloquants ;
4. checklist go/no-go ;
5. procédure de rollback ;
6. état de chaque intégration externe ;
7. mise à jour de PROGRESS.md.

ACCEPTATION
La mise en production est autorisée uniquement si les critères critiques sont satisfaits et si les risques non résolus sont explicitement acceptés par le propriétaire du produit. Ne masque aucun échec et ne fabrique aucun résultat de test.
```

---

# 12. Prompts transversaux pour les tâches récurrentes

Ces prompts ne remplacent pas une phase. Ils servent pendant tout le développement.

## 12.1 Audit avant modification

```text
Avant de modifier le code, audite le dépôt en te concentrant sur la fonctionnalité demandée.

Lis STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md et les sections pertinentes.

Retourne :
1. état actuel du code ;
2. fichiers et modules concernés ;
3. dépendances ;
4. règles métier applicables ;
5. risques de régression ;
6. migrations éventuellement nécessaires ;
7. tests à ajouter ;
8. plan d'implémentation ordonné.

Ne modifie aucun fichier avant d'avoir présenté ce plan.
```

## 12.2 Correction de bug

```text
Corrige le bug suivant sans réécrire le module entier.

BUG :
[Décrire le comportement observé.]

COMPORTEMENT ATTENDU :
[Décrire le résultat correct.]

CONTRAINTES :
- Lire la structure globale et le code concerné.
- Reproduire le bug avec un test si possible.
- Identifier la cause racine.
- Corriger au niveau approprié (UI, use case, DB ou adaptateur).
- Ne pas masquer l'erreur par un fallback silencieux.
- Ajouter un test de non-régression.
- Lancer les vérifications.
- Expliquer les fichiers modifiés et les limites restantes.
```

## 12.3 Revue de code

```text
Effectue une code review de ce changement comme un reviewer senior.

Priorités :
1. bug fonctionnel ;
2. faille de sécurité ou d'autorisation ;
3. incohérence financière ;
4. violation de l'architecture modulaire ;
5. problème de concurrence ou d'idempotence ;
6. gestion des erreurs et reprise ;
7. performance ;
8. accessibilité et UX ;
9. qualité et maintenabilité.

Ne félicite pas le code par défaut. Liste les constats par gravité, avec fichier et emplacement, impact et correction proposée. Si aucun problème n'est détecté, précise le périmètre réellement vérifié.
```

## 12.4 Vérification de cohérence avec la structure globale

```text
Compare l'implémentation actuelle à STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md.

Construis un tableau :
- exigence de référence ;
- statut (fait / partiel / absent / divergence) ;
- fichier ou preuve ;
- risque ;
- prochaine action.

Ne considère pas une fonctionnalité comme terminée parce qu'un écran existe. Vérifie le backend, les permissions, la persistance, les erreurs et les tests.
Ne modifie rien pendant cet audit.
```

## 12.5 Préparation d'une migration Supabase

```text
Prépare une migration Supabase pour le changement suivant :
[Décrire le changement.]

Avant d'écrire le SQL :
- inspecte le schéma réel ;
- vérifie les migrations précédentes ;
- identifie les dépendances, données existantes et politiques RLS ;
- évalue le verrouillage et le risque de perte de données ;
- propose une stratégie de déploiement et de rollback.

Règles :
- ne modifie jamais une migration déjà appliquée ;
- crée une nouvelle migration versionnée ;
- ajoute index, contraintes et RLS nécessaires ;
- privilégie les migrations compatibles avec l'application déjà déployée ;
- prévois les tests SQL et applicatifs ;
- ne lance aucune migration destructive sans validation explicite.
```

## 12.6 Préparation d'une intégration fournisseur

```text
Prépare l'intégration de :
[Nom du fournisseur / agrégateur.]

Documentation officielle disponible :
[Chemin du fichier ou URL/document fourni.]

Ne code pas immédiatement.

Vérifie :
- disponibilité au Togo ;
- produits et régions couverts ;
- devise et frais ;
- droits de revente ;
- authentification ;
- endpoints ;
- signatures webhook ;
- statuts et erreurs ;
- idempotence ;
- sandbox ;
- limites et délais ;
- remboursements ;
- exigences contractuelles.

Sépare les faits documentés des points inconnus. Propose ensuite un adaptateur isolé et ses tests contractuels. N'invente aucune capacité.
```

---

# 13. Checklist de validation à la fin de chaque phase

Copier cette checklist dans `docs/PROGRESS.md` et la remplir réellement.

```markdown
## Phase [N] — [Nom]

- [ ] Documentation de référence lue
- [ ] État initial du dépôt audité
- [ ] Plan validé
- [ ] Fichiers modifiés identifiés
- [ ] Migrations versionnées et vérifiées
- [ ] Autorisations et RLS vérifiées
- [ ] Gestion des erreurs implémentée
- [ ] Tests unitaires ajoutés
- [ ] Tests d'intégration ajoutés si nécessaires
- [ ] Tests E2E ajoutés si nécessaires
- [ ] Lint réussi
- [ ] TypeScript réussi
- [ ] Build réussi
- [ ] Revue du diff effectuée
- [ ] Documentation mise à jour
- [ ] Risques restants documentés
- [ ] Critères d'acceptation validés
```

Une case ne doit être cochée que si la vérification a été effectuée. Une fonctionnalité mockée ne doit jamais être marquée comme intégration réelle.

---

# 14. Convention Git et validation locale

Effectuer un commit après chaque phase validée ou lot cohérent. Ne pas accumuler toutes les phases dans un seul commit.

Exemple :

```bash
git status
git add .
git commit -m "chore: initialize project foundation"

git add .
git commit -m "feat(auth): implement authentication and profiles"

git add .
git commit -m "feat(catalog): implement gaming catalog and orders"

git add .
git commit -m "feat(payments): integrate payment workflow"

git add .
git commit -m "feat(delivery): implement provider delivery pipeline"

git add .
git commit -m "feat(wallet): implement wallet ledger"

git add .
git commit -m "feat(ai): implement AI gateway and usage billing"

git add .
git commit -m "feat(admin): implement administration dashboard"

git add .
git commit -m "test: harden platform for production"
```

Avant chaque commit :

```bash
git status
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Adapter les scripts aux commandes réellement présentes dans `package.json`. Ne pas exécuter une commande inexistante en prétendant qu'elle a réussi.

---

# 15. Définition de « terminé »

Une phase est terminée uniquement lorsque :

1. le comportement métier demandé est implémenté ;
2. les données sont persistées dans la base prévue ;
3. les autorisations sont appliquées côté serveur et/ou RLS ;
4. les états d'erreur, chargement et absence de données sont traités ;
5. les règles d'idempotence et de concurrence sont prises en compte lorsqu'elles s'appliquent ;
6. les tests pertinents passent réellement ;
7. lint, TypeScript et build passent ;
8. la documentation et `PROGRESS.md` sont à jour ;
9. les écarts et risques restants sont connus ;
10. le diff a été relu.

**Un écran statique, un bouton sans logique, une réponse mockée ou un endpoint non testé ne constituent pas une fonctionnalité terminée.**

---

# 16. Décisions à obtenir avant les intégrations réelles

Les points suivants doivent être consignés dans `docs/DECISIONS.md` :

| Décision | État |
|---|---|
| Nom commercial et identité visuelle | À décider |
| Domaine et hébergement définitifs | À décider |
| Agrégateur de paiement | À décider / vérifier au Togo |
| Méthodes réellement activées (Flooz, Mixx) | À valider fournisseur |
| Frais et délais de règlement | À valider fournisseur |
| Fournisseur Gaming initial | À décider |
| Droits de revente par produit et région | À valider fournisseur |
| Produit Gaming de lancement | À décider |
| Politique de remboursement | À décider |
| Canaux de notification | À décider |
| Fournisseurs IA autorisés | À décider / valider contractuellement |
| Règle de marge IA | À décider |
| Préautorisation maximale des appels IA | À décider |
| Politique de conservation des logs | À décider |
| Conditions légales et obligations locales | À vérifier avec un professionnel compétent |

Ne pas bloquer la réalisation du socle technique sur les décisions qui ne sont pas encore nécessaires. En revanche, aucune intégration commerciale réelle ne doit être activée avant validation de ses prérequis.

---

# 17. Première instruction à donner à Copilot

Commencer uniquement par cette demande, et non par la phase 1 ou les phases suivantes :

```text
Lis intégralement STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md ainsi que
docs/DEVELOPMENT_PLAN_AND_COPILOT_PROMPTS.md.

Nous allons construire la plateforme phase par phase. Tu ne dois pas
implémenter plusieurs phases en même temps.

Pour le moment :
1. audite le dépôt actuel ;
2. identifie le framework, les versions, les dépendances et les scripts ;
3. compare l'arborescence actuelle à la structure cible ;
4. liste les éléments déjà présents, absents et divergents ;
5. propose un plan précis pour la PHASE 0 uniquement ;
6. identifie les décisions bloquantes ;
7. indique les commandes de validation qui seront utilisées.

Ne modifie aucun fichier avant de m'avoir présenté ce diagnostic et ce plan.
```

---

## Principe final

**Copilot est l'agent d'exécution ; `STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md` est la référence d'architecture ; ce document est le plan de réalisation.**

La progression doit rester séquentielle, vérifiable et réversible. La priorité commerciale est de fiabiliser le parcours Gaming `catalogue → commande → paiement confirmé → fournisseur → livraison`. Le Wallet et AI Credits s'appuient ensuite sur cette infrastructure, sans contourner ses garanties de sécurité et de traçabilité.

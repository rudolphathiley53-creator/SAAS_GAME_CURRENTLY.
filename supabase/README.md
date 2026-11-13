# Supabase

Le projet de référence n’avait aucune table métier publiée au moment de l’audit
read-only. La migration `20261111130000_identity_and_public_catalog.sql` constitue une
première tranche : profils Auth et lecture publique du catalogue publié.

Elle n’ajoute aucune donnée de démonstration et n’est pas appliquée au projet distant.
Exécuter le SQL localement avec Supabase CLI après revue. Les tables des commandes,
paiements, fournisseurs, wallet, livraisons, jobs et IA restent dans des migrations
ultérieures afin de ne pas créer un schéma financier incomplet.

## Configuration et préparation locale

`supabase/config.toml` est initialisé. Les seeds sont désactivés : aucun
catalogue ou compte fictif n’est chargé. Docker Desktop doit être démarré pour
valider la migration localement :

```sh
npx supabase start
npx supabase db reset
npx supabase gen types typescript --local > src/types/database.generated.ts
```

`db reset` réinitialise uniquement la base Supabase locale et applique les
migrations locales. Comparer les types générés avec
`src/types/database.types.ts` avant de les intégrer; le fichier généré ne doit
pas être remplacé silencieusement.

La migration actuelle n’a pas été exécutée localement ni appliquée au projet
distant. Le `.env.local` et les identifiants locaux n’ont pas été créés. Après
validation locale et authentification avec `npx supabase login`, lier le projet
de production avec sa référence :

```sh
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push --dry-run
npx supabase db push
```

La dernière commande modifie la base distante : ne l’exécuter qu’après
confirmation explicite et après vérification de son dry-run. Un
publishable/anon key ne suffit pas. Ne jamais mettre le token CLI ou une clé
`service_role` dans le dépôt ou le chat.

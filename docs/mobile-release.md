# Recette mobile et livraison

État au 2026-09-08, branche `codex/kawaii-cat-tree`. La Bible, IMPLEMENTATION_STATUS et la roadmap font autorité. Aucun résultat sur appareil physique n'est encore consigné.

## Preuves disponibles

- Compilation web et validation de 110 grilles (règles, contraintes, unicité).
- Tests du moteur, Human Solver, progression, sauvegardes, tentative, indices et apprentissage.
- CI `verify`, Android debug et iOS simulateur réussies pour a2bff0cbbdf0ea9f6b0a6ce597af4942a154f360.
- Recette web : placement, erreur, retry, achat/relecture d'indice, sauvegarde, victoire et niveau suivant ; apprentissage SAME du niveau 2.
- Application native `re.meowza.game`, assets locaux, Preferences, audio/haptique et cycle arrière-plan déjà intégrés.

Un build debug ou simulateur n'est pas un binaire signé pour les stores et ne prouve pas l'absence de chauffe. Les anciens scénarios Undo/Reset/étoiles ne s'appliquent plus.

## Préparer les essais

Identifier le commit, le binaire, le modèle de téléphone, la version du système, la date et le testeur. Utiliser une installation de test dédiée ; ne pas effacer les données d'un joueur pour créer un scénario. Tester au moins un iPhone et un Android représentatifs, dont un appareil modeste. Conserver un cas de migration depuis une sauvegarde existante.

Les artefacts Android debug sont produits par `Native smoke build`. iOS doit être installé avec la configuration de signature et les comptes du propriétaire avant un essai physique.

## Parcours fonctionnel

| Cas | Attendu | iPhone | Android |
|---|---|---|---|
| Premier lancement | Accueil → jeu ; apprentissage sur la grille ; règles séparées | À tester | À tester |
| L1–4, puis L5 | Repères logiques lisibles ; L5 sans guidage ; aucune croquette débitée par une leçon | À tester | À tester |
| Toucher précis / léger mouvement | Sélection stable ; bon chat accepté ; aucune perte de chance en retouchant une case remplie | À tester | À tester |
| Erreurs 1, 2, 3 | Mauvais chat rejeté ; cœur dégradé ; troisième erreur terminale | À tester | À tester |
| Retry | Même grille initiale, erreurs 0, indices 0/3, premier prix 15 ; portefeuille conservé | À tester | À tester |
| Indices 15/25/40 | Prix annoncé ; trois maximum ; relecture sans double débit dans la même tentative | À tester | À tester |
| Solde insuffisant | Achat impossible ; règles et retry accessibles | À tester | À tester |
| Retour / fermeture réelle | Grille, erreurs, indices et chrono de la tentative active conservés | À tester | À tester |
| Chrono | Premier placement démarre ; arrière-plan/explication suspendent ; timeout perd une fois | À tester | À tester |
| Victoire / double toucher | Récompense unique par niveau ; pas d'étoiles ; niveau suivant direct | À tester | À tester |
| Replay ancien niveau | Accessible, sans nouvelle récompense ; Continuer reprend cette tentative active | À tester | À tester |
| Arbre / décoration | Défilement sans lancement accidentel ; équipement et position conservés | À tester | À tester |
| Réglages / hors ligne | Audio, vibrations, mouvements réduits et reprise fonctionnent | À tester | À tester |
| Migration | Victoires, portefeuille, inventaire et grille en cours conservés | À tester | À tester |

Tester le retour matériel Android depuis règles et indices, les zones sûres, les interruptions système et une grille 8×8. Consigner tout écart avec étapes de reproduction, attendu, constaté et capture si utile.

## Session novice de vingt minutes

Laisser jouer sans explication extérieure. Noter les hésitations sur sélection, équilibre ligne/colonne, SAME, trio, DIFFERENT, cœur et loupe. Relever niveaux atteints, erreurs, recours aux règles/indices et décision spontanée de continuer. Après la session, demander au joueur d'expliquer les règles avec ses mots. Ne pas confondre une partie résolue avec une règle comprise.

## Performance réelle

Mesurer démarrage, fluidité, mémoire et batterie à froid puis après vingt minutes, et noter la chauffe ressentie ainsi que le contexte (chargeur, luminosité, température ambiante). Le rendu est plafonné à 30 images/s ; ce plafond ne constitue pas une mesure. Aucune température, autonomie ou latence acceptable n'est annoncée comme validée sans données d'appareil.

## Conditions de sortie commerciale

- Recette physique renseignée, anomalies bloquantes corrigées et vérifiées.
- Finition produit/graphique validée et systèmes réellement inclus dans la version testés.
- Versions du package, réglages et projets natifs harmonisées avant gel du binaire.
- Icônes, splash, masques adaptatifs et captures contrôlés sur les cibles.
- Comptes éditeur, signatures, support et documents de confidentialité du binaire final configurés.
- Si achats/publicités activés : produits, restauration, interruptions et SDK testés en sandbox.
- Si Daily/Cat Day inclus : serveur, identité, classement et distributions réellement validés.

Aucune publicité, aucun achat réel ni Daily serveur n'est actuellement livré. Aucun binaire signé ou dossier store soumis n'est revendiqué.

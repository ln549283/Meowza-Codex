# Parcours et raisonnement humain

Le parcours principal ne possède pas de dernier niveau prédéfini. Il affiche des portions de 24 sommets, avec cinq nuages d’aperçu ; les boutons bas/haut permettent de revisiter les portions déjà atteintes. Chaque victoire ouvre le sommet suivant. Les anciens niveaux terminés restent dans « Mes anciens sommets » : ils ne sont ni renumérotés ni remplacés par une autre grille.

## Rythme et calibration

- Sommets 1–12 : Facile, Facile, Moyen, Facile, Moyen, Facile.
- Sommets 13–36 : Facile, Moyen, Moyen, Facile, Difficile, Facile.
- Puis : Moyen, Moyen, Difficile, Facile, Difficile, Moyen.
- Facile : 4×4, au moins 9 cases données, déductions directes uniquement.
- Moyen jusqu’au sommet 18 : 4×4, au moins 8 données, déductions directes uniquement.
- Moyen ensuite : 6×6, au moins 21 données, déductions directes uniquement.
- Difficile : 6×6, au moins 12 données, hypothèses contradictoires de profondeur 1 autorisées.
- Extrême : détour facultatif, 8×8, nécessite au moins une hypothèse ; résolu avec une profondeur maximale de 1. Il ne bloque jamais le chemin principal.

Tous les six sommets, un refuge peut être aménagé avec un hamac ou une cabane. Le choix est sauvegardé et modifiable. Les récompenses ne dépendent ni des étoiles ni de l’absence d’indices.

Ces seuils sont une calibration initiale, pas une mesure de difficulté ressentie validée par une étude de joueurs. Les 120 premiers sommets ont été contrôlés, ainsi que plusieurs défis et une graine lointaine. Le contrôle logique est aussi exécuté pour chaque nouvelle grille générée.

## Deux solveurs distincts

`solver.ts` conserve la recherche classique pour résoudre et compter les solutions. `humanSolver.ts` ne consulte jamais `level.solution` et n’appelle jamais le solveur classique. Il utilise :

1. les liens SAME/DIFFERENT ;
2. le quota de moitié de chaque famille dans chaque ligne/colonne ;
3. l’interdiction des trios, y compris chat-vide-chat ;
4. si nécessaire, une hypothèse temporaire, suivie de ces mêmes règles. Une contradiction prouve la valeur opposée.

Une hypothèse qui aboutit simplement à une solution n’est jamais présentée comme une preuve. Sans preuve, le résultat est « stuck » ; dépasser le budget retourne « budget », jamais une contradiction. Chaque étape expose sa règle, sa position, sa valeur et son explication. Les preuves par contradiction conservent toutes les conséquences pour le lecteur d’indices. Les indices sur les anciens niveaux peuvent utiliser une profondeur 2 ; les 110 anciens niveaux ont été vérifiés avec cette limite.

Le générateur retire une donnée seulement si le solveur humain termine encore la grille. Chaque retrait conserve donc une preuve de résolution ; une grille atteinte par des déductions forcées à partir des données possède une solution unique. Le solveur classique vérifie indépendamment cette propriété dans les tests échantillonnés.

## Stabilité et fluidité

La génération tourne dans un Web Worker, avec message d’attente, limite de temps et reprise sur erreur. La graine dépend du numéro et du type de sommet. Les grilles produites sont sauvegardées avec la progression sous des identifiants distincts des anciens chapitres ; modifier l’algorithme futur exigera une nouvelle version, sans remplacer les grilles sauvegardées. Comme toute application locale, stockage et numérotation restent soumis aux capacités de l’appareil.

## Interface

Cœur vectoriel = identiques, trois griffes vectorielles = opposés. Les symboles ne dépendent pas d’une police emoji. Boutons glossy, réaction souple des chats, pulsation d’un lien satisfait, vague sur une ligne terminée et ouverture des nuages. Les animations réduites désactivent ces effets.

Le tutoriel comporte quatre cartes illustrées avec de petits essais tactiles ; on peut le consulter depuis une partie et revenir à la même grille. Les indices proposent un raisonnement paginé, puis le choix de jouer soi-même ou de faire placer le chat.

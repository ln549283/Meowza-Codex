# Meowza — audit de direction et décision de production

État vérifié le 28 septembre 2026 sur `kawaii-cat-tree-refonte-v3`, commit `15a3b20`. Ce document propose une direction ; il ne modifie aucune règle du jeu. Les éléments décrits comme « cible » requièrent validation avant production.

## A. Diagnostic actuel

**Ce qui mérite d'être conservé.** Le puzzle binaire, la solution unique, le solveur humain, la génération déterministe, les cinq premiers niveaux progressifs, le retry gratuit et le parcours continu forment déjà un socle sérieux. La progression est sauvegardée, les missions quotidiennes locales fonctionnent, l'arbre ne crée que les tronçons voisins, et les premiers visuels de Nimbus, Moka et de l'arbre ont une vraie promesse. `npm run check` passe : 58 tests, 110 grilles validées et build web.

**Ce qui bloque la qualité commerciale.** L'accueil promet un jeu illustré et vivant ; l'arbre répète essentiellement trois grandes compositions, les paliers se ressemblent, le plateau et les écrans méta assemblent des images et des formes sans système d'interface stable. Le bouton Défi du jour ouvre les missions, sans défi. La boutique ne propose que six décors achetables avec les croquettes ; les diamants gagnés par mission n'ont aucun usage. Le jeu ne vend rien, n'a ni achat intégré ni publicité récompensée. Le catalogue de 50 chats est un manifeste (40 standard, 10 premium), dix nouveaux PNG existent dans `cats-v2`, tandis que seulement six anciens chats sont préchargés et collectionnables dans le runtime. Les changements de bois et tissu sont des recolorations de pixels dans un tronçon composé, ce qui limite la vraie personnalisation. Les récompenses de chats sont déterministes tous les dix niveaux, puis s'arrêtent après six chats.

Le code `ui.ts` étire `ui/panel.png` (532 × 296 px) vers des panneaux de formes très différentes. `motion.ts` ne charge qu'une image fixe par effet, et le personnage n'a plus de séquence animée utilisée. `AudioService.ts` joue de courts oscillateurs sinusoïdaux et une boucle de notes optionnelle, désactivée par défaut. `main.ts` plafonne la boucle à **30 FPS**. Le build contient environ **83 Mo**, dont des centaines d'images d'animation non chargées par le jeu : la dette d'assets pèse donc sur le paquet même quand elle n'apparaît pas à l'écran.

**Ruptures de la chaîne produit :**

| Étape | Force actuelle | Rupture vérifiée | Hypothèse de correction |
| --- | --- | --- | --- |
| Acquisition | Deux mascottes, promesse de puzzle félin | Capture de jeu moins expressive que l'accueil | Montrer une grille lisible et un arbre habité dans les visuels store |
| 0–5 min | Cinq grilles guidées, retry immédiat | Page de règles de quatre écrans avant la première grille ; récompense sans révélation marquante | Première action jouable rapide, règles contextuelles, première récompense visible |
| Suite | Niveau suivant direct, difficulté croissante | Arbre répétitif, jackpot de palier peu incarné | Chat aperçu avant son palier ; arrivée et installation visibles |
| Retour | Trois missions locales | Doublon de navigation « Défi du jour », diamants inutiles | Un seul rendez-vous quotidien honnête et une récompense employable |
| Collection | Chats attribués au parcours | Six disponibles, peu d'expression et de contrôle d'habitat | Petit catalogue distinctif, fiche, pose et placement immédiats |
| Achat | Volonté de cosmétiques | Aucune offre réelle ni objet premium observable | Quelques achats directs de chats ou ensembles dont le rendu est prévisualisable |

L'affirmation « 85 % terminé » peut décrire le code fonctionnel de base, **pas** le chemin vers un produit commercial prêt à publier. Le potentiel de revenu dépend aussi de l'acquisition, qui n'est pas résolue par un catalogue plus grand.

## B. Vision cible

En ouverture, Nimbus et Moka proposent immédiatement une petite grille. Après une première déduction, les cases répondent avec une animation courte et un son reconnaissable ; la résolution ouvre l'arbre sur le prochain perchoir. L'écran d'arbre montre environ une fenêtre de niveaux lisibles, un prochain palier concret, et quelques chats *possédés* qui occupent les supports sans recouvrir les numéros. Toucher un chat ouvre sa fiche et son placement. Gagner un palier dévoile et installe un chat ou un objet avec une petite scène de récompense. Une boutique présente quelques personnages et thèmes directement, au prix explicite, dans le même décor. Le joueur peut jouer sans attendre ni payer.

Promesse à tester en une phrase : **« Résous une grille, fais vivre ton arbre. »** Le test de qualité est la cohérence entre capture store, première minute, victoire et arbre, et non le nombre de systèmes visibles.

## C. Keep / Modify / Remove / Add

| Décision | Système | Pourquoi |
| --- | --- | --- |
| KEEP | Règles, solveur humain, progression hybride, retry gratuit, sauvegardes | Base différenciable et techniquement éprouvée |
| KEEP | Arbre unique et Nimbus/Moka | Identité potentielle si les personnages vivent dans le jeu |
| MODIFY | Tutoriel, écran de grille, barre d'indices et cœur | Première action plus rapide ; règles et feedback plus clairs |
| MODIFY | Arbre et paliers | Répétition contrôlée, fenêtres de niveau lisibles, habitants et récompenses concrètes |
| MODIFY | Collection | Dix à seize chats réellement distincts au lancement, catalogués et plaçables ; expansion ensuite |
| MODIFY | Croquettes | Réserver aux indices et, au plus, à de petits objets gagnables ; vérifier gains et dépenses |
| MODIFY | Missions | Deux ou trois objectifs atteignables ; récompenses utilisables immédiatement |
| REMOVE du lancement | Bouton « Défi du jour » qui redirige vers Missions | Promesse non tenue ; remplacer par « Bientôt » seulement si nécessaire, sinon retirer |
| REMOVE du lancement | Diamants affichés et accumulés sans usage | Dette économique et promesse prématurée ; préserver les soldes enregistrés pour une migration ultérieure |
| REMOVE | Étoiles des plaques et mission « Maître des étoiles » | Contradiction avec la Bible et bruit visuel ; garder les statistiques de précision |
| REMOVE du paquet | Images jamais chargées par le runtime | Taille et complexité inutiles ; garder les sources hors paquet distribué |
| ADD | Fiches de chats, prévisualisation dans l'arbre, quelques interactions | Attachement et désir d'objet spécifique |
| ADD | Système UI de composants redimensionnables et langage motion/audio | Finition reproductible sur tous les écrans |
| ADD | Quelques offres directes testées, restauration des achats et contrôle natif | Première possibilité de chiffre d'affaires, sans monnaie premium intermédiaire |

Ces suppressions du lancement ne préjugent pas des fonctions futures. Conserver la compatibilité des sauvegardes, notamment le solde de diamants historiques.

## D. Core loop cible

**Partie :** lire une contrainte → déduire → poser un chat → retour instantané clair → compléter la grille → victoire brève → niveau suivant. Les placements corrects ne doivent pas exiger de confirmation. L'indice apprend une déduction, avec coût et quota explicites.

**Méta :** victoire → progression visible dans l'arbre → anticipation d'un chat/décor → palier → révélation → placement/personnalisation → nouvelle grille. La récompense doit changer quelque chose de visible *à l'endroit où le joueur progresse*.

## E. Progression et rétention

- Première session : entrer vite en grille, réussir 2–3 puzzles, voir le premier chat personnalisable et le palier à venir. Tester réellement le temps nécessaire, sans promettre une durée arbitraire.
- Premiers 20 niveaux : variété de déductions et pauses faciles ; première récompense tangible avant le niveau 10 si les tests montrent une sortie précoce.
- Ensuite : palier prévu tous les dix niveaux, mais pas toujours la même animation ni le même type de lot ; aperçu du prochain contenu. Éviter qu'un joueur ait 40 niveaux à faire pour revoir quelque chose de nouveau.
- Retour quotidien : mission courte qui accompagne la partie normale et récompense concrète ; Daily mondial et compétition différés tant que la population et le coût de sécurité serveur ne le justifient pas.
- Suivre avec consentement adapté : début/fin tutoriel, échecs par niveau, dépenses d'indices, première récompense, retour J1/J7, clics et achats d'offres. Les nombres ne valent que sur de vrais joueurs.

## F. Économie et monétisation

**Recommandation de lancement :** croquettes gagnées pour les indices ; chats standard et petits décors gagnés par progression ; **3 à 5 chats ou ensembles premium nommés vendus directement**, avec aperçu dans l'arbre, prix réel affiché, achat et restauration fiables. Pas de diamant tant qu'il n'existe pas de catalogue ou événement nécessitant vraiment une seconde monnaie. Ne pas vendre du hasard payant. Un chat premium n'apporte aucun avantage de puzzle. Offres de départ à tester : personnage seul, duo cohérent, thème arbre avec chat et coussin ; prix à déterminer après recherche de marché et validation des coûts stores, pas à figer sur intuition.

La boutique actuelle qui facture des décors en croquettes concurrence les indices, alors que la Bible veut séparer aide et collection. Migrer ces petits décors vers des récompenses de jeu, ou une petite monnaie gratuite séparée seulement si les tests prouvent sa nécessité. Préserver les objets déjà achetés. Une seule devise premium ne devient pertinente que si des événements et un catalogue régulier rendent les achats directs pénibles à gérer.

La pub récompensée après une erreur/chrono peut être un test **après** que la défaite et le retry satisfont déjà ; elle n'offre qu'un emplacement occasionnel et n'est pas une base de revenu solide. Sans acquisition, les IAP non plus : à titre de sensibilité, **1 000 installations × 2 % d'acheteurs × 3 € de panier = 60 € bruts**, avant frais et coûts. Ces taux ne sont pas une prévision. Il faut un test store et une source d'installations avant de dimensionner le catalogue ou un backend Live Ops.

## G. Direction définitive de l'arbre

**Le garder et le restructurer.** Il est le meilleur pont entre puzzle, progression et collection. Conserver les chunks et la virtualisation ; diversifier des supports et petits événements à partir d'un kit de composants compatible avec les raccords. Un niveau garde toujours une plaque lisible, une difficulté identifiable autrement que par la couleur, et une zone tactile claire. Un emplacement d'habitant est indépendant de la plaque : le chat peut être posé sur un coussin de n'importe quel tronçon possédé, pas seulement au palier 10. Limiter l'occupation visuelle dans la fenêtre : un chat principal et quelques silhouettes moins contrastées, jamais une foule qui masque le trajet.

Les palettes de bois/tissu actuellement recalculées dans `treeStyle.ts` ne permettent pas des coussins ou une niche individuels : prévoir des calques de décor sur des **slots** indépendants, ou une variante de tronçon complète pour les gros thèmes. Commencer avec le tronçon de base et une continuation, puis mesurer l'effort avant généralisation. Garder le chemin stable dans la sauvegarde.

## H. Chats

Nimbus et Moka restent les mascottes actives du puzzle. Les chats collectionnés sont des habitants reconnaissables : silhouette, pelage, expression, pose et une micro-réaction propre. Au lancement, choisir **10–16** designs finalisés et techniquement intégrés parmi le manifeste de 50 ; le reste est une réserve de production, pas un critère de sortie. Proposition testable : 8–12 standard gagnables, 3–5 premium explicites. Pas de rareté qui cache le contenu ou de paiement aléatoire. Les chats achetés et gagnés suivent les mêmes règles de placement et d'attachement. Vérifier que les dix nouveaux PNG ont des détourages et des proportions réellement exploitables sur l'arbre, puis ne produire les suivants qu'après validation en situation.

## I. Direction artistique canonique proposée

Nom de travail : **atelier des perchoirs gourmands**. Une illustration 2D avec volumes doux, bois miel, sisal crème, tissu pêche/lilas, accent turquoise mesuré et contour prune foncé pour les informations actives. Les supports ont une lumière chaude en haut à gauche et une ombre portée courte. L'arrière-plan reste plus flou et moins contrasté que les cases et plaques. Le logo et les deux héros existants servent d'étalon, mais les chats de collection doivent réduire leur complexité de détail à petite taille.

Formes : coins généreux mais peu de cadres empilés ; bouton primaire plein, secondaires calmes ; trois niveaux de profondeur maximum. Typographie : Nunito embarquée pour corps, chiffres de niveaux et titres, avec trois tailles et deux graisses réellement contrôlées ; logo illustré réservé à la marque. Iconographie : même épaisseur de trait, même perspective, même contour, icône + texte là où le sens n'est pas immédiat. Difficulté : visage/forme de plaque et libellé au besoin ; ne jamais dépendre de la couleur seule. Le cœur, SAME/DIFFERENT et la loupe doivent résister au test d'un petit téléphone.

Produire une planche de composants **avec états** (repos, pressé, bloqué, gagné) et limites de redimensionnement. Utiliser du 9-slice pour les panneaux et boutons adaptables ; ne plus étirer `panel.png` uniformément à 900 × 1180. Vérifier les écrans à petite hauteur et à différentes proportions avant de multiplier les assets.

## J. Polish, animation et audio

Grammaire : **calme en réflexion, réponse nette à l'action, célébration courte à l'étape**. Sur tap : enfoncement 80–120 ms et son discret. Bon placement : squash puis stabilisation ~180 ms, légère réaction de contrainte satisfaite. Erreur : rejet local, choc visuel du grand cœur, son sourd court, aucune pluie de particules. Combo de lignes : progression discrète dans la grille, sans donner un bonus inventé. Victoire : réaction des héros et chemin qui s'ouvre en moins d'une seconde ; palier/chat : scène un peu plus riche et identifiable. Achat : aperçu → confirmation store → arrivée dans l'arbre ; jamais de célébration avant confirmation de transaction. Tout respecte le mouvement réduit, l'état audio et la pause de l'app.

Créer cinq à huit sons courts cohérents à partir d'une même famille de timbres, plus un motif de victoire et une ambiance bouclable légère. Tester jeu muet et jeu au casque. La musique actuelle est une boucle de notes synthétisées, pas une identité sonore aboutie.

## K. Phaser ou Unity

**Rester sur Phaser pour la version publiable, sous condition d'un test vertical visuel en temps limité.** Phaser 3.90 prend en charge tweens, particules et objets Nine Slice ; Capacitor permet l'emballage mobile. Les problèmes constatés sont surtout la production d'assets, l'étirement naïf, la composition UI, la grammaire de motion et le plafond volontaire à 30 FPS. Unity fournit un pipeline plus intégré pour UI, animation et profiling mobile, mais migrer déplacerait toutes les scènes, entrées, sauvegardes et tests d'intégration, sans résoudre automatiquement la cohérence des images. Le solveur et les données TypeScript seraient à porter ou encapsuler, avec un coût durable.

**Gate précis avant décision irréversible :** refaire dans Phaser *un* écran de puzzle et *une* fenêtre d'arbre avec un chat habité, composants redimensionnables, effets et son, puis mesurer sur un Android modeste et un iPhone réel. Essayer une cible 60 FPS en jeu, avec repli mesuré si besoin ; enregistrer FPS, mémoire, chauffe, temps de chargement et qualité à petite résolution. Si ce slice validé reste incapable de reproduire la DA et les interactions après une itération cadrée, comparer un prototype Unity du **même** périmètre et décider sur rendu/effort observés. Ne pas lancer une migration totale sur une impression.

Documentation technique utile : [Phaser Nine Slice](https://docs.phaser.io/phaser/concepts/gameobjects/nine-slice), [Phaser Scale Manager](https://docs.phaser.io/phaser/concepts/scale-manager), [Unity 2D workflow](https://docs.unity3d.com/6000.1/Documentation/Manual/2d-game-creation-wokflow.html), [Capacitor](https://capacitorjs.com/docs).

## L. Priorisation

Échelle qualitative : impact qualité / rétention / revenu = faible, moyen, fort ; coût et risque = faible, moyen, fort. Ces classements sont des hypothèses à invalider en playtest.

| Priorité | Livraison | Qualité | Rétention | Revenu | Coût | Risque |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | Test de cinq premières minutes et correction du tutoriel | Fort | Fort | Indirect | Moyen | Faible |
| P0 | Slice art/UI/motion/audio sur grille + arbre, responsive et performance appareil | Fort | Fort | Indirect | Moyen | Moyen |
| P0 | Promesses honnêtes : Défi du jour, diamants, étoiles et navigation | Fort | Moyen | Indirect | Faible | Faible |
| P0 | 10–16 chats intégrés, palier et placement fiables ; réduction du paquet | Fort | Fort | Moyen | Moyen | Moyen |
| P0 si sortie commerciale | Quelques offres directes et achat/restauration testés en sandbox store | Moyen | Faible | Fort | Moyen | Fort |
| P1 | Missions simples dont le lot a un usage réel | Moyen | Moyen | Indirect | Faible | Faible |
| P1 | Bibliothèque de sons et mini animations de personnages | Fort | Moyen | Indirect | Moyen | Moyen |
| P1 | Thème de décor additionnel et petits ensembles cohérents | Moyen | Moyen | Moyen | Moyen | Faible |
| P2 | Publicité récompensée contextuelle, après test de défaite | Faible | Moyen | Faible/moyen | Moyen | Moyen |
| P2 | Analytics et expérimentation d'offres, selon le cadre de consentement | Faible | Moyen | Fort à terme | Moyen | Moyen |
| P3 | Daily mondial, Cat Day, anti-cheat, monnaie premium, événements continus | Moyen | Incertain | Incertain | Fort | Fort |
| P3 | Extension du catalogue à 50 et au-delà | Moyen | Incertain | Incertain | Fort | Moyen |

## M. Séquence de production et critères de décision

1. **Valider la direction sur papier.** Choisir le système simple d'achat direct, la place des chats et le périmètre de lancement. Ne pas transformer les 50 entrées du manifeste en dette obligatoire.
2. **Tester 5 personnes neuves** sans explication : première action, première victoire, compréhension SAME/DIFFERENT, intérêt du prochain palier. Noter les gestes et les abandons, pas seulement leurs avis.
3. **Produire un slice de preuve** : une grille, victoire, fenêtre d'arbre, un chat plaçable, une fiche, un son et une séquence de récompense. Revoir le moteur uniquement au gate K.
4. **Décliner le système** aux scènes indispensables, aux chats choisis et à la boutique minimale. Traiter les anciennes sauvegardes et objets, supprimer du paquet les assets inactifs.
5. **Tester l'économie et le commerce** : dépenses d'indices, visibilité des lots, achats en sandbox, restauration, cas hors ligne et changement d'appareil selon la stratégie de compte. Ne pas publier un bouton d'achat fictif.
6. **Recette appareils et petite diffusion** : Android/iOS, petits et grands écrans, pause/reprise, crashs, performances, bruit/coupure audio, navigation et fiche store. Un lancement limité mesure la première session et l'envie de revenir avant d'investir dans Daily serveur ou 40 chats supplémentaires.

Cadre de temps **indicatif**, pour un petit projet mené en parallèle d'un emploi : 1–2 jours de préparation et cinq tests ; 1–2 semaines pour le slice ; 2–5 semaines pour décliner et intégrer les achats ; 1–2 semaines de recette et publication, selon les retours natifs et la disponibilité des assets. Après le slice, arrêter ou recadrer si la qualité sur appareil et l'envie des testeurs n'augmentent pas visiblement. Après la petite diffusion, investir dans Daily/Live Ops seulement si les joueurs reviennent et qu'une offre suscite un intérêt réel. Ces délais sont des enveloppes de décision, pas un engagement de livraison.

**Décision proposée :** poursuivre Meowza avec Phaser et l'arbre comme cœur de la collection ; simplifier radicalement la méta visible ; prouver la qualité sur un slice avant toute production massive. Le principal risque n'est pas de manquer de fonctionnalités, mais de produire beaucoup de contenu que l'expérience actuelle ne donne pas envie de regarder ou d'acheter.

### Limites de cet audit

Code, docs, manifests et illustrations examinés ; build et tests locaux effectués. Le navigateur de prévisualisation de cet environnement ne peut pas ouvrir le serveur local : aucun parcours tactile en situation ni mesure réelle FPS/chauffe n'a été réalisé. Les avis sur la qualité perçue des écrans complets restent des hypothèses issues de l'assemblage du code et des assets, à confirmer sur appareil et avec des joueurs. Aucun changement de gameplay ou d'asset n'a été implémenté.

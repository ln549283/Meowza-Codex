# Meowza — biomes, croquettes et trois erreurs

## Règles et économie

Chaque placement est vérifié contre la solution unique. Un chat incorrect est rejeté, le compteur d’erreurs augmente, la troisième erreur termine la tentative. Annuler ou effacer ne rembourse pas les erreurs. Recommencer relance la même grille avec trois pattes. Les placements anciens incompatibles avec la solution sont nettoyés lors de la restauration.

Réserve initiale : 60 croquettes. Chaque niveau distinct gagné pour la première fois rapporte 20/30/40/60 selon sa difficulté. Rejouer ne redonne pas cette récompense. Les sauvegardes antérieures reçoivent la réserve initiale sans récompenses rétroactives pour leurs niveaux déjà terminés.

Le rappel des règles est gratuit. Une déduction expliquée coûte 10, 20, 30… croquettes dans une même tentative. Le prix est affiché avant achat. La déduction achetée reste disponible après un échec et son placement automatique n’a pas de supplément. Si le solde est insuffisant, une aide de secours est offerte : aucune obligation de paiement ou publicité.

La boutique est préparée dans ShopScene, sans entrée visible ni achat actif. Aucun SDK publicitaire ou paiement n’est intégré. Le mode chronométré facultatif est différé ; aucune mention inutile de chrono ne figure dans les parties normales.

## Parcours

Salon 1–100, Cuisine 101–200, Jardin 201–300. Les trois décors alternent ensuite par blocs de 100, sans prétendre fournir une infinité de décors uniques. Les deux premiers niveaux de chaque biome sont accessibles, la numérotation reste globale. Les niveaux générés et enregistrés restent stables, sauf grilles Difficiles/Extrêmes non terminées issues de la calibration précédente, renouvelées avec la version logique 2.

Personnalisation et récompenses de refuge retirées de l’interface. Les éléments de cabane et hamac sont désormais du décor. Les défis Extrême restent facultatifs. « Niveau suivant » génère et ouvre directement le suivant ; un bouton séparé retourne à l’arbre.

## Logique et performances

Les nouvelles grilles n’utilisent qu’un niveau d’hypothèse, au plus cinq conséquences directes par preuve et trois preuves par grille. Un défi Extrême doit nécessiter une hypothèse. Les budgets épuisés ne sont jamais considérés comme des contradictions.

Sélecteurs de chats fixes, sélection dès le contact, retour visuel immédiat. Les boutons ne changent plus de taille sous le doigt. Rendu plafonné à 30 images/s, animations décoratives finies et arrêt de la boucle lorsque l’app passe en arrière-plan. Cela réduit le travail demandé au moteur ; le résultat thermique doit être mesuré sur des téléphones physiques.

## Graphismes

Accueil et Salon dérivés des images fournies par le propriétaire (23827 et 23828), redimensionnés et encodés WebP sans retouche du contenu. Atlas transparent, Cuisine et Jardin créés avec l’outil intégré de génération d’images. Fichiers runtime : public/assets/atlas-v3.webp et public/assets/backgrounds/{home-v3,salon,cuisine,jardin}.webp. Les frames sont définies dans PreloadScene, sans découpe destructive de l’atlas.

Prompt atlas : Create a production game sprite atlas based on the attached Meowza reference style: warm honey wood, soft glossy cozy toy rendering. ONE square transparent PNG with exactly 8 sprites arranged in a strict 4 column by 2 row equal cell grid, each sprite completely contained in its cell with ample transparent margin. No text, no borders, no checkerboard drawn. Top row: grey happy cat HEAD, orange curious cat HEAD, brown focused friendly cat HEAD, violet mischievous magical cat HEAD with tiny star aura no flames. Bottom row: round wooden platform with pink cushion, small wooden cat-house with teal cushion roof, green hammock attached to two short wooden poles, short rope bridge attached to two wooden poles. True transparent alpha background. Straight on gently elevated camera coherent across sprites. Each occupies central 80% of own cell; no overlap. This is a runtime spritesheet, not a labeled concept board.

Prompt Cuisine : Portrait 2:3 background illustration for Meowza cozy glossy cat puzzle game. A warm sunlit country kitchen, honey wood cupboards, mint ceramic tiles, a bowl of cat kibble, pink tea towels, potted plants, tall window overlooking a village. Soft rich storybook 3D painting, warm light, tactile cozy materials, bright coral and teal accents. No text, no logo, no UI, no characters. Keep center relatively quiet for game board overlay. Full bleed finished game environment.

Prompt Jardin : Portrait 2:3 background illustration for Meowza cozy glossy cat puzzle game. A lush enclosed garden with wooden pergola, soft pink flowers, climbing ivy, stepping stones, a little cat house and blue sky. Soft rich storybook 3D painting, warm light, tactile cozy materials, bright coral and teal accents. No text, no logo, no UI, no characters. Keep center relatively quiet for game board overlay. Full bleed finished game environment.

# Meowza 1.2 — identité, arbre continu et indices directs

## Livré
- Logo illustré dédié et transparent : utilisé sur l'accueil, le chargement web, l'en-tête du parcours et le lancement iOS. L'accueil et le splash ont des rôles distincts ; aucun délai artificiel n'est ajouté au démarrage.
- Modules en bois, sisal et tissu produits dans une seule planche cohérente, assemblés selon des points de raccord contrôlés. Décor de pièce à centre dégagé ; variante menthe ou lavande selon l'ambiance équipée.
- Parcours continu sans pages : glissement tactile, inertie, molette, retour « Me retrouver ». Seuls sept niveaux au maximum sont créés autour de la fenêtre visible, quel que soit l'avancement. Les numéros sont globaux et les anciennes victoires restent accessibles.
- Indices : la loupe ouvre une confirmation courte avec le prix, puis la déduction. Les indices déjà possédés s'ouvrent directement. Le rappel des règles devient une action volontaire. Une explication consultée compte comme indice même sans placement automatique ; une relecture dans la même tentative n'est pas comptée deux fois, y compris après rechargement.
- Compilations natives déclenchées lors des modifications du code, et contrôles TypeScript / tests / banque de niveaux / build web.

## Contrôles et limites de livraison
25 tests automatisés, dont les 100 premières grilles résolues logiquement et des positions de parcours jusqu'à un million de niveaux. Le résultat des compilations natives est à consulter sur le commit livré. Les tests de construction ne remplacent pas une recette iPhone/Android : petits écrans, interruptions, reprise, chauffe, batterie, audio, sauvegardes et sessions prolongées restent à vérifier sur appareils.

Cette livraison n'affirme pas une certification App Store ou Google Play. La signature de distribution, les comptes éditeur, les coordonnées d'assistance, les déclarations des fiches stores et la validation sur appareils sont des étapes de sortie encore distinctes. Les achats et publicités ne sont pas activés. Le chrono de six minutes reste à calibrer avec des joueurs.

## Assets
Génération intégrée, redimensionnement WebP conservant l'alpha. Sources générées conservées hors du runtime ; le jeu utilise :
- `public/assets/logo-v5.webp`
- `public/assets/tree-modules-v5.webp`
- `public/assets/room-v5.webp`
- Déclinaisons PNG du logo dans `ios/App/App/Assets.xcassets/Splash.imageset/`.

Prompts utilisés :

### Logo
Use case logo-brand. Finished premium mobile puzzle game logo, exact text 'Meowza' spelled M e o w z a, no other text. Truly transparent background. Bold custom bouncy rounded lettering, warm honey golden yellow faces shaded to tangerine at base, dimensional candy-gloss highlights, thick dark plum outline then narrow warm cream outer keyline. Integrated cute small cat ears above the M and final a, three short whisker strokes at each side, tiny paw imprint in the o counter. Compact unified horizontal wordmark, immediately legible when scaled to 250 px wide. Sophisticated casual game brand, friendly and cozy, soft polished 3D toy-like rendering, not flat typesetting, no cats or scenery, no poster or UI, no excessive hearts, complete logo uncropped with generous transparent padding. Wide composition.

### Modules
Use case stylized-concept. Production game sprite atlas, transparent alpha background, six isolated cat tree modules, exactly 3 equal columns by 2 equal rows, square canvas. Each object wholly inside its cell with 12% empty margin, objects never touching, no labels, no numbers, no cats, no interface. Unified premium casual mobile game toy-like 3D illustrated style, honey polished rounded wood, warm beige sisal rope, coral peach and teal plush fabric with cream piping, subtle glossy highlights, front elevation with slightly visible top, consistent lighting from upper left. Top left: broad low wooden shelf with plump peach cushion. Top middle: broad low wooden shelf with teal cushion. Top right: rounded small cat-ear wooden cubby house with dark rounded door, cream plush roof, ivory paw badge. Bottom left: peach cloth hammock hung between two short honey wood posts on a narrow base. Bottom middle: single tall straight beige sisal scratching post, with narrow wooden end caps, isolated full length. Bottom right: rounded wide honey wooden base with small teal yarn ball and tiny potted leaves on the side, center uncluttered. All modules are clean, thick, tactile and easy to read at 150 pixels, no floor plane or cast shadows extending outside cells, soft object-attached shading only. Not a whole tree, separated modular parts for assembly in a game.

### Pièce
Use case stylized-concept. Vertical background art for a premium cozy cat puzzle mobile game. Portrait 9:16 composition, full bleed softly illustrated warm sunlit room. Main central 70 percent from x15% to85% is EMPTY softly shaded pale warm cream wall, very low contrast, for placing a scrolling cat tree in front. At far left edge a narrow glimpse of large rounded window with sheer peach curtains, soft mint garden visible outside. At far right edge a narrow trailing leafy plant and the rounded edge of a wooden bookcase, kept peripheral and understated. Bottom 12 percent honey wood floor with a subtle oval cream rug. Top softly lit plaster. Charming high quality painterly 3D casual game style, tactile materials, warm peach and mint accents, gentle ambient occlusion, pleasant luminous light. Strong restraint: NO cat tree, NO cats, NO floating platforms, NO logo, NO text, NO interface, NO focal objects in center, NO busy wallpaper or tiny trinkets. The room supports an interactive foreground and never competes with it.

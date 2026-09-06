# Meowza — parcours et arbre personnel

## Décisions livrées
- Arbre recomposé : modules en bois, coussins, niches, parcours déterministe, nuages uniquement au front de progression. Fenêtres de huit niveaux pour conserver une scène légère.
- Personnalisation dans un panneau sur le véritable arbre : ambiance, bois, coussins. Neuf variations dont trois initiales, puis un déblocage sans doublon tous les dix nouveaux niveaux, jusqu'à épuisement de cette première collection. Anciens paliers acquis reconnus au chargement. Aucun achat réel.
- Accueil et menus harmonisés ; images de référence lourdes retirées du chargement. Les thèmes remplacent les biomes automatiques.
- Grille sans difficulté ni compteur de placements ; loupe vectorielle, trois cœurs. Les erreurs se réfèrent à l'unique solution. Rejouer reste gratuit.
- Tutoriel : équilibre au niveau 1, cœur aux niveaux 2–3, cœur et griffes aux niveaux 4–5.
- Répartition arrondie aux niveaux entiers : 6–20 = 5 faciles / 9 moyens / 1 difficile ; 21–50 = 2 faciles / 15 moyens / 7 difficiles / 4 extrêmes / 2 chronométrés ; 51–100 = 10 moyens / 23 difficiles / 12 extrêmes / 5 chronométrés. La dernière séquence se répète après 100. Premier extrême au 24, premier chrono au 33 ; chaque chrono est suivi d'un moyen.
- Extrêmes : résolution humaine avec hypothèses simples bornées, sans raisonnement récursif ni choix arbitraire. Les 100 premières grilles sont vérifiées par test.
- Chronométrés : briefing préalable, 6 minutes initiales (valeur provisoire à calibrer avec de vrais joueurs), départ au premier placement, pause en arrière-plan et lors de la consultation de l'aide. Temps restant enregistré. Échec au temps écoulé ou à la troisième erreur. Après trois échecs, option gratuite de temps supplémentaire de 50 %. Même grille à chaque tentative.
- Croquettes : départ 60 ; gains 5/8/12/15/18 à la première victoire de chaque niveau. Prix des indices 20/35/50 puis plafond 50 par tentative. Rappel gratuit ; pas d'indice précis offert automatiquement à solde nul. Relecture des indices achetés conservée.

## Compatibilité
Soldes, victoires et niveaux déjà achetés ou en cours conservés. Les grilles futures non jouées sont recalculées pour la nouvelle progression. Une partie ancienne active peut donc garder sa difficulté initiale jusqu'à son achèvement.

## Limites explicites
Publicités récompensées et paiements ne sont pas activés : ils restent une phase ultérieure, avec une seule continuation volontaire par tentative. Aucun faux bouton de publicité. La boutique reste préparée, masquée tant qu'aucun pack n'est disponible. Cette première collection gratuite ne couvre pas encore un parcours infini en récompenses. Pas de validation thermique ou native sur téléphone réel dans cet environnement.

## Illustration dédiée
Asset : `public/assets/home-mascots-v4.webp` (850 × 850, transparence, 138 Ko). Génération intégrée, puis réduction WebP pour le jeu. Aucun recours à une maquette complète comme écran.

Prompt :
> Use case: stylized-concept. Production asset for Meowza mobile cat logic puzzle game: a single isolated cheerful mascot composition on genuinely transparent background, no scenery, no interface, no lettering. Two adorable chibi kittens, one silver grey tabby with lavender-grey stripes and pink ears, one ginger tabby with cream muzzle and pink ears, full bodies with big heads and small rounded paws, cuddled together on one plump warm peach cushion with ivory piping atop a small rounded honey wooden cat-tree shelf. Silver kitten smiling with eyes closed, ginger kitten bright large amber eyes. One tiny teal ball of yarn at their paws. Premium polished casual mobile game illustration, sculpted candy-like soft volume, glossy highlights, clean rounded contours, warm gentle light, richly rendered but not photorealistic. Tight centered composition, clear silhouette at small sizes, square canvas, full object within frame with 8 percent clear margins. Transparent alpha outside the two cats and cushion/shelf. No logo, no text, no floating confetti, no background.

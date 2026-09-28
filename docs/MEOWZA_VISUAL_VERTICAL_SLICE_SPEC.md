# MEOWZA — VISUAL VERTICAL SLICE SPEC

> Branche : `kawaii-cat-tree-refonte-v3`
>
> Chantier : `V3-2B`
>
> Rôle : cible graphique et découpage de production pour **UNE vertical slice puzzle** avant déclinaison sur le reste du jeu.

---

# 1. CIBLE VALIDÉE

La direction artistique validée est :

- casual mobile premium ;
- chaleureuse, cosy, lumineuse ;
- crème / pêche / lavande comme base ;
- bois et matières douces en accents ;
- illustration 2D riche mais interface lisible ;
- composants tactiles qui ressemblent à de vrais éléments de jeu, pas à une maquette d'application ;
- profondeur douce, ombres courtes, volumes arrondis ;
- personnages expressifs ;
- feedbacks courts et satisfaisants ;
- animation contextuelle, jamais agitation permanente.

Référence UX principale : **Meowdoku pour la clarté, la hiérarchie, la fluidité et la qualité de finition**, sans copie d'assets, d'écran ou d'identité.

## Corrections produit verrouillées par rapport au concept visuel

1. **La grille contient exactement deux catégories de chats :**
   - Nimbus = gris / lilas ;
   - Moka = roux / orange.

   Aucune troisième couleur / race / tête ne doit apparaître dans une cellule de puzzle.

2. **Aucun système de combo.**
   Pas de compteur, de texte « Combo », de chaîne de score ou de VFX lié à une mécanique de combo.

3. **Un seul gros cœur de tentative.**
   Il évolue visuellement :
   - intact ;
   - fissuré ;
   - très abîmé ;
   - brisé à la troisième erreur.

4. **Pas d'étoiles de score.**
   Les étoiles ne doivent pas revenir dans la victoire ou l'arbre comme résultat de niveau.

5. **Le puzzle reste prioritaire.**
   Le décor et les personnages ne doivent jamais concurrencer la lecture de la grille.

---

# 2. OBJECTIF DE LA VERTICAL SLICE

Créer **un écran puzzle de référence** suffisamment abouti pour devenir la grammaire visuelle de tout Meowza.

Cette vertical slice doit figer :

- background ;
- board ;
- cellules ;
- Nimbus / Moka en jeu ;
- sélecteur de chat ;
- HUD ;
- cœur ;
- indice ;
- bouton retour / pause ;
- typographie ;
- boutons ;
- panneaux ;
- feedback placement correct ;
- feedback erreur ;
- feedback indice ;
- victoire ;
- défaite ;
- VFX ;
- motion ;
- haptics / SFX à spécifier ;
- transitions liées au puzzle.

**On ne décline pas encore cette DA sur Home, arbre, boutique ou autres scènes avant validation de cette vertical slice.**

---

# 3. HIÉRARCHIE VISUELLE DE L'ÉCRAN PUZZLE

Ordre de lecture attendu :

1. **grille** ;
2. état de tentative / cœur ;
3. sélection Nimbus / Moka ;
4. indice ;
5. chrono uniquement en Timed ;
6. actions secondaires.

Le décor doit soutenir la scène, jamais la dominer.

## Composition cible

### Zone haute

Contient uniquement les informations de contexte essentielles :

- retour / pause ;
- niveau ou difficulté de façon discrète ;
- gros cœur ;
- chrono si Timed.

Éviter une grosse top bar opaque si elle mange l'écran.

### Zone centrale

La grille est le point focal absolu.

Elle doit :

- être grande ;
- respirer ;
- avoir un contraste clair ;
- rester lisible sur 4x4, 6x6 et 8x8 ;
- laisser les contraintes cœur / griffes immédiatement identifiables ;
- éviter l'effet tableau Excel ;
- éviter l'effet « neuf petits rectangles Phaser empilés ».

### Zone basse

Contient :

- Nimbus ;
- Moka ;
- indice ;
- éventuellement une action secondaire strictement nécessaire.

Pas de barre d'outils chargée.

---

# 4. DÉCOUPAGE ASSETS — VERTICAL SLICE

Règle de production : **un asset existe s'il doit apporter identité, matière, émotion, relief, animation ou réutilisation.**

Les primitives Phaser restent acceptées pour les masques, hit areas, overlays simples, lignes de grille et géométrie dynamique lorsque c'est plus propre.

## A. Background

### `puzzle-room-bg`

**Type :** illustration raster WebP.

**Rôle :** ambiance cosy premium très douce, fortement désaturée derrière le board.

**Contraintes :**

- portrait mobile ;
- centre visuellement calme ;
- détails concentrés aux bords ;
- aucune information importante derrière la grille ;
- lumière chaude ;
- faible contraste local derrière les cellules ;
- aucune UI ou texte baked-in.

**État :** NEW / REPLACE target.

---

## B. Board

### `board-frame`

**Type :** asset 9-slice ou cadre raster scalable si techniquement propre ; sinon assemblage de quelques pièces réutilisables.

**Rôle :** donner au plateau une matière et une présence sans réduire la lisibilité.

**Direction :** bois clair / biscuit / crème chaud, léger relief, ombre interne très subtile.

**À éviter :** cadre massif, texture bruyante, contour cartoon très sombre.

### `cell-surface`

**Type :** probablement rendu procédural léger + tokens de style, pas nécessairement un PNG par case.

**Rôle :** surface douce et claire qui reçoit les chats.

**États à définir :**

- normal ;
- prefilled ;
- selected ;
- hinted ;
- error flash ;
- solved / validated si un état distinct est utile.

### Contraintes cœur / griffes

**Type :** vrais assets vector/raster simples, lisibles à petite taille.

**Besoin :**

- `relation-same-heart` ;
- `relation-different-claw`.

Ils doivent appartenir à la DA Meowza mais rester d'abord des symboles logiques.

---

## C. Chats de grille — CRITIQUE

Le plateau n'utilise que :

### `nimbus-tile`

Nimbus gris / lilas.

### `moka-tile`

Moka roux / orange.

**Direction :**

- même famille graphique ;
- même échelle perceptuelle ;
- silhouettes différentes seulement si cela aide ;
- distinction couleur immédiatement évidente ;
- excellente lecture à petite taille ;
- pas de cercle blanc / badge sticker autour des têtes ;
- alpha propre ;
- intégration naturelle dans la case.

### États nécessaires

Prévoir soit des frames, soit des variantes d'asset :

- idle ;
- placement / anticipation ;
- happy / settle ;
- error / ears-down ;
- hint-focus si nécessaire.

Ne pas créer 15 expressions avant d'avoir validé les 4 essentielles.

---

## D. Sélecteur Nimbus / Moka

Le sélecteur ne doit plus ressembler à deux boutons utilitaires génériques.

### Composants

- base de sélection tactile ;
- portrait Nimbus ;
- portrait Moka ;
- état selected ;
- état pressed ;
- état disabled uniquement si un futur cas l'exige.

### Direction

Le joueur doit avoir envie de toucher les personnages.

Éviter :

- rond blanc + tête collée ;
- gros contour néon ;
- bouton rectangulaire avec texte inutile.

---

## E. Gros cœur

Créer une famille cohérente :

- `heart-intact` ;
- `heart-cracked-1` ;
- `heart-cracked-2` ;
- `heart-broken`.

Même silhouette, évolution claire.

Le cœur doit être suffisamment grand pour que l'état soit compris sans lire « 1/3 ».

Le motion viendra amplifier, pas remplacer, la lisibilité statique.

---

## F. Indice

### Bouton indice

Asset / composant premium tactile, intégré au même langage que les autres CTA.

Afficher clairement :

- loupe / ampoule selon décision DA finale ;
- prix courant ;
- quota `x/3` ;
- disabled après le troisième indice.

Éviter le look « toolbar » ou « bouton système ».

### Feedback indice

Prévoir un asset ou traitement visuel pour :

- focus sur la règle ;
- focus sur la cellule ;
- halo court / guide ;
- aucune pluie de particules.

---

## G. Boutons système de la vertical slice

À produire uniquement pour les besoins du puzzle :

- `button-icon-back` ;
- `button-icon-pause/settings` si réellement présent ;
- `button-primary` pour Retry / Niveau suivant dans les écrans de sortie ;
- `button-secondary` ;
- `button-danger` uniquement si confirmation d'abandon le nécessite.

Tous doivent partager :

- matière ;
- contour ;
- ombre ;
- rayon ;
- comportement pressed ;
- disabled ;
- easing.

**Ne pas produire tout le UI kit du jeu avant validation de ces composants.**

---

## H. Panneaux / modales

Vertical slice uniquement :

- confirmation d'abandon ;
- explication d'indice ;
- victoire ;
- défaite.

Direction : carte illustrée légère, crème chaud, bordure et profondeur cohérentes avec le board.

Éviter : grand rectangle opaque occupant l'écran entier.

---

## I. Victoire

Pas d'étoiles. Pas de combo.

Assets minimaux :

- réaction heureuse Nimbus/Moka ;
- petit élément de célébration réutilisable (sparkles doux / confetti feuilles / pattes selon validation) ;
- panneau victoire ;
- CTA niveau suivant ;
- retour arbre si nécessaire.

La victoire doit être satisfaisante même sans score.

---

## J. Défaite

Assets minimaux :

- cœur brisé ;
- réaction triste / déçue Nimbus ou Moka ;
- panneau « Chat alors… » ;
- CTA Retry ;
- sortie secondaire.

La défaite doit être émotionnelle mais très courte.

---

# 5. CE QUI RESTE PROCÉDURAL / PHASER

Ne pas transformer le repo en catalogue de PNG inutiles.

Peuvent rester procéduraux :

- hit areas ;
- lignes simples de grille ;
- masques ;
- overlays transparents ;
- layout responsive ;
- positionnement ;
- texte dynamique ;
- nombres ;
- prix ;
- chrono ;
- état de progression ;
- ombres simples si le résultat est identique à la target ;
- tween / animation / compositing.

Phaser reste responsable de la mise en scène et de l'interaction.

---

# 6. MOTION À PRÉVOIR — PAS ENCORE À IMPLÉMENTER

## Placement correct

Durée cible globale : ~250–400 ms.

Séquence :

1. apparition / descente minime ;
2. squash ;
3. overshoot court ;
4. settle ;
5. micro-expression éventuelle.

Doit supporter le placement rapide sans verrouiller l'input.

## Erreur

Durée cible : ~250–450 ms.

Séquence :

1. chat réagit ;
2. très court shake ;
3. halo rouge doux ;
4. cœur réagit ;
5. pièce erronée disparaît conformément au gameplay.

Pas de délai frustrant avant le prochain tap.

## Cœur

Chaque erreur : impact court + transition d'asset.

Troisième erreur : break plus fort, mais sortie défaite rapide.

## Indice

1. mettre la règle concernée en évidence ;
2. guider vers la cellule ;
3. laisser le joueur comprendre ;
4. aucun effet arcade.

## Victoire

Petit climax 0,8–1,5 s maximum avant que le CTA soit immédiatement utilisable.

## Défaite

Émotion perceptible en moins d'une seconde ; Retry immédiatement disponible.

---

# 7. RÈGLES DE PRODUCTION D'ASSETS

Pour chaque nouvel asset :

1. produire un target / brief clair ;
2. fond transparent quand l'asset doit être mobile ou remplaçable ;
3. conserver des marges cohérentes ;
4. éviter les ombres externes baked-in si elles compliquent l'assemblage ;
5. tester la lecture à la vraie taille mobile ;
6. créer seulement les variantes nécessaires ;
7. optimiser en WebP/PNG selon alpha et usage ;
8. ne pas intégrer une image « presque bonne » puis compenser par du code.

**Si un asset est mauvais, on refait cet asset. On ne redessine pas toute la scène.**

---

# 8. BACKLOG EXPLICITE — PAS DANS CETTE VERTICAL SLICE

À ne pas oublier, mais hors du bloc actif :

- refaire le langage visuel de **tous** les nodes de niveau de l'arbre ;
- supprimer l'effet sticker / avatar des niveaux actuels ;
- refaire Coup de griffe dans la même famille ;
- intégrer les chats comme habitants physiques du mobilier ;
- Home ;
- arbre complet ;
- boutique ;
- collection ;
- missions ;
- diamants ;
- thèmes / cosmétiques ;
- Daily / Cat Day.

Le mauvais icon Coup de griffe actuel n'est **pas** une direction à propager.

---

# 9. PREMIER LOT D'ASSETS À PRODUIRE

Ne produire que ce lot avant revue :

1. **Nimbus tile — idle** ;
2. **Moka tile — idle** ;
3. **surface / cadre de board** ;
4. **style de cellule + état selected** ;
5. **sélecteur Nimbus / Moka** ;
6. **gros cœur — 4 états** ;
7. **bouton indice** ;
8. **bouton icon back** ;
9. **un bouton principal** ;
10. **un panneau / carte de référence**.

Ce lot doit suffire à répondre à la question :

> « Est-ce que le puzzle commence réellement à ressembler au jeu premium montré dans la target ? »

Aucun autre asset n'est autorisé avant cette revue, sauf dépendance technique évidente.

---

# 10. CRITÈRE DE SORTIE DE LA PHASE DE DÉCOMPOSITION

Cette phase est fermée lorsque :

- la target DA est explicitement verrouillée ;
- les contradictions fonctionnelles du concept sont retirées ;
- la hiérarchie de l'écran est définie ;
- chaque élément du puzzle est classé asset / procédural / texte / animation ;
- le premier lot d'assets est précisément identifié ;
- le backlog arbre/nodes est conservé sans le mélanger au chantier puzzle.

**Statut : ✅ DÉCOMPOSITION TERMINÉE.**

Prochaine phase autorisée : **production du premier lot d'assets de la vertical slice puzzle.**

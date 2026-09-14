# Arbre illustré — 14 septembre 2026

Branche : kawaii-cat-tree-refonte-v3. Base de travail : 103ede42.

## Périmètre

Intégration des compositions approuvées par Loïc : base unique puis A/B alternées. Aucun chat décoratif ni animation automatique dans la scène de l'arbre. Les sauvegardes, récompenses, règles, prix, collection et affectations de chats sont conservés. Les habitants restent masqués sur l'arbre pour cette passe artistique.

Décors : plante et pelote sur le socle, fanions sur le pont ; plante suspendue, pelote et plaid sur A ; pelote sur le support supérieur de B. Chaque objet est fixé ou posé sur un support réel.

Les paliers restent ceux du code reçu : tous les dix niveaux. Leur récompense n'est pas réinventée. Le numéro de palier et la distance au prochain sont explicites. Les étoiles existantes sont conservées ; la divergence avec l'ancienne Bible doit être tranchée séparément.

## Assets et raccords

`public/assets/tree/chunks/{base,a,b}.png` : PNG RGBA individuels, largeur 1024 ; hauteurs 1536 / 1280 / 1152. Origine en haut à gauche. Tronc centré autour de x=500. Affichage à 90 %, x=90 dans la scène 1080×1920. Les supports et raccords ne sont pas reconstruits en code.

Les coordonnées exactes des plaques et les raccords sont dans `src/core/treeChunks.ts`. Base : quatre niveaux ; continuations : trois chacune. Placement constant et déterministe. Pas de miroir qui ferait changer le sens de la lumière. Les zones de tronc sans mobilier ont été raccourcies en bas de A/B sans déplacer leurs éléments.

Origines : images approuvées exec-dda7df27 (base), exec-241710ac (A), exec-81f5d9fd (B). Éditions décoratives par l'outil intégré de génération d'images : exec-6518eca9 (base), exec-573a0364 (A). Prompt : conserver composition, proportions, emplacements et style du mobilier ; ajouter petits décors physiquement attachés ; centres de coussins libres ; aucun chat, texte ou nouvelle plateforme ; fond transparent. Le troisième appel a été bloqué par quota. B conserve donc le dessin approuvé, avec une pelote existante posée en jeu.

Les exports décoratifs contenaient un faux damier opaque. Un détourage mécanique a supprimé le fond et préservé les grandes surfaces du mobilier ; alpha contrôlé sur fond coloré. Les pixels entièrement transparents sont nettoyés. Aucun runtime de détourage ni calcul d'image au lancement.

## Vérifications

- TypeScript, 30 tests et validation des 110 grilles existantes.
- Tests dédiés : raccords sans trous, base non répétée, ancrages sur les supports, ordre ascendant, paliers 80–100, fenêtre bornée à un million de niveaux.
- Assemblage visuel de contrôle A → B → A → base (lecture descendante).
- Contrôle navigateur et builds natifs : voir le bilan ajouté après vérification.

## Limites de livraison commerciale

Cette passe ne constitue pas une certification store. Il reste nécessaire de vérifier les appareils physiques, les versions signées, les comptes de distribution et les fonctions commerciales réellement actives. Une compilation debug/simulateur ne remplace pas ces validations.

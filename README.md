# Meowza — l’arbre des petits bonheurs

Version biomes et croquettes : [règles, économie, migration et graphismes](docs/release-v3.md). Ce document remplace les descriptions de refuges et d’indices de la version précédente.

Puzzle félin Phaser / TypeScript, embarqué sur iOS et Android avec Capacitor. Deux familles de chats : autant de gris que de roux dans chaque ligne et colonne, jamais trois identiques consécutifs, liens cœur (identiques) et griffes (différents).

## Jouer

Choisir Nimbus ou Moka sous la grille, puis toucher une case. Retoucher un chat de la famille sélectionnée vide la case. Les petits cadenas signalent les cases fixes. Les commandes permettent d’annuler un coup, dévoiler un indice ou effacer la grille. Effacer/annuler ne supprime pas les erreurs et indices du parcours en cours.

## Parcours

Un arbre continu avec des difficultés alternées, des respirations Facile et un refuge à aménager tous les six sommets. Les défis Extrême sont facultatifs. Les niveaux terminés restent rejouables ; les 110 niveaux de l’ancienne version sont conservés pour les sauvegardes existantes.

Les nouvelles grilles sont générées à la demande et acceptées uniquement si le solveur humain peut les terminer. Les premiers Moyens restent en 4×4, puis les 6×6 commencent avec davantage de données. Voir [le rythme, la calibration et les preuves logiques](docs/journey-and-logic.md).

## Installation et validation

Node 22 ou supérieur :

```sh
npm ci
npm run dev
npm run check
```

`check` exécute TypeScript, les tests, la validation des 110 puzzles et le build. `generate-levels` régénère la banque de façon déterministe. `extend-levels` préserve les 80 niveaux précédents et recrée seulement Extrême.

## Mobile

```sh
npm run cap:sync
npm run android
npm run ios
```

Le projet Android et le projet Xcode sont inclus. iOS nécessite macOS, Xcode et CocoaPods. Aucun certificat de signature n’est inclus. Voir [les vérifications natives et la livraison](docs/mobile-release.md).

## Sauvegarde et confort

La clé `meowza-save-v1` est conservée. Progression, meilleurs scores, préférences et dernière partie sont sauvegardés via Capacitor Preferences. Les écritures sont sérialisées ; une erreur de stockage à la victoire permet de réessayer. Pas de compte, analytics, publicité ni appel réseau nécessaire au jeu. La musique synthétique est optionnelle et désactivée par défaut. Sons et vibrations sont configurables ; les animations réduites respectent la préférence système initiale.

## Graphismes

Nouveaux assets générés : décor de l’arbre, Nimbus, Moka, icône d’application. Les sprites sont transparents, les chats se distinguent aussi par leur expression. Les dérivés WebP limitent le poids embarqué. Plateformes, nuages, boutons, grille et particules sont des objets Phaser. Nunito est embarquée pour fonctionner hors ligne. Voir [la provenance des assets](docs/assets.md).

## État de validation

La compilation web, les tests automatisés et les contrôles logiques ont été exécutés. Les tests sur appareils iOS/Android et la compilation signée restent nécessaires avant une soumission aux stores. Après chaque modification web, exécuter cap:sync avant de compiler les projets natifs.

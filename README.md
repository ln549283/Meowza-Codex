# Meowza — l’arbre des petits bonheurs

Puzzle félin Phaser / TypeScript, embarqué sur iOS et Android avec Capacitor. Deux familles de chats : autant de gris que de roux dans chaque ligne et colonne, jamais trois identiques consécutifs, liens `=` (identiques) et `×` (différents).

## Jouer

Choisir Nimbus ou Moka sous la grille, puis toucher une case. Retoucher un chat de la famille sélectionnée vide la case. Les petits cadenas signalent les cases fixes. Les commandes permettent d’annuler un coup, dévoiler un indice ou effacer la grille. Effacer/annuler ne supprime pas les erreurs et indices du parcours en cours.

## Parcours

110 niveaux fixes issus d’une génération reproductible, tous à solution unique :

| Chapitre | Taille | Niveaux | Accès |
| --- | --- | --- | --- |
| Facile | 4 × 4 | 20 | Dès le départ |
| Moyen | 6 × 6 | 30 | Après 10 Facile |
| Difficile | 8 × 8 | 30 | Après 15 Moyen |
| Extrême | 8 × 8 | 30 | Après les 30 Difficile |

Dans chaque chapitre, on grimpe dans un arbre à chat en faisant glisser la carte. Les nuages cachent les niveaux verrouillés. Les niveaux terminés restent rejouables. Les seuils Moyen/Difficile et les 80 premiers puzzles sont conservés pour assurer la compatibilité avec la version précédente.

Les grilles Extrême sont sélectionnées parce que les seules déductions immédiates (règles locales, équilibre, relations adjacentes) ne suffisent pas à les terminer. Cette mesure ne remplace pas une calibration par des joueurs ; elle garantit une différence logique explicite, pas simplement une plus grande grille.

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

La compilation web, les tests automatisés et les contrôles des 110 niveaux ont été exécutés. La synchronisation native a été exécutée. La compilation signée, les tests sur appareil et le contrôle visuel interactif restent à réaliser : le navigateur distant ne peut pas accéder au serveur local de cet environnement. Cette version est une base de test, pas une soumission aux stores validée.

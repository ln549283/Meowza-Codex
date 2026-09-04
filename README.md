# Meowza

Meowza est un puzzle game mobile cozy/kawaii inspiré des binary puzzles. Le joueur complète un tapis avec des chats gris et roux en respectant l’équilibre 50/50, la règle « jamais trois identiques », ainsi que des liens **Même** et **Différent**.

Le projet est une implémentation greenfield : moteur, solveur, générateur, banque de niveaux et interface ont été conçus depuis zéro.

## Fonctionnalités

- 80 niveaux générés et validés : 20 faciles (4×4), 30 moyens (6×6), 30 corses (8×8)
- solveur backtracking avec pruning et comptage de solutions
- puzzles à solution unique et contraintes cohérentes
- navigation Phaser complète : chargement, accueil, tutoriel, sélection, partie, paramètres, victoire
- progression, étoiles, statistiques et préférences persistantes
- indices logiques, erreurs non intrusives, animations et feedback haptique
- rendu portrait 1080×1920 responsive avec safe areas
- navigateur, Android Capacitor et architecture prête pour iOS

## Stack

- Vite + TypeScript strict
- Phaser 3
- Capacitor 7 (`Preferences`, `Haptics`)
- tests natifs Node

## Installation

Prérequis : Node.js 20+ et npm.

```bash
npm install
npm run dev
```

## Commandes

```bash
npm run typecheck        # vérification TypeScript stricte
npm test                 # tests du moteur logique
npm run generate-levels  # régénère les 80 niveaux depuis une graine déterministe
npm run validate-levels  # vérifie format, règles, contraintes et unicité
npm run build            # typecheck + build production
npm run cap:sync         # build et synchronisation native
npm run android          # ouvre le projet Android Studio
```

## Architecture

```text
src/
├── core/       moteur pur, règles, validation, solveur et générateur
├── data/       banque de niveaux générée
├── game/       scènes et composants Phaser
├── services/   sauvegarde, audio et haptique
└── main.ts     configuration Phaser
scripts/        génération et validation offline
public/assets/  assets PNG individuels de production
android/        projet natif Capacitor
```

`src/core` ne dépend pas de Phaser. `BoardView` est dimensionné mathématiquement et prend en charge toutes les tailles sans logique spécifique à un niveau. Les marqueurs sont placés au milieu des cellules à partir de leurs coordonnées de grille.

## Génération et unicité

Le générateur construit d’abord une grille complète valide par recherche randomisée déterministe, ajoute des contraintes adjacentes cohérentes, puis retire des indices tant que le solveur confirme une solution unique. `validate-levels` échoue avec un code non nul dès qu’un niveau est invalide, insoluble, non unique ou mal dimensionné.

## Progression

- le niveau suivant se débloque après la réussite du précédent ;
- Moyen se débloque après 10 niveaux Facile ;
- Corse se débloque après 15 niveaux Moyen ;
- 3 étoiles : aucune erreur, aucun indice ;
- 2 étoiles : au plus 3 erreurs et 1 indice ;
- 1 étoile : niveau terminé avec davantage d’assistance.

## Assets et direction artistique

Les grandes planches dans `public/assets/references` servent uniquement de références. Le runtime charge exclusivement les PNG individuels : logo, mascottes, cadre, marqueurs, décor et FX. Les cellules, boutons, panneaux et toggles restent des objets Phaser redimensionnables.

## Audio

Le pack ne contient pas de sons. `AudioService` fournit donc des feedbacks synthétiques légers, clairement isolés derrière un service remplaçable. La musique est préparée dans les préférences mais reste inactive jusqu’à l’ajout d’une piste licenciée.

## Android

Le projet `android/` est préconfiguré avec l’identifiant `re.meowza.game`. Après modification du web :

```bash
npm run cap:sync
npm run android
```

Ne jamais committer de keystore, credentials ou fichier `.env` secret.

## Captures

Les captures de store pourront être ajoutées après validation sur appareils physiques (320×568 à 414×896 et Android réel).

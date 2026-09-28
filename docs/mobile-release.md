# Livraison iOS et Android

## Préparé dans cette branche

- Application `re.meowza.game`, version 1.1 ; projet Xcode et projet Android.
- iPhone et Android en portrait ; iPad conserve les orientations du template Capacitor, avec jeu centré.
- Icône Meowza sur iOS et densités Android mdpi à xxxhdpi.
- Assets, police et musique utilisables hors ligne.
- Sauvegarde de la dernière partie, progression v1 conservée.
- Retour matériel Android : règles → partie, partie → arbre, autres écrans → accueil ; accueil → minimisation.
- Mise en arrière-plan : sauvegarde et suspension audio.
- `PrivacyInfo.xcprivacy` intégré à la cible Xcode, catégorie UserDefaults / CA92.1 pour Preferences, conformément à la [documentation Capacitor](https://capacitorjs.com/docs/apis/preferences). Aucun suivi déclaré par le code du jeu.

## Contrôles exécutés

TypeScript strict ; tests moteur/progression/sauvegarde ; banque de 110 grilles valide et unique ; régénération déterministe identique ; build Vite ; synchronisation des plugins Android et iOS (installation CocoaPods non exécutée, machine Linux).

## À exécuter sur une machine native

```sh
npm ci
npm run check
npm run cap:sync
npm run android
# Sur Mac avec Xcode et CocoaPods :
npm run ios
```

Le workflow manuel `Native smoke build` permet aussi de demander des builds de test non signés sur GitHub Actions. Il n’a pas été exécuté dans cette session.

## Parcours de recette avant diffusion

1. Installation vierge : accueil, tutoriel, premier niveau accessible, niveaux futurs sans numéros et sans interaction.
2. Compléter deux niveaux consécutifs ; vérifier victoire, disparition des nuages, replay du premier niveau et meilleur score conservé.
3. Faire défiler l’arbre depuis une plateforme sans lancer sa partie involontairement ; tester les quatre onglets verrouillés/déverrouillés.
4. Sélectionner chaque chat, vider une case, annuler, effacer, utiliser un indice, terminer avec et sans assistance.
5. Ouvrir les règles depuis la partie, revenir sans perdre les coups ; vérifier le bouton système Android.
6. Fermer réellement l’application en cours de partie, relancer, reprendre la grille et les compteurs.
7. Tester une sauvegarde de la version précédente : 80 niveaux inchangés, mêmes seuils d’accès, mêmes meilleurs scores.
8. Tester les formats 320×568, 390×844, 414×896 et tablette, zones sûres, rotation iPad, gestes et lisibilité des grilles 8×8.
9. Tester les interrupteurs audio/haptique, le mode silencieux, la mise en arrière-plan et les animations réduites.
10. Tester sans réseau après installation. Vérifier performances et mémoire sur un Android modeste.

## Avant App Store / Google Play

Compiler et tester les binaires avec les SDK exigés par les stores au moment de la soumission. Configurer les équipes Apple, certificats, profils et signature Android avec les comptes du propriétaire. Vérifier les masques de l’icône adaptative et les écrans de lancement natifs. Préparer captures réelles, description, contact de support, URL de confidentialité et déclarations de données correspondant au binaire final. Les valeurs finales dépendent notamment des éventuels SDK ajoutés ensuite.

Aucun binaire signé, compte store, achat, publication ou soumission n’a été réalisé ici.

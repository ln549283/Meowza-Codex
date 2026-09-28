# Audit et correction des missions quotidiennes — 14 septembre 2026

Base inspectée : branche kawaii-cat-tree-refonte-v3, commit 3208a73514e7963c0dda84c4a971b5670c774dcc.
Périmètre : logique des missions, sauvegarde, récompenses, affichage du budget d'erreurs.
Cette correction ne modifie pas les grilles, le solveur, les assets ou le parcours visuel.

## Défauts reproduits ou couverts par une régression

| Défaut avant correction | Effet pour le joueur | Correction |
| --- | --- | --- |
| error_budget compare errors à 2 - m.progress | Après trois victoires parfaites, 0 <= -1 est faux : mission bloquée à 3/5. | Compteur de victoires distinct de l'historique des erreurs. |
| updateDailyOnWin est dans la branche première victoire | Rejouer un niveau ne fait jamais avancer les missions, y compris un jour ultérieur. | Toutes les victoires comptent pour les missions ; croquettes et cosmétiques restent réservés à la première complétion. |
| trackFailure et trackAbandon ne réinitialisent pas perfectStreak | Parfait, défaite, parfait peut valider deux parfaits « d'affilée ». | Une défaite ou un abandon interrompt les séries partielles. Une récompense déjà acquise reste acquise. |
| Sélection fondée sur les grilles en cache | Une difficulté non accessible peut être proposée si préchargée ; une difficulté devenue accessible est ignorée avant génération. Les débutants peuvent recevoir Medium+. | Vérifier les niveaux effectivement débloqués et la spécification du prochain sommet ; filtrer aussi les missions Medium+. |
| Fallback de difficulté basé sur id.split('-')[0] | Un trail sans grille en cache devient de difficulté « trail » et valide à tort Medium+. | Déduire la difficulté du sommet pour les ids trail. |

## Reproduction exacte du blocage initial

Huit victoires consécutives à zéro erreur, en exécutant la condition extraite du code initial :

| Victoires | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Progression affichée | 1 | 2 | 3 | 3 | 3 | 3 | 3 | 3 |

## Comportement choisi et explicite

- « Précision féline » : réussir une série de cinq victoires avec au plus deux erreurs.
- Si une victoire dépasse le budget cumulé, conserver la plus longue fin de série encore admissible. Exemple : erreurs [2,0,1] → garder [0,1], donc 2/5 avec une erreur.
- Une défaite ou un abandon remet à zéro une série de précision non terminée.
- Les replays comptent : les titres parlent de victoires, sans imposer de niveaux distincts.
- Une victoire peut progresser dans plusieurs missions, comme auparavant.
- La prime de première victoire, les jalons cosmétiques et le total de niveaux distincts ne sont pas multipliés par les replays.
- Une récompense validée ne peut plus être perdue par une défaite suivante.
- Trois missions distinctes sont générées par jour. La sélection reste déterministe à date, graine et progression identiques.
- La liste déjà tirée reste stable durant la journée ; les nouvelles disponibilités sont prises en compte au tirage suivant.
- Les dates restent locales, conformément au comportement existant ; ce correctif ne crée pas de Daily Extreme interserveur.

## Compatibilité des sauvegardes

Champ optionnel ajouté : DailyMission.errorWindow (historique des erreurs de la série en cours).
Pas de remise à zéro du compte, des monnaies, de l'arbre ou des cosmétiques.
L'ancienne sauvegarde ne stockait pas les erreurs de précision : une ancienne mission de précision PARTIELLE recommence à zéro une fois. Impossible de reconstituer honnêtement cet historique.
Les missions de précision déjà validées ou réclamées sont préservées.
Les autres missions et leur progression restent inchangées.

## Vérification reproductible

22 tests ajoutés dans src/core/dailyMissions.test.ts :
précision à zéro/deux erreurs, dépassement et récupération, interruption,
migration, sauvegarde/rechargement, replays, monnaie non dupliquée,
attribution unique, objectifs accessibles, 256 graines de nouveaux joueurs,
128 graines avec une grille future en cache, seuils hard/timed sans cache,
stabilité quotidienne, changement de jour, vraie difficulté des replays.

Exécuter :
    node --import tsx --test src/core/dailyMissions.test.ts
    npm run check

Le workflow Quality existant exécute déjà le typage, tous les tests, la validation de la banque et le build à chaque push / pull request.
Les résultats GitHub Actions du commit livré font foi.
La recette visuelle mobile et la publication stores ne sont pas couvertes par ces tests.

## Recette manuelle courte

1. Afficher une mission Précision féline : vérifier le nombre de victoires et le budget d'erreurs.
2. Faire cinq victoires parfaites, y compris sur le même niveau : 5/5, diamant récupérable une seule fois.
3. Sur une nouvelle série, faire parfait → défaite → parfait : la série parfaite reste à 1/2.
4. Fermer et rouvrir après trois victoires avec erreurs [1,0,1] : précision 3/5 et budget 2/2.
5. Nouveau compte : aucune mission exigeant une difficulté supérieure au niveau accessible.

## Revue complémentaire — 15 septembre 2026

- La progression affichée d'une série parfaite partielle retombe immédiatement à zéro après une défaite, un abandon ou une victoire imparfaite. Les séries terminées restent acquises.
- Un sommet chronométré sans grille en cache conserve son statut chronométré et sa récompense de 18 croquettes.
- La vue quotidienne affiche le montant stocké dans la mission.
- Trois tests de régression supplémentaires couvrent ces cas : 55 tests au total.

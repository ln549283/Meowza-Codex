# MEOWZA — AUDIT BIBLE VS CODE & ROADMAP D’EXÉCUTION

> Branche auditée : `kawaii-cat-tree-refonte-v2`
>
> Source produit : `docs/MEOWZA_PRODUCT_BIBLE.md`
>
> Objectif : transformer les écarts entre la vision cible et le code actuel en ordre de chantier concret.

---

# 1. Verdict exécutif

Le repository contient déjà un **socle puzzle exploitable** : modèle binaire, validation, solveur classique, génération seedée, persistance locale, scènes Phaser et build mobile Capacitor.

En revanche, le produit actuellement exécuté reste structurellement proche de l’ancienne version : quatre chapitres séparés, hint gratuit/reveal, Undo/Reset, étoiles, absence de défaite à 3 erreurs, absence d’économie et absence de Human Solver explicable.

La bonne stratégie n’est donc **pas une réécriture totale**. Il faut conserver le moteur logique et mobile qui fonctionne, puis remplacer progressivement la boucle produit qui l’entoure.

## Priorité absolue

> **P0 = remettre la boucle d’une tentative en conformité avec la Bible avant de construire l’économie, l’arbre infini ou le Daily.**

Si cette boucle n’est pas excellente, tout le méta construit au-dessus amplifie un mauvais produit.

---

# 2. Matrice Bible → code actuel

## A. Core puzzle

### Statut : 🟢 BASE SOLIDE

**Bible / cible**
- équilibre 50/50 ;
- jamais 3 identiques ;
- SAME / DIFFERENT ;
- solution unique.

**Code actuel**
- modèle `EMPTY / GREY / ORANGE` ;
- validation lignes/colonnes et contraintes ;
- solveur backtracking ;
- comptage de solutions ;
- génération vérifiant l’unicité.

**Conclusion**
Conserver ce socle. Ne pas réécrire les règles fondamentales.

**Priorité : P0 protection par tests.**

---

## B. Human Solver

### Statut : 🔴 MANQUANT COMME SYSTÈME PRODUIT

**Bible / cible**
Human Solver distinct du solveur machine, capable d’expliquer les déductions et d’utiliser au besoin hypothèse → propagation → contradiction.

**Code actuel**
`difficulty.ts` cherche seulement les cases ayant une seule valeur immédiatement valide. `findHint()` utilise la même logique locale puis, si aucune case forcée n’est trouvée, résout la grille et révèle arbitrairement la première case vide.

**Risque**
Le système actuel ne peut pas garantir qu’un indice explique un raisonnement humain. Il ne suffit pas non plus pour calibrer réellement Hard/Extreme.

**Priorité : P1 critique.**

---

## C. Erreurs et 3 chances

### Statut : 🔴 CONTRADICTION PRODUIT

**Bible / cible**
Une erreur = valeur différente de la solution cachée. Le mauvais chat est rejeté. Trois erreurs provoquent la défaite. Gros cœur à trois états.

**Code actuel**
Une erreur est comptée seulement lorsqu’un placement introduit une violation détectable des règles visibles. Le mauvais chat reste sur la grille et peut être coloré en erreur. Il n’y a pas de défaite après trois erreurs.

**Risque**
La boucle actuelle ne correspond pas à l’économie, aux rewarded continuations ni au modèle émotionnel validé.

**Priorité : P0 — premier chantier gameplay.**

---

## D. Undo / Reset

### Statut : 🔴 SUPERSEDED MAIS ENCORE ACTIF

**Bible / cible**
Undo supprimé. Reset supprimé.

**Code actuel**
Les deux boutons existent dans `GameScene` et `BoardView` maintient un historique pour Undo/Reset/reveal.

**Priorité : P0.**

Attention : ne pas simplement supprimer l’historique avant d’avoir séparé les besoins éventuels du nouveau système d’indice/animation.

---

## E. Indices

### Statut : 🔴 PRODUIT NON CONFORME

**Bible / cible**
- aide générale gratuite ;
- indice précis expliqué par Human Solver ;
- maximum 3 par tentative ;
- prix 15 / 25 / 40 croquettes ;
- quota visible avant achat ;
- Retry = reset complet.

**Code actuel**
- bouton `Indice` gratuit ;
- nombre non limité ;
- reveal direct d’une case ;
- aucune croquette ;
- aucune explication logique ;
- compteur uniquement textuel dans le statut.

**Priorité : P1, juste après la nouvelle boucle erreurs/retry et le premier Human Solver.**

---

## F. Retry

### Statut : 🟡 PARTIEL / À REDÉFINIR

**Bible / cible**
Retry = nouvelle tentative complète : grille, cœur, erreurs, chrono, quota indices et rewarded continuation réinitialisés.

**Code actuel**
Le jeu sauvegarde une session grille/erreurs/hints et propose rejouer depuis Victory. Il n’existe pas encore de véritable état d’Attempt modélisé.

**Conclusion**
Créer une notion explicite d’**AttemptState** avant d’ajouter Timed, rewarded continuation et économie d’indices.

**Priorité : P0 architecture légère.**

---

## G. Étoiles

### Statut : 🔴 SUPERSEDED MAIS PROFONDÉMENT CÂBLÉ

**Bible / cible**
Étoiles supprimées.

**Code actuel**
Les étoiles sont calculées dans `GameScene`, stockées dans `SaveService`, affichées sur l’arbre et sur `VictoryScene`.

**Priorité : P0/P1.**

Les retirer proprement du modèle de sauvegarde nécessite une migration compatible avec les saves existantes, pas seulement masquer l’UI.

---

## H. Progression / arbre unique

### Statut : 🔴 ARCHITECTURE ACTUELLE OBSOLÈTE

**Bible / cible**
Un seul arbre continu, difficultés mélangées, progression contrôlée et long tail hybride.

**Code actuel**
`progression.ts` définit quatre chapitres Easy/Medium/Hard/Extreme avec 20/30/30/30 niveaux et seuils entre chapitres. `LevelSelectScene` affiche un arbre indépendant par difficulté et quatre boutons de chapitres.

**Priorité : P2.**

Ne pas démarrer ce chantier avant stabilisation de la boucle puzzle et du modèle de progression cible.

---

## I. Génération infinie hybride

### Statut : 🟡 BRIQUE TECHNIQUE EXISTANTE MAIS PRODUIT INCOMPLET

**Bible / cible**
Niveaux stratégiques contrôlés + long tail déterministe seedé + validation unicité + Human Solver + difficulté cible.

**Code actuel**
La génération est déjà déterministe via `SeededRandom`, produit une solution et retire des clues en conservant l’unicité. Mais `generateBank()` fabrique surtout une banque fixe 20/30/30/30 et la difficulté est liée à des taux de clues et à `requiresLookahead` rudimentaire.

**Conclusion**
Ne pas jeter `generator.ts`. Le faire évoluer après le Human Solver.

**Priorité : P2.**

---

## J. Extreme Timed

### Statut : 🔴 ABSENT

**Bible / cible**
Timed obligatoire dans le parcours ; chrono au premier placement ; pause background/hint ; timeout = défaite ; retry même grille.

**Code actuel**
`GameScene` affiche explicitement « Pas de chrono ».

**Priorité : P2**, après AttemptState + Human Solver + progression cible.

---

## K. Croquettes

### Statut : 🔴 ABSENT

**Bible / cible**
Monnaie gameplay pour les indices, gains par première réussite selon difficulté.

**Code actuel**
`SaveData` ne contient aucune monnaie.

**Priorité : P1/P2.**

Implémenter seulement quand l’indice Human Solver fonctionne. Sinon on construit une économie autour d’un mauvais service.

---

## L. Diamants / missions / boutique / cosmétiques / collection

### Statut : 🔴 ABSENT

**Code actuel**
Aucun état de diamants, missions, inventory, shop ou collection dans `SaveService`/`src`.

**Priorité : P3.**

À ne pas implémenter avant la preuve de la boucle core et l’arbre cible.

---

## M. Daily / leaderboard / backend / anti-cheat

### Statut : 🔴 ABSENT

**Bible / cible**
Daily Extreme mondial, tentative classée unique, serveur autoritaire, score erreurs puis temps, Cat Day, anti-cheat multi-signal.

**Code actuel**
Architecture locale Phaser/Capacitor + Preferences. Aucun service réseau/compte/leaderboard observé dans `src`.

**Priorité : P4.**

C’est un chantier produit/backend indépendant qui ne doit pas retarder la validation du jeu solo.

---

## N. Mobile / performance

### Statut : 🟡 SOCLE EXISTANT, RISQUE NON RÉSOLU

**Code actuel**
Capacitor, haptics et services audio existent. BoardView recrée des sprites et utilise plusieurs Graphics/tweens. L’arbre actuel crée tous les nodes d’un chapitre en même temps.

**Risque connu**
Chauffe téléphone et sélection tactile peu fiable signalées en test réel.

**Priorité : P0 transversal.**

Chaque gros chantier UI doit être validé sur appareil réel. Ne pas attendre la fin du projet pour optimiser.

---

# 3. Ordre de chantier recommandé

## PHASE 0 — FILET DE SÉCURITÉ

### Objectif
Pouvoir modifier la boucle de jeu sans casser les règles fondamentales.

### À faire
1. renforcer tests core puzzle / solution unique / contraintes ;
2. ajouter tests ciblés sur le comportement d’une tentative ;
3. prévoir migration SaveData avant suppression des étoiles ;
4. vérifier build web + Android/iOS smoke ;
5. définir instrumentation minimale de performance de dev.

### Critère de sortie
Le core logique est protégé et le format de sauvegarde peut évoluer sans perdre silencieusement la progression.

---

## PHASE 1 — NOUVELLE BOUCLE D’UNE TENTATIVE

### Objectif
Faire enfin jouer **Meowza tel que décrit dans la Bible**, même avec l’ancien arbre.

### À faire
1. créer `AttemptState` explicite ;
2. validation du placement contre `level.solution` ;
3. mauvais chat rejeté immédiatement ;
4. compteur 3 erreurs ;
5. gros cœur 3 états + break au troisième ;
6. écran/overlay défaite « Chat alors… » ;
7. Retry = reset total ;
8. supprimer Undo ;
9. supprimer Reset ;
10. supprimer étoiles de Game/Victory/Map/Save avec migration ;
11. faire de Victory → Niveau suivant un lancement direct du prochain puzzle ;
12. validation tactile et chauffe sur téléphone réel.

### Pourquoi en premier
C’est la boucle répétée des centaines de fois. Chaque autre système dépend de sa qualité.

### Critère de sortie
Un joueur peut enchaîner les niveaux avec 3 erreurs, cœur, défaite/retry et victoire sans aucune ancienne mécanique étoile/Undo/Reset.

---

## PHASE 2 — HUMAN SOLVER V1 + INDICES

### Objectif
Faire de l’aide un élément de maîtrise, pas un cheat button.

### À faire
1. définir un modèle de `Deduction` explicable ;
2. implémenter stratégies de base : 50/50, jamais 3, SAME, DIFFERENT ;
3. propagation ;
4. explication courte et cellules impliquées ;
5. supprimer fallback opaque « solve puis révèle première case » ;
6. brancher UI Loupe ;
7. 3 marqueurs visibles ;
8. quota 3/tentative ;
9. prix 15/25/40 ;
10. aide générale gratuite séparée ;
11. tests Human Solver sur grilles préparées.

### Critère de sortie
Chaque indice précis affiché peut répondre à la question : **« pourquoi cette case ? »**.

---

## PHASE 3 — CROQUETTES + ONBOARDING + DIFFICULTÉ

### Objectif
Créer la première boucle de progression économiquement cohérente.

### À faire
1. croquettes dans SaveData avec migration ;
2. gains première complétion 5/8/12/15/18 en paramètres de tuning ;
3. dépense atomique pour indice ;
4. niveaux 1–5 pédagogiques conformes à la Bible ;
5. Human Solver utilisé pour profiler/calibrer les niveaux ;
6. analytics de dev : erreurs, indices, retry, abandon, probing.

### Critère de sortie
Les 20 premières minutes sont testables sur joueur externe et les indices ont un vrai coût/une vraie valeur.

---

## PHASE 4 — PROGRESSION UNIQUE + GÉNÉRATION HYBRIDE

### Objectif
Remplacer définitivement l’ancienne architecture quatre chapitres.

### À faire
1. modèle `ProgressionNode` global ;
2. séquence de difficultés selon les distributions de la Bible ;
3. conserver niveaux stratégiques préparés ;
4. long tail seedé ;
5. validation unicité + Human Solver + cible de difficulté ;
6. même seed = même niveau ;
7. persister nodes découverts ;
8. refondre `LevelSelectScene` en arbre unique continu ;
9. virtualiser/réutiliser les modules visibles ;
10. front de nuages cohérent ;
11. milestones préparés.

### Critère de sortie
Il n’existe plus de notion produit de « chapitre Easy/Medium/Hard/Extreme » dans la navigation.

---

## PHASE 5 — EXTREME TIMED + REWARDED CONTINUATION ABSTRAITE

### Objectif
Ajouter la tension sans dénaturer la logique.

### À faire
1. timer démarrant au premier placement ;
2. pause background ;
3. pause pendant explication hint ;
4. timeout defeat ;
5. retry même seed/grille ;
6. interface de continuation abstraite ;
7. une continuation max par tentative toutes causes confondues ;
8. provider ad mockable avant intégration SDK réelle ;
9. mesurer frustration et taux de reprise.

### Critère de sortie
Timed fonctionne même sans réseau/pub disponible et ne bloque jamais le retry.

---

## PHASE 6 — ARBRE VIVANT / COLLECTION / COSMÉTIQUES

### Objectif
Transformer la progression en objet d’attachement.

### À faire
1. modèle collection chats ;
2. protection anti-doublons ;
3. slots d’habitants/cosmétiques ;
4. chats visibles dans l’arbre ;
5. milestones visuels ;
6. diamants ;
7. missions quotidiennes 3×1 diamant ;
8. boutique directe sans gacha payé ;
9. thèmes/cosmétiques.

### Critère de sortie
Le joueur peut montrer un arbre sensiblement différent sans que le gameplay logique soit affecté.

---

## PHASE 7 — BACKEND DAILY / CAT DAY

### Objectif
Créer la couche compétitive seulement une fois le solo prouvé.

### À faire
1. identité joueur ;
2. backend ;
3. Daily server-served/déterministe ;
4. tentative classée unique ;
5. journal de coups ;
6. temps serveur/plausibilité ;
7. leaderboard erreurs puis temps ;
8. Human Solver comme signal anti-cheat ;
9. distribution rewards ;
10. Cat Day samedi, clôture/récompenses dimanche 00:01 UTC ;
11. règles faible population ;
12. monitoring et outils d’administration.

### Critère de sortie
Un score classé important ne dépend jamais uniquement d’une déclaration du client.

---

# 4. Ce qu’il ne faut PAS faire maintenant

1. Ne pas commencer le backend Daily.
2. Ne pas construire une boutique complète.
3. Ne pas refaire tout l’arbre avant le nouveau gameplay d’erreur/retry.
4. Ne pas générer des milliers de niveaux avec le difficulty scorer actuel.
5. Ne pas intégrer une vraie régie pub avant d’avoir la continuation fonctionnelle avec un provider mock.
6. Ne pas produire une grande quantité d’assets premium avant que les slots et la DA système soient stabilisés.
7. Ne pas optimiser l’économie par intuition avant d’avoir des données de joueurs.
8. Ne pas confondre « techniquement implémenté » avec « produit validé ».

---

# 5. Premier chantier recommandé

> **Sprint 1 : Attempt Loop Rewrite**

Le premier travail de code doit être volontairement étroit :

- AttemptState ;
- placement comparé à la solution ;
- rejet d’une erreur ;
- gros cœur 3 états ;
- troisième erreur → défaite ;
- Retry total ;
- suppression Undo/Reset ;
- suppression étoiles avec migration ;
- Next Level direct ;
- tests ;
- validation téléphone réel.

**Aucun croquette, diamant, arbre infini, Daily ou pub réelle dans ce sprint.**

C’est le meilleur ratio valeur/risque : il transforme immédiatement la sensation du jeu et prépare proprement tous les systèmes suivants.

---

# 6. Règle de gouvernance

Après chaque phase :

1. build vert ;
2. tests verts ;
3. test appareil réel ;
4. comparaison Bible/code ;
5. seulement ensuite phase suivante.

Quand une idée apparaît en cours de chantier, demander :

> **Est-ce nécessaire pour prouver la phase actuelle ?**

Si non, la placer dans le backlog au lieu d’élargir le chantier.

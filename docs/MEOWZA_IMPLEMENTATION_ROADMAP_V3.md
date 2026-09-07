# MEOWZA — AUDIT RÉEL & ROADMAP V3

> Branche de référence technique : `kawaii-cat-tree-refonte-v3`
>
> Base réelle : `codex/kawaii-cat-tree`
>
> Cible produit : `MEOWZA_PRODUCT_BIBLE.md`
>
> Cette roadmap remplace l'audit réalisé sur `kawaii-cat-tree-refonte-v2`, qui reposait sur une base obsolète.

---

# 1. Verdict exécutif

La vraie branche est **beaucoup plus avancée** que l'ancien audit ne le laissait penser.

Meowza possède déjà :

- un arbre unique continu et virtualisé ;
- une progression `trail-*` déterministe ;
- une génération hybride seedée ;
- un Human Solver explicable ;
- les déductions balance / triple / relation / contradiction ;
- des indices payants en croquettes ;
- des niveaux Extreme Timed ;
- une sauvegarde de tentative ;
- une validation immédiate contre la solution cachée ;
- trois erreurs avant défaite ;
- une économie croquettes ;
- des cosmétiques d'arbre ;
- une Home et une direction visuelle déjà nettement plus proches de la cible.

La stratégie correcte n'est donc **ni une réécriture, ni la reconstruction du Human Solver ou de l'arbre**.

> **Le prochain chantier est un nettoyage ciblé de la boucle de tentative pour la rendre strictement conforme à la Bible.**

---

# 2. Ce qui est déjà aligné avec la Bible

## A. Arbre unique continu — 🟢 IMPLÉMENTÉ

Le produit utilise déjà une progression `trail-*` dans un arbre unique. `LevelSelectScene` virtualise les rangées visibles, conserve un offset de scroll et mélange les difficultés dans le même parcours.

**Décision : conserver cette architecture.**

---

## B. Progression déterministe / long tail — 🟢 IMPLÉMENTÉ

`journey.ts` définit :

- des séquences de difficulté contrôlées ;
- des niveaux 1–5 spécifiques ;
- des seeds déterministes ;
- une génération vérifiée par Human Solver ;
- des Extreme et Extreme Timed ;
- une sortie stable par niveau sauvegardée via le système Journey.

**Décision : ne pas reconstruire le système de génération. Le calibrer seulement.**

---

## C. Human Solver — 🟢 IMPLÉMENTÉ, À CALIBRER

Le Human Solver existe réellement et ne lit pas la solution cachée pour produire ses déductions.

Il gère :

- équilibre 50/50 ;
- jamais trois ;
- SAME / DIFFERENT ;
- hypothèse temporaire ;
- propagation ;
- contradiction ;
- explications et sources.

**Décision : conserver.**

Travail restant : tests de couverture, calibration de profondeur/chaînes, validation que les grilles difficiles restent agréables pour un humain.

---

## D. Validation immédiate contre solution cachée — 🟢 IMPLÉMENTÉ

`BoardView` compare déjà le chat joué à `level.solution`.

Un mauvais chat :

- ne reste pas dans la grille ;
- incrémente le nombre d'erreurs ;
- déclenche feedback audio/haptique ;
- mène à la défaite à la troisième erreur.

**Décision : conserver le principe.**

---

## E. Extreme Timed — 🟢 BASE IMPLÉMENTÉE

Le chrono :

- démarre avec la tentative / premier placement ;
- se suspend lorsque le document est caché ;
- mène à une défaite à zéro ;
- retry gratuit ;
- propose déjà une aide anti-bloc après plusieurs échecs (+50 % de temps).

**Décision : conserver l'architecture et calibrer plus tard.**

---

## F. Croquettes — 🟢 IMPLÉMENTÉ

Le jeu possède déjà :

- un solde de croquettes ;
- des récompenses par difficulté ;
- des achats d'indices ;
- une persistance locale.

**Décision : ne pas refaire l'économie croquettes, mais corriger les paramètres et règles qui divergent de la Bible.**

---

## G. Cosmétiques sur l'arbre — 🟢 BASE IMPLÉMENTÉE

L'arbre possède déjà des slots d'ambiance / coussins / bois et des déblocages cosmétiques.

**Décision : conserver le principe de personnalisation directement sur l'arbre.**

---

# 3. Divergences prioritaires avec la Bible

## A. Undo encore présent — 🔴 CONTRADICTION

La Bible supprime Undo.

Le code actuel affiche encore `↶ Annuler` et maintient un historique de grille.

**Action : supprimer Undo de l'UI et nettoyer uniquement l'historique devenu inutile.**

**Priorité : P0.**

---

## B. Reset / Effacer encore présent — 🔴 CONTRADICTION

La Bible supprime Reset / Tout effacer.

Le code actuel affiche encore `↻ Effacer` et permet de revenir à la grille initiale pendant la tentative.

**Action : supprimer.**

**Priorité : P0.**

---

## C. Étoiles encore présentes — 🔴 CONTRADICTION

La Bible supprime les étoiles.

Le code actuel :

- calcule encore 1–3 étoiles ;
- stocke `stars` dans `LevelProgress` ;
- les affiche dans Victory ;
- utilise le texte « Trois étoiles, bravo ! ».

**Action : supprimer le concept produit des étoiles.**

Conserver éventuellement les statistiques erreurs / indices si utiles, mais ne plus les transformer en note 1–3 étoiles.

Prévoir une migration de save sans casser les joueurs existants.

**Priorité : P0.**

---

## D. Trois petits cœurs au lieu d'un gros cœur — 🔴 CONTRADICTION VISUELLE

Le code actuel dessine trois petits cœurs dans le HUD.

La Bible verrouille un **gros cœur unique** avec trois états :

1. fissuré ;
2. très endommagé ;
3. brisé avec fragments + réaction triste.

**Action : remplacer les trois petits cœurs par le composant gros cœur.**

**Priorité : P0, mais après suppression Undo/Reset/stars pour garder le chantier simple.**

---

## E. Retry conserve les indices achetés — 🔴 CONTRADICTION MAJEURE

La Bible verrouille : **Retry = reset total**.

Le code actuel conserve `purchasedHints[levelId]` entre les tentatives et l'écran de défaite dit explicitement :

> « Tes indices achetés restent disponibles. »

`restartAttempt()` remet `attemptPurchases` à 0 mais ne supprime pas les déductions achetées du niveau.

**Action : supprimer cette persistance inter-tentative.**

À chaque retry :

- indices précis = 0/3 ;
- prix repart au premier palier ;
- aucune ancienne déduction conservée par le jeu.

**Priorité : P0.**

---

## F. Prix des indices incorrects — 🔴 CONTRADICTION

Bible :

- 15 ;
- 25 ;
- 40 croquettes.

Code actuel :

- 20 ;
- 35 ;
- 50.

**Action : passer à 15 / 25 / 40.**

**Priorité : P0.**

---

## G. Pas de limite réelle à 3 indices — 🔴 CONTRADICTION

La Bible verrouille **maximum 3 indices précis par grille et par tentative**.

Le code actuel utilise `hintCost()` qui plafonne simplement le prix au troisième tarif. Il n'interdit donc pas explicitement un quatrième achat.

**Action : quota dur 3/3.**

Le bouton doit rester visible mais désactivé après le troisième.

**Priorité : P0.**

---

## H. Quota d'indices peu lisible avant achat — 🟡 PARTIEL

Le panneau indique le coût, mais la Bible demande que le joueur sache **avant le premier achat** qu'il dispose de trois indices maximum.

**Action :**

- trois marqueurs visibles près de la loupe ;
- `Indice 1/3 · 15`, `Indice 2/3 · 25`, `Dernier indice · 40` ;
- après troisième : `3/3 utilisés`.

**Priorité : P0/P1.**

---

## I. Aide générale gratuite — 🟡 PARTIEL

Les règles sont consultables gratuitement, ce qui couvre une partie du besoin.

Mais l'architecture actuelle du bouton Loupe ouvre directement la logique d'indice précis payant.

**Action : vérifier en playtest si l'accès aux règles suffit comme aide générale ou si une micro-aide contextuelle gratuite séparée est nécessaire.**

**Priorité : P1, pas avant le quota payant.**

---

# 4. Systèmes cible encore absents ou incomplets

## A. Diamants — 🔴 ABSENT

Aucune monnaie premium diamant dans le SaveData actuel.

**Priorité : P2/P3.**

Ne pas l'ajouter avant validation de la boucle puzzle et de la rétention des premières sessions.

---

## B. Missions quotidiennes — 🔴 ABSENT

Pas de système de 3 missions quotidiennes / 1 diamant chacune.

**Priorité : P3.**

---

## C. Collection de chats — 🔴 ABSENT COMME SYSTÈME COMPLET

Nimbus et Moka existent, mais il n'y a pas encore de vraie collection d'habitants de l'arbre avec sources progression / événement / premium.

**Priorité : P3.**

---

## D. Rewarded continuation — 🔴 ABSENT

Pas de provider rewarded-ad / continuation après troisième erreur ou timeout.

**Priorité : P2**, après stabilisation de la tentative.

Commencer par une abstraction/mock, pas par un SDK publicitaire réel.

---

## E. Daily Extreme / leaderboard / Cat Day — 🔴 ABSENT

Les services actuels sont locaux : audio, haptics, journey, save, worker de génération.

Pas de backend, identité, leaderboard, résultat serveur, Daily mondial ou Cat Day.

**Priorité : P4.**

Ne pas bloquer le soft launch solo avec ce chantier.

---

# 5. Roadmap corrigée

## SPRINT V3-1 — CONFORMITÉ DE LA TENTATIVE

**C'est le prochain chantier.**

Objectif : enlever les dernières mécaniques héritées qui contredisent directement la Bible.

À faire :

1. supprimer Undo ;
2. supprimer Reset / Effacer ;
3. supprimer étoiles du gameplay, Victory et modèle de save avec migration ;
4. rendre Retry réellement total ;
5. supprimer la persistance des indices achetés entre tentatives ;
6. prix indices = 15 / 25 / 40 ;
7. quota dur = 3 indices ;
8. afficher clairement 1/3, 2/3, 3/3 ;
9. remplacer les trois petits cœurs par un gros cœur à trois états ;
10. tests de tentative / hint / save ;
11. validation mobile réelle.

### Critère de sortie

Une tentative normale suit exactement :

> placement → erreur rejetée → gros cœur se dégrade → troisième erreur → Chat alors… → Retry total

Et un indice suit exactement :

> 1/3 à 15 → 2/3 à 25 → 3/3 à 40 → plus aucun indice précis jusqu'au retry.

---

## SPRINT V3-2 — POLISH & CALIBRATION CORE

Après V3-1 seulement :

- feedback gros cœur / chats ;
- calibration Human Solver ;
- onboarding L1–5 ;
- difficulté des séquences ;
- Extreme Timed ;
- performances arbre/grille ;
- sélection tactile ;
- chauffe téléphone ;
- instrumentation probing / erreurs / abandon / hints.

Objectif : rendre les 20 premières minutes excellentes avant d'étendre le méta.

---

## SPRINT V3-3 — META ÉCONOMIQUE LÉGER

Seulement après playtests :

- diamants ;
- missions quotidiennes ;
- collection de chats ;
- récompenses milestones ;
- extension cosmétiques ;
- boutique directe sans gacha payé.

---

## SPRINT V3-4 — REWARDED CONTINUATION

- abstraction provider ;
- mock ;
- une continuation max par tentative ;
- erreur 3 ou timeout ;
- aucun blocage si pub indisponible ;
- mesure de l'usage et de la frustration.

---

## SPRINT V3-5 — DAILY / BACKEND / CAT DAY

Dernier gros chantier :

- identité ;
- backend ;
- Daily Extreme ;
- tentative classée unique ;
- move log ;
- serveur autoritaire ;
- classement erreurs puis temps ;
- anti-cheat multi-signal ;
- récompenses ;
- Cat Day.

---

# 6. Ce qu'il ne faut PAS refaire

Ne pas reconstruire :

- le Human Solver ;
- l'arbre unique ;
- le générateur seedé ;
- la progression `trail-*` ;
- l'architecture Timed ;
- l'économie croquettes de base ;
- la personnalisation d'arbre existante.

Ces systèmes sont désormais des **bases à améliorer**, pas des trous à combler.

---

# 7. Décision immédiate

> **Commencer par Sprint V3-1 et rien d'autre.**

C'est un chantier beaucoup plus petit et plus sûr que l'ancien Sprint 1 imaginé sur la branche obsolète.

Il ne faut ajouter ni diamants, ni Daily, ni ads réelles, ni nouveau système de progression avant que cette tentative soit strictement conforme à la Bible et validée sur téléphone.

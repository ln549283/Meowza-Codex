# MEOWZA — ROADMAP D’EXÉCUTION V3

> Branche de travail : `kawaii-cat-tree-refonte-v3`
>
> Base source : `codex/kawaii-cat-tree`
>
> Cible produit : `MEOWZA_PRODUCT_BIBLE.md`

---

# 0. RÈGLE D’EXÉCUTION — OBLIGATOIRE

Cette roadmap est la **source de vérité opérationnelle**.

Une étape n’est jamais considérée terminée parce que « le code existe » ou parce que la CI est verte.

Pour avancer au bloc suivant, il faut :

1. toutes les tâches du bloc cochées ;
2. le critère de sortie du bloc validé ;
3. la validation réelle sur téléphone lorsque le bloc touche au tactile, à la performance, au rendu ou aux animations ;
4. aucune tâche ouverte du même métier laissée derrière ;
5. les idées hors bloc sont mises en backlog, pas implémentées immédiatement.

**Règle : un bloc = un objectif mesurable.**

Ne pas ouvrir le méta économique tant que le core fonctionnel **et** le polish visuel ne sont pas fermés.

---

# 1. ÉTAT GLOBAL

```text
V3-1  Conformité tentative            ✅ FERMÉ
V3-2A Gameplay / calibration core      ✅ FERMÉ
V3-2B Polish visuel / juice / motion   🟡 EN COURS
V3-2C Playtest 20 premières minutes    ⬜ À FAIRE
V3-3  Méta économique léger            ⬜ BLOQUÉ
V3-4  Rewarded continuation            ⬜ BLOQUÉ
V3-5  Daily / backend / Cat Day        ⬜ BLOQUÉ
```

---

# 2. V3-1 — CONFORMITÉ DE LA TENTATIVE — ✅ FERMÉ

Objectif : une tentative strictement conforme à la Bible.

- [x] supprimer Undo ;
- [x] supprimer Reset / Effacer ;
- [x] supprimer les étoiles ;
- [x] Retry = reset total ;
- [x] supprimer la persistance inter-tentative des indices ;
- [x] prix indices = 15 / 25 / 40 ;
- [x] quota dur = 3 indices ;
- [x] quota 1/3, 2/3, 3/3 visible ;
- [x] gros cœur unique à trois états ;
- [x] confirmation avant abandon d’une tentative commencée ;
- [x] Nouvelle partie ;
- [x] tests ;
- [x] validation mobile réelle.

### Critère de sortie — VALIDÉ

> placement → erreur rejetée → cœur se dégrade → troisième erreur → Chat alors… → Retry total

> indice 1/3 à 15 → 2/3 à 25 → 3/3 à 40 → aucun quatrième indice avant retry

---

# 3. V3-2A — GAMEPLAY / CALIBRATION CORE — ✅ FERMÉ

Objectif : rendre la boucle puzzle fiable, claire et agréable avant tout ajout méta.

- [x] onboarding L1–5 progressif ;
- [x] règle équilibre formulée clairement en chats gris / roux par ligne et colonne ;
- [x] cœur SAME introduit progressivement ;
- [x] jamais trois introduit progressivement ;
- [x] griffes DIFFERENT introduites progressivement ;
- [x] Human Solver conservé et calibré ;
- [x] Hard / Extreme nécessitent du lookahead humain ;
- [x] indices courts, rule-led, explicables ;
- [x] Extreme Timed à 5 minutes ;
- [x] sélection tactile dense fiabilisée ;
- [x] optimisation grille / feedback local ;
- [x] chauffe téléphone validée sur appareil réel ;
- [x] instrumentation probing / erreurs / abandons / hints / victoire / timeout ;
- [x] tests et CI.

### Critère de sortie — VALIDÉ

Le puzzle peut être joué sur téléphone avec des grilles denses sans problème tactile bloquant, sans chauffe anormale observée pendant le test réel, et les principales frictions de résolution sont mesurables.

---

# 4. V3-2B — POLISH VISUEL / JUICE / MOTION — 🟡 EN COURS

**C’est le chantier actif.**

Objectif : faire disparaître l’impression « UI dessinée par Phaser » et amener le jeu au niveau visuel commercial visé, tout en gardant l’interface simple, épurée et immédiatement compréhensible.

Phaser reste le moteur de rendu et d’animation. Il ne doit pas dicter l’apparence finale des composants.

## B1 — Langage visuel des composants — À FAIRE EN PREMIER

- [ ] inventorier les rectangles / cercles / panneaux / boutons génériques encore dessinés en primitives Phaser ;
- [ ] définir une famille cohérente de boutons : principal, secondaire, danger, disabled, pressed ;
- [ ] définir une famille cohérente de panneaux / cartes / modales ;
- [ ] harmoniser coins, bordures, ombres, matières, spacing et typographie ;
- [ ] améliorer les sélecteurs Nimbus / Moka ;
- [ ] améliorer le HUD cœur / indices / croquettes ;
- [ ] améliorer visuellement la grille, les cases et les contraintes sans réduire la lisibilité ;
- [ ] supprimer les composants temporaires ou trop « debug / prototype ».

### Critère de sortie B1

Sur Home, arbre, puzzle, indice, victoire et défaite, les composants importants appartiennent clairement à la même DA et aucun bouton/panneau majeur ne donne l’impression d’un simple rectangle Phaser générique.

---

## B2 — Arbre et identité des niveaux

- [ ] finaliser l’icône dédiée Extreme Timed / Coup de griffe ;
- [ ] vérifier sa lisibilité directement dans l’arbre sur téléphone ;
- [ ] différencier clairement Easy / Medium / Hard / Extreme / Timed sans surcharge ;
- [ ] harmoniser nodes, supports, coussins et éléments décoratifs ;
- [ ] vérifier la cohérence des assets avec Nimbus, Moka et la palette globale.

### Critère de sortie B2

En regardant l’arbre sans ouvrir un niveau, un joueur distingue immédiatement un Coup de griffe d’un Extreme normal et comprend visuellement la hiérarchie sans texte supplémentaire.

---

## B3 — Feedback gameplay / personnages

- [ ] finaliser les trois états visuels du gros cœur ;
- [ ] animation claire à chaque erreur ;
- [ ] animation de cœur brisé à la troisième erreur ;
- [ ] réaction Nimbus / Moka sur erreur ;
- [ ] réaction positive discrète sur bonne séquence / ligne complète ;
- [ ] feedback d’indice appliqué ;
- [ ] éviter les animations permanentes inutiles.

### Critère de sortie B3

Une erreur, une réussite, un indice et une défaite se comprennent par le mouvement et l’expression avant même de lire du texte.

---

## B4 — Micro-interactions et boutons

- [ ] état pressed visible ;
- [ ] rebond / squash léger sur tap ;
- [ ] disabled clairement distinct ;
- [ ] haptique cohérente avec le feedback visuel ;
- [ ] apparition / disparition des modales ;
- [ ] easing cohérent ;
- [ ] aucun feedback qui ralentit la résolution rapide.

### Critère de sortie B4

Tous les boutons principaux donnent une réponse immédiate au toucher et utilisent le même langage de mouvement.

---

## B5 — Transitions de scènes

- [ ] Home → arbre ;
- [ ] arbre → puzzle ;
- [ ] puzzle → indice → puzzle ;
- [ ] puzzle → victoire ;
- [ ] puzzle → défaite ;
- [ ] victoire → niveau suivant ;
- [ ] retour vers l’arbre ;
- [ ] transitions compatibles reducedMotion.

### Critère de sortie B5

Les changements de scène ne ressemblent plus à des écrans qui apparaissent brutalement et aucune transition ne gêne le rythme de jeu.

---

## B6 — Victoire / défaite / moments forts

- [ ] victoire plus satisfaisante sans étoiles ;
- [ ] animation de fin de grille ;
- [ ] réaction de chat ;
- [ ] défaite plus émotionnelle mais courte ;
- [ ] Coup de griffe : tension visuelle spécifique mais lisible ;
- [ ] pas de surenchère d’effets.

### Critère de sortie B6

La fin d’un niveau donne une vraie récompense émotionnelle et la défaite reste claire, rapide et incite au retry.

---

## B7 — Performance visuelle réelle

- [ ] test téléphone 10–15 minutes avec animations activées ;
- [ ] vérifier chauffe ;
- [ ] vérifier FPS / saccades perceptibles ;
- [ ] vérifier tactile pendant les animations ;
- [ ] vérifier reducedMotion ;
- [ ] alléger les effets coûteux si nécessaire.

### Critère de sortie V3-2B — OBLIGATOIRE

**V3-2B n’est fermé que si :**

> le jeu paraît cohérent et fini sur Home + arbre + puzzle + indice + victoire + défaite, les interactions sont animées avec sobriété, les transitions sont propres, et une session réelle de 10–15 minutes sur téléphone ne montre ni régression tactile ni chauffe problématique.

---

# 5. V3-2C — PLAYTEST DES 20 PREMIÈRES MINUTES — ⬜ BLOQUÉ PAR V3-2B

Objectif : valider le produit avant d’ajouter du méta.

- [ ] Nouvelle partie depuis zéro ;
- [ ] jouer au moins les niveaux 1–5 ;
- [ ] poursuivre jusqu’à rencontrer Medium / Hard ;
- [ ] tester au moins un Extreme et un Coup de griffe si accessible dans le parcours prévu ;
- [ ] observer compréhension des règles ;
- [ ] observer probing / erreurs ;
- [ ] observer achats d’indices ;
- [ ] observer abandons ;
- [ ] noter toute hésitation UI ;
- [ ] relire instrumentation après session ;
- [ ] corriger uniquement les problèmes réellement observés.

### Critère de sortie

Les 20 premières minutes sont suffisamment claires, agréables et engageantes pour justifier l’ouverture du méta économique.

**Sans cette validation, V3-3 reste bloqué.**

---

# 6. V3-3 — MÉTA ÉCONOMIQUE LÉGER — ⬜ BLOQUÉ

Ne commencer qu’après V3-2C.

- [ ] diamants ;
- [ ] missions quotidiennes ;
- [ ] collection de chats ;
- [ ] récompenses milestones ;
- [ ] extension cosmétiques ;
- [ ] boutique directe ;
- [ ] aucun gacha payé ;
- [ ] aucune conversion diamant → croquettes.

---

# 7. V3-4 — REWARDED CONTINUATION — ⬜ BLOQUÉ

- [ ] abstraction provider ;
- [ ] mock avant SDK réel ;
- [ ] une continuation maximum par tentative ;
- [ ] disponible après erreur 3 ou timeout ;
- [ ] aucun blocage si pub indisponible ;
- [ ] instrumentation de l’usage et de la frustration.

---

# 8. V3-5 — DAILY / BACKEND / CAT DAY — ⬜ BLOQUÉ

Dernier grand chantier.

- [ ] identité ;
- [ ] backend ;
- [ ] Daily Extreme ;
- [ ] tentative classée unique ;
- [ ] move log ;
- [ ] serveur autoritaire ;
- [ ] classement erreurs puis temps ;
- [ ] anti-cheat ;
- [ ] récompenses ;
- [ ] Cat Day.

Ne pas bloquer un soft launch solo avec ce chantier.

---

# 9. BASES À NE PAS RECONSTRUIRE

Conserver et améliorer uniquement :

- Human Solver ;
- arbre unique et virtualisé ;
- générateur seedé ;
- progression `trail-*` ;
- architecture Timed ;
- économie croquettes de base ;
- personnalisation d’arbre existante.

---

# 10. PROCHAINE ACTION UNIQUE

> **Terminer V3-2B / B1 : langage visuel des composants.**

Ne pas ouvrir diamants, missions, collection, rewarded ads ou backend avant fermeture explicite de V3-2B puis V3-2C.

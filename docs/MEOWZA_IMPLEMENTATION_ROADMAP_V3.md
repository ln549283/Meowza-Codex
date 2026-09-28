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

## Décision de séquencement du 9 septembre 2026

Les planches artistiques validées représentent **la cible visuelle finale**, pas le chantier immédiat. Le reskin complet est volontairement reporté afin de ne pas refaire une UI premium avant d’avoir stabilisé les fonctionnalités méta et la navigation qui devront y vivre.

Ordre désormais obligatoire :

> **core solide → shell produit/méta → diamants → missions → boutique/inventaire → personnalisation fonctionnelle → validation fonctionnelle → total reskin/juice → playtest final → backend/daily**

L’UI intermédiaire peut rester provisoire tant qu’elle est claire, fonctionnelle et ne bloque pas les tests.

---

# 1. ÉTAT GLOBAL

```text
V3-1   Conformité tentative                ✅ FERMÉ
V3-2A  Gameplay / calibration core          ✅ FERMÉ
V3-3A  Architecture UI / shell méta         🟡 EN COURS
V3-3B  Économie diamants                    ⬜ À FAIRE
V3-3C  Missions                             ⬜ BLOQUÉ
V3-3D  Boutique / inventaire                ⬜ BLOQUÉ
V3-3E  Personnalisation fonctionnelle       ⬜ BLOQUÉ
V3-4   Validation fonctionnelle             ⬜ BLOQUÉ
V3-5   Total reskin / polish / juice         ⬜ REPORTÉ
V3-6   Playtest final 20 premières minutes  ⬜ BLOQUÉ
V3-7   Rewarded continuation                ⬜ BLOQUÉ
V3-8   Daily / backend / Cat Day            ⬜ BLOQUÉ
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
- [x] gros cœur unique ;
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

# 4. V3-3A — ARCHITECTURE UI / SHELL MÉTA — 🟡 EN COURS

Objectif : stabiliser **où vivent les fonctionnalités finales** avant d’implémenter l’économie et avant le reskin final.

Décisions produit :

- Home = entrée légère avec le logo Meowza ;
- l’arbre = hub principal après l’entrée ;
- le logo n’est pas répété sur l’arbre ;
- l’arbre reste la progression centrale et l’espace de personnalisation ;
- Boutique, Missions et Décorer sont accessibles depuis l’arbre ;
- les emplacements croquettes / diamants existent dans le shell avant activation de l’économie diamant ;
- le bouton Jouer reste l’action dominante ;
- la navigation secondaire ne doit pas prendre le dessus sur le puzzle et la progression ;
- le bouton retour Android doit revenir au bon niveau de navigation : écrans méta → arbre → Home.

Tâches :

- [x] faire de `LevelSelectScene` le hub « Mon arbre » ;
- [x] retirer le logo de l’en-tête de l’arbre ;
- [x] garder un emplacement visible pour croquettes et futurs diamants ;
- [x] ajouter les entrées Décorer / Missions / Boutique ;
- [x] ajouter un shell Missions sans logique économique ;
- [x] transformer l’ancien Shop placeholder en shell Boutique ;
- [x] faire revenir Missions et Boutique vers l’arbre ;
- [x] aligner le bouton retour natif avec la hiérarchie Home → arbre → méta ;
- [ ] CI verte ;
- [ ] validation rapide sur téléphone de la navigation et des zones tactiles.

### Critère de sortie V3-3A

Depuis Home, le joueur peut entrer dans l’arbre, jouer, ouvrir Décorer, Missions et Boutique, revenir systématiquement à l’arbre sans cul-de-sac, et comprendre la hiérarchie du produit même si l’UI reste provisoire.

---

# 5. V3-3B — ÉCONOMIE DIAMANTS — ⬜ À FAIRE

Objectif : créer une seconde monnaie persistante sans paiement réel.

- [ ] ajouter le wallet diamants au modèle de sauvegarde et aux migrations ;
- [ ] API unique de crédit/débit avec garde-fous ;
- [ ] journaliser les principales transactions localement ;
- [ ] croquettes = gameplay / aides ;
- [ ] diamants = collection / personnalisation premium ;
- [ ] aucune conversion diamant → croquettes ;
- [ ] aucun IAP / paiement réel dans ce bloc ;
- [ ] tests de persistance, débit impossible sous zéro et migration de sauvegarde.

### Critère de sortie

Le jeu sait attribuer, sauvegarder, afficher et dépenser des diamants via une API contrôlée sans perturber l’économie croquettes existante.

---

# 6. V3-3C — MISSIONS — ⬜ BLOQUÉ PAR V3-3B

Objectif : créer une source claire et testable de diamants.

- [ ] système de missions quotidiennes ;
- [ ] jusqu’à 3 missions actives ;
- [ ] progression alimentée par les événements gameplay déjà instrumentés ;
- [ ] état claimable / claimed ;
- [ ] récompense diamant ;
- [ ] persistance ;
- [ ] aucun backend requis pour le prototype local ;
- [ ] tests déterministes.

### Critère de sortie

Une boucle complète `jouer → progresser une mission → réclamer → recevoir des diamants` fonctionne localement et persiste après redémarrage.

---

# 7. V3-3D — BOUTIQUE / INVENTAIRE — ⬜ BLOQUÉ PAR V3-3C

Objectif : donner aux diamants un usage concret sans paiement réel.

- [ ] catalogue local versionné ;
- [ ] prix diamants ;
- [ ] états verrouillé / achetable / possédé / équipé ;
- [ ] achat transactionnel ;
- [ ] inventaire persistant ;
- [ ] aucune loot box payante ;
- [ ] aucun gacha payant ;
- [ ] aucun SDK de paiement dans ce bloc.

### Critère de sortie

Le joueur peut gagner des diamants via Missions puis acheter un cosmétique déterministe qui apparaît dans son inventaire.

---

# 8. V3-3E — PERSONNALISATION FONCTIONNELLE — ⬜ BLOQUÉ PAR V3-3D

Objectif : brancher inventaire, arbre et équipement sur l’UX cible de la planche validée.

La planche de référence est **la cible UX appréciée**. C’est l’interface actuellement présente dans le code qui devra être remplacée lors de ce bloc puis habillée définitivement pendant le reskin.

Principes :

- ouverture depuis `Décorer` sur l’arbre ;
- panneau/bottom-sheet `Personnaliser mon arbre` ;
- catégories proches de la cible `Objets / Habitants / Fonds` ;
- preview directement sur l’arbre ;
- CTA `Équiper` ;
- slots contrôlés : coussin, niche/cabane, hamac, jouet, plante, background/theme ;
- un objet remplace le contenu d’un slot ;
- aucun effet gameplay.

### Critère de sortie

Un cosmétique acheté peut être trouvé, prévisualisé puis équipé dans son slot depuis l’arbre, et le résultat persiste après redémarrage.

---

# 9. V3-4 — VALIDATION FONCTIONNELLE — ⬜ BLOQUÉ

Objectif : vérifier les boucles avant d’investir dans la DA finale.

- [ ] nouvelle partie ;
- [ ] progression arbre ;
- [ ] puzzle ;
- [ ] croquettes / indices ;
- [ ] diamants ;
- [ ] missions ;
- [ ] boutique / inventaire ;
- [ ] personnalisation ;
- [ ] navigation complète ;
- [ ] sauvegarde / reprise ;
- [ ] session mobile réelle.

### Critère de sortie

Le produit est fonctionnellement proche de sa forme finale et aucune fonctionnalité majeure prévue avant soft launch n’impose de repenser la structure des écrans.

---

# 10. V3-5 — TOTAL RESKIN / POLISH VISUEL / JUICE — ⬜ REPORTÉ

Objectif : appliquer enfin la DA des planches validées **sans modifier les règles ou l’architecture fonctionnelle**.

Les planches validées sont la cible finale : composition puzzle, accueil, arbre, personnalisation, expressions Nimbus/Moka, victoire/défaite, composants et animation.

À traiter dans ce bloc :

- [ ] vrais assets premium ;
- [ ] composition puzzle proche de la planche validée ;
- [ ] cœur quatre états positionné dans la zone basse du puzzle ;
- [ ] sélecteur Nimbus/Moka final ;
- [ ] arbre final sans effet sticker ;
- [ ] Home final ;
- [ ] personnalisation finale ;
- [ ] Boutique / Missions cohérentes avec la même DA ;
- [ ] feedback correct/error ;
- [ ] réactions Nimbus/Moka ;
- [ ] victoire / défaite ;
- [ ] transitions et micro-interactions ;
- [ ] reducedMotion ;
- [ ] performance téléphone 10–15 minutes.

### Critère de sortie

Au premier coup d’œil, les écrans appartiennent clairement à la DA des planches validées et ne donnent plus l’impression d’un prototype Phaser ou d’un ancien Meowza repeint.

---

# 11. V3-6 — PLAYTEST FINAL DES 20 PREMIÈRES MINUTES — ⬜ BLOQUÉ

Objectif : tester l’expérience telle qu’elle sera réellement présentée au joueur.

- [ ] Nouvelle partie depuis zéro ;
- [ ] niveaux 1–5 ;
- [ ] Medium / Hard ;
- [ ] Extreme / Coup de griffe si accessible ;
- [ ] compréhension des règles ;
- [ ] probing / erreurs ;
- [ ] achats d’indices ;
- [ ] navigation arbre / Missions / Boutique / Décorer ;
- [ ] compréhension diamants / croquettes ;
- [ ] relire instrumentation ;
- [ ] corriger uniquement les problèmes observés.

---

# 12. V3-7 — REWARDED CONTINUATION — ⬜ BLOQUÉ

- [ ] abstraction provider ;
- [ ] mock avant SDK réel ;
- [ ] une continuation maximum par tentative ;
- [ ] disponible après erreur 3 ou timeout ;
- [ ] aucun blocage si pub indisponible ;
- [ ] instrumentation de l’usage et de la frustration.

---

# 13. V3-8 — DAILY / BACKEND / CAT DAY — ⬜ BLOQUÉ

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

# 14. BASES À NE PAS RECONSTRUIRE

Conserver et améliorer uniquement :

- Human Solver ;
- arbre unique et virtualisé ;
- générateur seedé ;
- progression `trail-*` ;
- architecture Timed ;
- économie croquettes de base ;
- instrumentation ;
- optimisations tactiles déjà validées.

---

# 15. PROCHAINE ACTION UNIQUE

> **Fermer V3-3A : CI verte puis validation rapide de la navigation Home → Mon arbre → Décorer / Missions / Boutique → retour arbre sur téléphone.**

Ne pas commencer les diamants tant que ce gate n’est pas fermé.

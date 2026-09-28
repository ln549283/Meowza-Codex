# MEOWZA — PRODUCT BIBLE

> **Source de vérité produit**
>
> Ce document prime sur le README, les anciens prompts, les conversations historiques et les suppositions d’un agent. Il décrit la **vision cible** de Meowza. Le code existant peut être en retard sur cette vision.
>
> **Règle absolue pour tout agent :** ne jamais déduire la vision produit uniquement du code ou du README. Le code sert à établir la réalité d’implémentation ; cette Bible sert à établir la cible produit.

---

## 0. Statuts utilisés

- **🔒 LOCKED** — décision produit validée. Ne pas modifier sans autorisation explicite de Loïc.
- **🧪 TUNING** — principe validé, chiffre/paramètre à calibrer par tests et données.
- **🧭 TARGET** — cible produit validée mais pas nécessairement implémentée.
- **💡 EXPERIMENTAL** — piste intéressante, non validée comme règle produit.
- **⚠️ CURRENT CODE GAP** — divergence connue entre la cible et le code actuel.
- **🗑️ SUPERSEDED** — ancienne décision explicitement abandonnée. Ne pas la ressusciter.

---

# 1. Vision produit

## 1.1 Positionnement

**🔒 Meowza est un puzzle mobile félin, kawaii, tactile, accessible immédiatement, avec une vraie montée en maîtrise.**

Le cœur du jeu est un puzzle logique binaire inspiré de Tango/Takuzu, habillé dans un univers de chats très expressif.

L’ambition visuelle et produit n’est pas celle d’un petit prototype cosy. Meowza doit viser un niveau de finition commercial mobile : compréhension immédiate, excellente sensation tactile, personnages mémorables, progression désirable et forte envie de rejouer.

**Meowdoku est l’inspiration principale d’identité produit.** Candy Crush est une référence sélective pour la lisibilité de progression, le polish, la rétention, le game feel et la capacité à construire un produit mobile de grande échelle — pas pour copier son gameplay.

Phrase directrice :

> **Un puzzle félin gourmand, accessible immédiatement, avec une vraie montée en maîtrise.**

## 1.2 Principes non négociables

**🔒**

1. Le puzzle doit rester au centre du produit.
2. Le joueur doit pouvoir jouer autant qu’il veut : **aucune énergie et aucune vie globale**.
3. La difficulté doit venir de la logique, jamais d’une frustration artificielle destinée à vendre.
4. Le jeu doit enseigner et aider sans devenir un bouton « résoudre à ma place ».
5. Les chats sont des personnages de marque et des vecteurs émotionnels, pas de simples jetons.
6. La monétisation ne doit jamais bloquer le retry ou la progression principale.
7. Les rewarded ads sont volontaires et contextuelles ; pas de publicité forcée dans la vision initiale.
8. La personnalisation et la collection doivent renforcer l’attachement à **l’arbre principal**, pas envoyer le joueur dans un méta-jeu sans rapport avec le puzzle.
9. La simplicité est une contrainte produit : ne pas construire une mécanique complexe pour protéger un cas marginal.
10. Les premières minutes de jeu passent avant la boutique : comprendre, toucher, réussir, avoir envie de faire une autre grille.

---

# 2. Core puzzle

## 2.1 Symboles

**🔒** Deux familles de chats représentent les deux valeurs binaires :

- chat gris/lilas ;
- chat orange.

Nimbus et Moka sont les deux personnages emblématiques associés à cet univers.

## 2.2 Règles fondamentales

**🔒**

Pour chaque ligne et chaque colonne :

1. autant de chats gris que de chats orange ;
2. jamais trois chats identiques consécutifs ;
3. une relation **SAME** impose deux cases identiques ;
4. une relation **DIFFERENT** impose deux cases différentes.

Les grilles doivent avoir une solution unique.

## 2.3 Ce que Meowza n’est pas

**🔒** Meowza n’est pas un puzzle N-Queens. Il n’existe pas de règle « un chat par ligne/colonne/région » ni de règle générale « les chats ne peuvent pas se toucher ».

---

# 3. Human Solver

## 3.1 Rôle

**🔒** Meowza doit posséder un **Human Solver distinct du solveur informatique classique**.

Il sert à :

1. vérifier qu’un niveau est logiquement résoluble sans guessing ;
2. mesurer/calibrer sa difficulté du point de vue humain ;
3. produire des indices explicables ;
4. produire des signaux de cohérence pour l’anti-cheat du Daily.

## 3.2 Raisonnement attendu

**🔒** Le Human Solver privilégie les déductions compréhensibles :

- équilibre 50/50 ;
- règle « jamais trois identiques » ;
- SAME ;
- DIFFERENT ;
- propagation des conséquences.

Pour les difficultés élevées, il peut effectuer une **hypothèse temporaire**, propager une courte chaîne logique, détecter une contradiction et en conclure que l’autre valeur est nécessaire — raisonnement de type Sudoku.

Le joueur ne doit jamais être obligé de deviner au hasard.

**🧪** La profondeur exacte des hypothèses, le nombre maximal de contradictions et la longueur maximale des chaînes restent des paramètres de calibration. L’objectif est qu’Extreme soit difficile pour un humain, pas qu’il exige de simuler un ordinateur.

---

# 4. Onboarding et difficulté

## 4.1 Niveaux 1 à 5

**🔒**

- **L1** — sélection + équilibre, très guidé.
- **L2** — introduction SAME / cœur.
- **L3** — SAME + jamais trois identiques.
- **L4** — introduction DIFFERENT / griffe.
- **L5** — combinaison des règles, sans guidage forcé.

Les règles restent consultables séparément.

## 4.2 Distribution de difficulté

**🔒 Cible de séquençage :**

### Niveaux 6–20
- Easy : 35 %
- Medium : 60 %
- Hard : 5 %

### Niveaux 21–50
- Easy : 5 %
- Medium : 50 %
- Hard : 25 %
- Extreme : 15 %
- Extreme Timed : 5 %

### Niveaux 51–100 et long terme
- Easy : 0 %
- Medium : 20 %
- Hard : 45 %
- Extreme : 25 %
- Extreme Timed : 10 %

Ces pourcentages doivent produire des **séquences contrôlées**, pas des tirages indépendants aléatoires.

**🔒** Pas deux Extreme Timed consécutifs. Un joueur doit rencontrer un Extreme normal avant un Extreme Timed. Prévoir des respirations, notamment du Medium après des pics de tension.

## 4.3 Affichage de la difficulté

**🔒** La difficulté ne doit pas être affichée comme un gros label pendant la résolution.

Sur l’arbre, elle peut être communiquée par l’expression des têtes de chats :

- Easy : détendu / souriant ;
- Medium : curieux ;
- Hard : concentré, jamais agressif ;
- Extreme : malicieux / magique.

**🗑️ Les étoiles de performance sont supprimées.** Ne pas réintroduire un système 1–3 étoiles sans nouvelle décision produit.

---

# 5. Progression : l’arbre Meowza

## 5.1 Structure

**🔒** La progression cible est **un seul arbre à chats continu**, pas quatre chapitres/arbre séparés par difficulté.

Les difficultés sont alternées dans le même parcours.

Le joueur peut rejouer les niveaux précédents.

Depuis la victoire, **Niveau suivant** lance directement le prochain puzzle ; il ne renvoie pas obligatoirement à l’arbre.

## 5.2 Scroll et composition

**🔒** L’arbre utilise un **scroll continu sur la même vue**, sans pagination artificielle tous les 50 niveaux.

**🧭** L’arbre doit être composé de modules variés et contrôlés : branches gauche/droite, niches, hamacs, ponts, plateformes, etc. L’aléatoire éventuel fait varier la silhouette, pas l’interface. Une composition découverte doit rester déterministe/persistante.

Le décor doit rester assez calme pour que le chemin, le niveau courant et les interactions soient immédiatement lisibles.

Les niveaux futurs sont masqués par un **front de nuages cohérent**, plutôt qu’une accumulation de petits cadenas/nuages indépendants.

**🗑️ Pas de biomes automatiques imposés par la progression.** La variation visuelle doit principalement venir de la personnalisation et des collections.

## 5.3 Contenu infini

**🔒** Approche hybride :

- niveaux stratégiques, onboarding et milestones préparés/contrôlés ;
- long tail généré de manière déterministe ;
- solution unique obligatoire ;
- validation par solveur + Human Solver ;
- difficulté contrôlée ;
- niveau reproductible/persistant.

**🗑️** Ni immense banque fixe comme unique stratégie, ni génération aléatoire non contrôlée comme unique stratégie.

---

# 6. Tentative, erreurs et défaite

## 6.1 Validation immédiate

**🔒** Une erreur signifie : **le chat placé ne correspond pas à la solution unique cachée**.

- placement correct → le chat reste ;
- placement incorrect → le chat est rejeté/quitte la case et une chance est perdue.

Cette validation permet théoriquement de sonder la solution en essayant une valeur. Ce risque est accepté pour la v1 plutôt que de dégrader l’UX avec des frictions artificielles. Il devra être mesuré en playtest.

**💡** Ne pas ajouter de verrouillage temporaire de la case après une erreur : cela ne supprime pas l’information obtenue et ajoute de la friction.

## 6.2 Trois chances

**🔒** Une tentative possède **3 erreurs autorisées**.

La troisième erreur provoque la défaite.

Il n’existe :

- ni énergie ;
- ni stock global de vies ;
- ni attente avant de rejouer.

Retry est toujours gratuit.

## 6.3 Représentation visuelle du cœur

**🔒** Ne pas utiliser trois petits cœurs HUD génériques comme représentation principale.

Utiliser un **gros cœur expressif représentant les trois chances** :

1. première erreur → fissure/dégât visible ;
2. deuxième → cœur fortement endommagé ;
3. troisième → cœur qui se brise + réaction triste du chat + défaite.

Le feedback doit être généreux et émotionnel : mauvais chat rejeté, cœur endommagé, réaction de Nimbus/Moka.

## 6.4 Retry = reset total

**🔒** Une nouvelle tentative repart de zéro :

- grille initiale ;
- cœur restauré ;
- erreurs = 0 ;
- chrono réinitialisé si Timed ;
- quota de continuation rewarded-ad restauré ;
- indices = 0/3 ;
- tarification des indices repart à 15 / 25 / 40 croquettes ;
- aucune déduction achetée lors de la tentative précédente n’est conservée par le jeu.

Le joueur conserve uniquement ce qu’il a appris ou mémorisé lui-même.

**Principe d’architecture :** ne pas maintenir un historique technique complexe des anciens indices pour protéger le cas marginal d’un joueur qui redemande la même information après un retry.

---

# 7. Contrôles de grille

**🔒**

- **Undo supprimé.** Un mauvais placement est automatiquement rejeté.
- **Reset / Tout effacer supprimé.** Les placements acceptés sont connus corrects dans le modèle de validation cible ; détruire volontairement tout le progrès apporte plus de risque que de valeur.
- Les contrôles sous la grille doivent rester minimaux et lisibles.

**⚠️ CURRENT CODE GAP :** l’implémentation auditée possède encore Undo et Reset.

---

# 8. Système d’indices

## 8.1 Philosophie

**🔒** Une aide gratuite rappelle une règle ou une technique générale sans révéler une case précise.

Un **indice payant** correspond à une déduction logique précise produite/expliquée par le Human Solver : cellules concernées + raison compréhensible.

L’indice ne doit pas être un simple reveal opaque.

## 8.2 Quota

**🔒 Maximum 3 indices précis par grille et par tentative.**

Prix :

- indice 1/3 : **15 🥣** ;
- indice 2/3 : **25 🥣** ;
- indice 3/3 : **40 🥣** ;
- aucun quatrième indice précis sur cette tentative.

Le retry remet le compteur à 0/3 et le prix repart à 15.

## 8.3 UX du quota

**🔒** Le joueur doit savoir **avant le premier achat** qu’il ne dispose que de trois indices précis.

Le bouton Loupe porte/intègre un indicateur visuel de quota, par exemple trois marqueurs qui s’éteignent progressivement.

Le panneau d’achat annonce explicitement :

- `Indice 1/3 · 15 🥣`
- `Indice 2/3 · 25 🥣`
- `Dernier indice · 40 🥣`

Après le troisième, la fonction précise reste visible mais désactivée/épuisée (`3/3 utilisés`). L’aide générale aux règles reste accessible séparément.

**Principe :** une seule loupe = une fonction ; les trois marqueurs = son quota. Ne pas multiplier les icônes de loupe.

---

# 9. Extreme Timed

**🔒** Extreme Timed fait partie du parcours principal et **n’est pas optionnel**.

- même grille/solution lors d’un retry ;
- chrono démarre au premier placement ;
- chrono suspendu quand l’app passe en arrière-plan ;
- chrono suspendu pendant la consultation de l’explication d’un indice ;
- trois erreurs **ou** fin du temps = échec ;
- retry gratuit.

**🧪** Durée initiale exacte et quantité de temps donnée par une continuation restent à calibrer. Une ancienne valeur de 6 minutes ne doit pas être considérée comme verrouillée.

**🧭** Une continuation rewarded-ad après timeout doit donner une quantité de temps significative/proportionnelle, pas un micro-bonus frustrant.

---

# 10. Économie

## 10.1 Architecture

**🔒 Deux monnaies seulement :**

### 🥣 Croquettes
Monnaie de gameplay/aide.

### 💎 Diamants
Monnaie premium de collection/personnalisation/prestige.

**🔒 Pas de conversion Diamants → Croquettes.**

Le joueur ne doit pas devoir choisir entre un objet qu’il aime et une aide nécessaire parce qu’il bloque.

## 10.2 Gains de croquettes

**🧪 Valeurs v1 à tester :**

- première réussite Easy : +5 🥣 ;
- Medium : +8 🥣 ;
- Hard : +12 🥣 ;
- Extreme : +15 🥣 ;
- Extreme Timed : +18 🥣 ;
- replay d’un niveau déjà récompensé : pas de récompense complète supplémentaire.

Les prix d’indices 15/25/40 sont actuellement la cible validée ; leur équilibre global avec les gains devra être observé en soft launch.

## 10.3 Diamants gratuits

**🔒** Maximum **3 missions quotidiennes**, chacune rapportant **1 💎**.

Maximum naturel par missions : **3 💎/jour**.

Les diamants gratuits doivent permettre à un joueur F2P patient d’obtenir du contenu premium, sans permettre de vider rapidement tout le catalogue.

## 10.4 Prix premium

**🧪 Ancrages v1, non verrouillés :**

- petit cosmétique : ~60 💎 ;
- cosmétique premium : ~120 💎 ;
- chat premium : ~180 💎 ;
- petit pack thématique : ~300 💎 ;
- grosse collection/thème : ~500 💎.

Les prix IAP réels, tailles de packs et valeur monétaire du diamant restent à calibrer.

---

# 11. Missions quotidiennes

**🔒** Maximum trois missions par jour, adaptées à la progression réelle du joueur.

Une mission ne peut jamais demander une difficulté que le joueur n’a pas encore atteinte. Elle doit aussi rester raisonnable au regard de ses capacités récentes.

Familles possibles :

- jeu normal / complétion ;
- maîtrise (ex. sans erreur) ;
- challenge adapté au niveau du joueur.

Chaque mission réussie = **1 💎**.

**🔒 Interdits :**

- mission demandant un achat ;
- mission demandant de dépenser des diamants/croquettes ;
- mission demandant de regarder une publicité ;
- mission artificiellement conçue pour consommer des indices.

Les missions doivent récompenser le fait de jouer, pas fabriquer une consommation forcée.

---

# 12. Daily Extreme mondial

## 12.1 Structure

**🔒**

- un puzzle **Extreme** par jour ;
- une seule tentative classée ;
- classement mondial ;
- classement d’abord par **nombre d’erreurs**, puis par **temps** ;
- puzzle/état compétitif contrôlé côté serveur ;
- le client ne peut pas simplement déclarer son score.

La tentative unique évite qu’un joueur mémorise la solution via plusieurs essais classés.

## 12.2 Récompenses quotidiennes normales

**🧪 Base v1 :**

- Top 5 % : **3 💎** + récompense croquettes ;
- Top 5–10 % : **2 💎** + récompense croquettes ;
- Top 10–15 % : **1 💎** + récompense croquettes ;
- autres réussites : consolation en croquettes ;
- participation/échec : petite récompense éventuelle.

Les montants exacts de croquettes et l’éligibilité précise de la récompense d’échec restent à calibrer.

Les lots sont **non cumulatifs** sauf décision future contraire.

## 12.3 Cat Day — samedi

**🔒** Le samedi est le rendez-vous hebdomadaire premium du Daily.

Même Daily Extreme, même tentative unique, mêmes tranches proportionnelles, mais récompenses nettement plus fortes :

- **Top 5 % : 10 💎 + chat rare de la semaine + Lot 1** ;
- **Top 5–10 % : 5 💎 + Lot 2** ;
- **Top 10–15 % : 3 💎 + Lot 3** ;
- reste : consolation/participation selon règles finales.

Le challenge est joué le **samedi**. Sa récompense est distribuée **dimanche à 00:01 UTC**.

Il existe **un seul événement de chat rare distinct par semaine**. Le dimanche n’est pas un second Cat Day.

Plusieurs joueurs du Top 5 % peuvent recevoir **le même chat rare hebdomadaire**. « Un chat par semaine » signifie un design/récompense distinct par semaine, pas une seule copie mondiale.

**🧪** Règle d’arrondi et seuil minimal de participants pour les très petites populations à définir. Le système ne doit jamais produire un classement absurde au lancement faute de participants.

---

# 13. Anti-cheat du Daily

**🔒** Le Human Solver est un **signal**, jamais le juge automatique unique.

Il peut produire une empreinte logique / ensemble de coups actuellement déductibles et comparer la séquence horodatée du joueur à des trajectoires plausibles.

Le système doit combiner :

- Daily autoritaire côté serveur ;
- état de tentative unique ;
- journal horodaté des placements ;
- contrôles de durée physiquement plausible ;
- score de cohérence Human Solver ;
- détection statistique d’anomalies ;
- validation/revue renforcée des résultats donnant droit aux récompenses importantes.

**🔒** Ne jamais invalider automatiquement un excellent joueur uniquement parce qu’il n’a pas suivi le chemin préféré du solveur.

Limite connue : un joueur peut apprendre la grille sur un second compte/appareil puis reproduire une solution plausible sur son compte principal. Le Human Solver ne peut pas prouver l’absence de ce comportement.

**💡** Des variantes équivalentes de Daily peuvent être étudiées, mais ne sont pas verrouillées : l’équité entre variantes est difficile.

---

# 14. Rewarded ads

## 14.1 Principe

**🔒** Aucune publicité automatique dans la vision initiale.

Les rewarded ads doivent apparaître à un moment où le joueur veut réellement sauver quelque chose.

## 14.2 Continuation

**🔒 Une seule continuation rewarded-ad par tentative, toutes causes confondues.**

Après troisième erreur :

- regarder une pub → récupérer une chance / réparer partiellement le cœur et conserver l’état courant ;
- ou retry gratuit.

Après timeout Extreme Timed :

- regarder une pub → obtenir du temps supplémentaire et conserver l’état courant ;
- ou retry gratuit.

Si la continuation a déjà été utilisée pour le cœur, elle n’est plus disponible pour le chrono sur cette tentative, et inversement.

L’indisponibilité d’une pub ne doit jamais empêcher le retry.

**🔒** Pas de vente de temps nécessaire pour franchir un niveau obligatoire.

## 14.3 Interdits v1

**🔒** Pas de :

- pub forcée après victoire ;
- interstitiel tous les X niveaux ;
- mission « regarde une pub » ;
- pub obligatoire pour récupérer une récompense ;
- produit « No Ads » tant que le jeu ne comporte pas de publicité imposée.

---

# 15. Collection de chats

## 15.1 Nimbus et Moka

**🔒 Noms conservés.**

### Nimbus
Gris/lilas. Calme, intelligent/réfléchi, légèrement perfectionniste.

### Moka
Orange. Chaleureux, enthousiaste, curieux/gourmand, légèrement maladroit/comique.

Le lore doit rester léger. Leur personnalité passe d’abord par leurs expressions, poses et animations.

## 15.2 Sources de chats

**🧭**

- chats de progression/milestones ;
- chats de récompense/événement/Cat Day ;
- récompenses aléatoires gagnées avec **aucun doublon** ;
- chats premium vendus directement.

**🔒 Pas de gacha aléatoire payé en argent réel.**

Le hasard peut être utilisé pour une récompense gagnée gratuitement/ticket obtenu en jouant, avec protection totale contre les doublons. Pour un achat réel/premium, le joueur doit savoir ce qu’il achète.

## 15.3 Les chats vivent dans l’arbre

**🧭** Un chat obtenu ne doit pas seulement remplir une fiche de collection. Il doit pouvoir devenir un **habitant visible de l’arbre** : hamac, coussin, branche, niche, panier, etc., avec quelques réactions/animations propres.

C’est un levier d’attachement majeur.

**🧪** Taille de collection, raretés, cadence de sortie et sources exactes restent à définir.

---

# 16. Personnalisation et cosmétiques

**🔒** La personnalisation reste centrée sur l’arbre principal. Pas de « maison des chats » séparée comme second méta-jeu.

Utiliser des **slots prédéfinis** afin de conserver une composition lisible : coussin, niche, hamac, jouet, plante, etc. Un nouvel objet remplace le contenu du slot plutôt que de s’empiler librement.

Catégories possibles :

- petits objets ;
- éléments structurants ;
- thèmes/ambiances complets.

Les cosmétiques n’affectent jamais la difficulté ni les récompenses.

Les récompenses gratuites de progression peuvent tirer un objet aléatoire dans une collection limitée **sans doublon**.

**🧪** Catalogue, prix, raretés et cadence restent à calibrer.

---

# 17. Milestones de progression

**🧭** Les croquettes seules ne suffisent pas à rendre la progression désirable. L’arbre doit annoncer des récompenses visuelles importantes à venir : objet, chat, cosmétique rare, etc.

Le joueur doit pouvoir voir une prochaine grosse récompense et penser : « encore quelques niveaux ».

**🧪** Fréquence et contenu exacts des milestones restent à définir.

---

# 18. Direction artistique et game feel

## 18.1 Ambition

**🔒** Mélange cible :

- kawaii félin ;
- chaleur cosy ;
- volumes tactiles/toy-like ;
- boutons gourmands/glossy mais lisibles ;
- accents colorés maîtrisés ;
- qualité de réaction et de polish inspirée des meilleurs casual mobiles.

La DA ne doit pas devenir une interface Phaser fonctionnelle décorée de quelques images. Les formes fonctionnelles elles-mêmes doivent participer à l’identité.

## 18.2 Grille

**🧭**

- cellules de type coussin / matière douce ;
- contours très lisibles ;
- symboles SAME/DIFFERENT immédiatement compréhensibles ;
- chats suffisamment simples pour rester lisibles sur petites cases.

## 18.3 Réactions

**🔒 Principe : calme pendant la réflexion, généreux lors de l’action.**

Exemples de cible :

- squash/bounce au placement ;
- relation satisfaite qui réagit ;
- vague légère sur une ligne correctement résolue ;
- confetti/réaction féline courte à la victoire ;
- nuages qui s’ouvrent pour révéler la suite ;
- mauvais placement rejeté + cœur qui prend un coup + chat triste.

Éviter les boucles décoratives permanentes inutiles qui chauffent le téléphone ou brouillent la lecture.

## 18.4 Assets

**🔒** Les planches/images de référence produites pendant la conception sont des **inspirations**, pas des assets à intégrer littéralement sauf validation explicite.

Nimbus/Moka doivent exister comme personnages expressifs au-delà de simples têtes : les têtes sont adaptées à la grille ; des versions full-body sont souhaitées pour home, victoire, réactions et arbre.

---

# 19. Home, règles et navigation

**🧭 Home cible :**

- logo Meowza illustré et mémorable ;
- Nimbus + Moka ;
- gros CTA Continuer ;
- contrôles secondaires discrets.

Le splash est un écran de démarrage bref et distinct du Home.

Les règles doivent être visuelles, rapides et fluides. Les cinq premiers niveaux enseignent progressivement les mécaniques en contexte ; une page règles reste accessible ensuite.

---

# 20. Mobile et performance

**🔒** Cible iOS + Android via Capacitor.

La sensation mobile est prioritaire : zones tactiles fiables, aucune réduction visuelle d’un bouton qui rend son hit area imprévisible, animations courtes, consommation GPU/CPU contrôlée.

L’arbre continu ne doit pas signifier que des centaines de modules restent actifs simultanément. **🧭 Virtualiser/activer uniquement la zone utile** si nécessaire.

Les performances doivent être validées sur de vrais appareils, notamment chauffe, FPS, mémoire et précision tactile.

---

# 21. Réalité du code auditée

Cette section décrit l’état observé de la branche `codex/kawaii-cat-tree-refonte` au moment de la création de cette Bible. Elle **ne remplace pas un nouvel audit** après modification du repository.

## 21.1 Ce qui existe réellement

- Phaser 3 + TypeScript + Vite + Capacitor.
- Puzzle binaire avec valeurs vide/gris/orange.
- Tailles 4×4, 6×6, 8×8.
- Validation équilibre / trois identiques / SAME / DIFFERENT.
- Solveur backtracking + comptage de solutions.
- `findHint` basique.
- Sauvegarde Capacitor Preferences.
- BoardView avec sprites de têtes de chats et UI principalement Phaser.Graphics.
- progression actuelle structurée en quatre chapitres séparés Easy/Medium/Hard/Extreme.
- LevelSelect actuel = un arbre vertical par chapitre avec plateformes générées et fond fixe.
- GameScene actuel = Undo, Hint, Reset ; erreurs affichées ; pas de chrono ; victoire avec étoiles.

## 21.2 Divergences majeures connues

**⚠️ CURRENT CODE GAP**

Le code actuel ne représente pas encore plusieurs décisions LOCKED/TARGET de cette Bible, notamment :

- arbre unique continu mélangeant les difficultés ;
- progression infinie hybride ;
- Human Solver complet ;
- onboarding 1–5 cible ;
- validation d’erreur contre solution cachée + 3 erreurs = défaite ;
- gros cœur à trois états ;
- suppression Undo/Reset ;
- limite visuelle 3 indices et économie 15/25/40 ;
- croquettes ;
- diamants ;
- missions quotidiennes ;
- Extreme Timed cible ;
- Daily mondial ;
- leaderboard/anti-cheat serveur ;
- rewarded continuation ;
- collection de chats ;
- personnalisation de l’arbre ;
- boutique/cosmétiques ;
- suppression des étoiles.

**Conclusion : ne jamais utiliser l’absence d’une fonctionnalité dans cette branche comme preuve qu’elle n’appartient pas au produit cible.**

---

# 22. Décisions explicitement abandonnées

**🗑️ SUPERSEDED — ne pas ressusciter sans demande explicite :**

1. quatre chapitres/arbre séparés par difficulté comme progression cible ;
2. biomes automatiques imposés par la progression ;
3. énergie ;
4. vies globales ;
5. système 1–3 étoiles ;
6. Undo ;
7. Reset / Tout effacer ;
8. Extreme rendu optionnel ;
9. gacha aléatoire payant ;
10. pagination artificielle de l’arbre tous les 50 niveaux ;
11. énorme banque fixe comme seule solution au contenu infini ;
12. génération aléatoire brute comme seule solution au contenu infini ;
13. README considéré comme source de vérité ;
14. conservation technique complexe des indices achetés entre retries ;
15. verrouillage temporaire d’une case après une erreur comme solution au sondage.

---

# 23. Paramètres encore ouverts

Ces points **ne doivent pas être inventés silencieusement par un agent** :

- calibration finale des gains de croquettes ;
- validation data des prix 15/25/40 ;
- prix définitifs en diamants ;
- packs IAP et prix en euros ;
- contenu exact des Lots Daily ;
- récompense consolation/participation exacte ;
- seuil/arrondi des classements lorsque la population est faible ;
- durée des Extreme Timed ;
- quantité de temps rewarded-ad ;
- raretés/nombre/cadence des chats ;
- cadence des milestones ;
- catalogue et prix des cosmétiques ;
- éventuels badges de performance remplaçant les étoiles ;
- paramètres exacts de difficulté du Human Solver ;
- mesures supplémentaires contre le sondage volontaire de la solution ;
- architecture backend exacte du Daily/leaderboard/anti-cheat.

Un agent peut **proposer** une valeur et argumenter. Il ne doit pas la présenter comme déjà validée.

---

# 24. Règles pour les agents IA

## 24.1 Hiérarchie des sources

Pour savoir **ce que fait le produit aujourd’hui** :

1. code réellement exécuté ;
2. données réellement chargées ;
3. tests ;
4. documentation/README/commentaires.

Pour savoir **ce que Meowza doit devenir** :

1. décisions LOCKED de cette Product Bible ;
2. décisions nouvelles explicites de Loïc ;
3. TARGET/TUNING de cette Bible ;
4. seulement ensuite anciens documents/conversations.

## 24.2 En cas de divergence

Toujours écrire explicitement :

> **Code actuel :** X  
> **Bible / cible :** Y  
> **Conclusion :** code en retard / documentation obsolète / décision non implémentée.

Ne jamais « réconcilier » silencieusement les deux.

## 24.3 Ne pas obéir aveuglément

Loïc attend de l’agent qu’il agisse comme responsable produit/projet et senior developer, pas comme exécutant passif.

Si une proposition :

- détériore la rétention ;
- crée une frustration artificielle ;
- fragilise l’économie ;
- augmente fortement la complexité pour un bénéfice marginal ;
- compromet le game feel ;
- met en danger la performance mobile ;
- ou contredit une décision LOCKED ;

**l’agent doit le signaler et défendre une meilleure solution avant de modifier structurellement le produit.**

Le principe directeur est de raisonner comme si une somme importante de capital personnel était réellement engagée dans le succès de Meowza : priorité au produit, au joueur, au risque et au retour sur complexité.

## 24.4 Modifications structurelles

Avant une modification importante de :

- monétisation ;
- progression bloquante ;
- économie ;
- suppression de contenu ;
- dépense de monnaie ;
- règles du puzzle ;
- difficulté ;
- Daily compétitif ;

présenter la conséquence produit et challenger la décision si nécessaire.

## 24.5 Pas de faux état d’implémentation

Ne jamais écrire « implémenté », « terminé », « publié » ou équivalent sans l’avoir vérifié dans la branche/révision concernée.

Les anciennes conversations contenant une affirmation d’un agent du type « j’ai intégré X » ne constituent **pas** une preuve d’implémentation.

---

# 25. Critères de réussite produit

Avant d’optimiser agressivement la monétisation, Meowza doit prouver :

1. qu’un joueur inconnu comprend le jeu sans explication externe ;
2. que la sélection tactile est fiable ;
3. que résoudre une grille est satisfaisant ;
4. que les règles et indices apprennent réellement à jouer ;
5. que le joueur veut spontanément lancer plusieurs niveaux ;
6. qu’une partie des joueurs revient le lendemain ;
7. que Hard/Extreme restent logiques et non arbitraires ;
8. que le téléphone ne chauffe pas anormalement ;
9. que l’arbre donne envie de progresser ;
10. que les chats créent de l’attachement.

À mesurer en particulier :

- abandon par niveau/difficulté ;
- erreurs ;
- consommation d’indices ;
- stock de croquettes/diamants dans le temps ;
- retour J1/J7 ;
- utilisation volontaire de l’erreur comme outil de sondage ;
- taux de retry ;
- taux de continuation rewarded-ad ;
- performance et chauffe par appareil.

---

# 26. Règle finale

> **La Bible protège la vision ; le code révèle la réalité.**

Lorsqu’ils divergent, ne jamais choisir arbitrairement l’un ou l’autre : identifier l’écart, puis amener l’implémentation vers la décision produit validée.

Meowza doit rester simple à comprendre, profond à maîtriser, généreux dans ses réactions, attachant par ses chats et discipliné dans sa monétisation.

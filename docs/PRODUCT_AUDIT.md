# Audit de compréhension — Meowza

2026-09-08. Lire avec IMPLEMENTATION_STATUS et la Bible fournie par Loïc. Les constats de code ci-dessous concernent la base avant P01.

## A — FAITS

### 1. Vision produit
Le repository exécute un puzzle félin local, solo, sans serveur ni publicité. Le niveau de succès commercial recherché n’est pas démontrable par le code. La Bible établit la cible : puzzle mobile félin immédiatement accessible, progression exigeante, identité mémorable et monétisation non bloquante. « Cosy » décrit l’ambiance, pas l’absence de défi.

### 2. Core loop
Home → tutoriel initial ou Continuer → grille → sélection gris/roux → placements/déductions → erreur ou indice éventuel → victoire et croquettes → prochain niveau direct ou arbre. Défaite → retry même grille ou arbre. Décorer intervient autour de cette boucle, sans influer sur la logique.

### 3. Règles exactes
Deux valeurs, cases données verrouillées, tailles paires 4/6/8. Moitié de chaque chat dans CHAQUE ligne et colonne ; jamais trois identiques consécutifs horizontalement ou verticalement, y compris la déduction chat-vide-chat. Cœur = identiques, griffes = différents entre voisins orthogonaux. Aucune règle de régions, de diagonales ou de lignes toutes distinctes. Une erreur est un écart à la solution unique, même si aucune règle visible n’est encore violée. Le solveur humain ne lit pas cette solution.

### 4. Quatre difficultés
Easy : 4×4, déductions directes, ratio minimal de données .75 au L1 puis .56. Medium : 4×4 avant L20 (.44), puis 6×6 (.56), direct seulement. Hard : 6×6 (.32), contradiction autorisée mais pas nécessairement requise. Extreme : 8×8 (.28), au moins une contradiction nécessaire dans l’ordre du solveur. Ratios = planchers de retrait, pas garanties de quantité exacte. Hypothèses profondeur 1, au plus 5 conséquences et 3 preuves au générateur actuel. Extreme Timed est une variante Extreme, pas une cinquième difficulté logique.

### 5. Progression
Un seul parcours `trail-N`, déblocage séquentiel, replay autorisé. 1–5 faciles ; 6–20 : 5E/9M/1H ; 21–50 : 2E/15M/7H/4X/2T ; 51–100 : 0E/10M/23H/12X/5T ; séquence de 50 répétée après 100. Premier Extreme 24, premier Timed 33, Medium après chacun des chronos. Génération seedée en Worker, grilles mises en cache dans sauvegarde. Banque historique de 110 niveaux distincte, bonus legacy conservés. Pas de chapitre par difficulté dans la navigation principale.

### 6. Arbre à chat
Carte principale et espace de personnalisation. Composition déterministe modulo 8, niches tous les 3 niveaux et hamacs tous les 4 (priorité niche). Sept rangées maximum actives, front de nuages, recentrage. Le code ne crée pas une vraie collection de chats habitants. Les raccords doivent être évalués dans une prévisualisation de cette branche : le site partagé provient d’une autre branche.

### 7. Croquettes et indices
Code initial : 60 de réserve ; récompense première réussite 5/8/12/15/18 ; replay 0 ; prix 20/35/50 puis 50 illimité ; indices achetés conservés par niveau après retry. Bible : 15/25/40, trois indices précis maximum par tentative, aucun report après retry, aide générale gratuite. Cet écart est une contradiction, pas une variante acceptable.

### 8. Erreurs, défaite, retry
Code : trois erreurs, rejet immédiat du mauvais placement, retry gratuit, grille fixe, placements réinitialisés, pas d’énergie/vies globales. Trois petits cœurs, Undo/Reset et retrait d’un chat correct existent encore. Bible : gros cœur fissuré puis brisé, Undo/Reset supprimés, indices remis à zéro. Code Timed : 360 s, première interaction de placement, pause des scènes d’aide, pause arrière-plan, temps sauvegardé ; aide +50 % après trois échecs. Cette dernière règle historique n’est pas verrouillée par la Bible.

### 9. Future monétisation
Pas d’intégration réelle. Cible Bible : continuation volontaire unique cœur OU temps, retry gratuit, aucun interstitiel ou No Ads fictif ; achats directs connus via diamants, aucun gacha payant. Daily et Cat Day requièrent une véritable autorité serveur ; une sauvegarde locale ne peut pas la remplacer.

### 10. Cosmétiques et premium
Code : neuf variations de fond/coussin/bois, trois initiales, six gratuites tous les dix nouveaux niveaux, sans doublon ; essentiellement teintes. Cible : objets reconnaissables sur slots, thèmes et habitants visibles ; diamants séparés des croquettes, missions 3 maximum ×1 diamant ; catalogue/prix finaux non définis. Aucune conversion diamant → croquettes.

### 11. Architecture
TypeScript strict, Phaser 3, Vite, Capacitor 7, Preferences, Haptics, App ; Nunito embarquée ; Web Audio synthétique. `core` pur, `services` sauvegarde/Worker/audio/haptique, `game` scènes et BoardView. `SaveService` singleton et `GameRegistry` globaux ; pas de framework web Vue/Laravel, pas d’API ni authentification. Web statique GitHub Pages, projets Android/iOS, CI qualité et smoke natif. Un build natif ne démontre ni le confort tactile ni une signature de distribution.

### 12. Pipeline graphique
Images générées, dérivés PNG/WebP. Huit images préchargées : logo, modules, pièce, nuages, duo Home, atlas v3 et deux têtes. Découpes d’atlas codées en dur dans PreloadScene ; positions et tints codés dans les scènes. UI/grille/liens/raccords en Graphics. Documents de provenance existent mais manifest et README assets obsolètes. Pas de pipeline reproductible complet d’import/validation d’atlas dans les scripts suivis. Les grandes références historiques restent distribuées sous public mais ne sont pas chargées par Preload.

### 13–14. DA et chats
Les fichiers montrent un logo jaune gourmand, une pièce chaude, des matières bois/tissu, deux têtes expressives et un duo full-body. La Bible exige crème/lavande/pêche, volume doux et réactivité, personnalité Nimbus calme et Moka gourmand/comique. Ce sont des cibles explicites, pas des qualités automatiquement acquises par les images actuelles. Le code dispose principalement de poses statiques, pas d’un vocabulaire émotionnel complet.

### 15. Validé à préserver
Les décisions LOCKED de la Bible font autorité : puzzle binaire, Human Solver distinct, noms/familles, progression unique, retry sans attente, solution cachée pour erreurs, trois erreurs, suppression étoiles/Undo/Reset, quota/prix indices, pas de report entre retries, Extreme Timed obligatoire, deux monnaies sans conversion, missions non coercitives, rewarded volontaire unique, collection sans doublon/gacha payé, personnalisation de l’arbre, Daily serveur avec classement erreurs puis temps et Cat Day samedi. Une absence dans le code ne révoque aucune de ces décisions. Les chiffres TUNING ne sont pas des résultats de playtest.

## B — DÉDUCTIONS

- L’arbre doit matérialiser à la fois la maîtrise et l’attachement. Sinon la collection restera un menu secondaire sans force émotionnelle.
- Le défaut visuel est principalement l’intégration : systèmes de proportions et de matières hétérogènes, pas seulement manque d’images.
- La simplicité cible suppose que le joueur distingue trois chances, trois indices et deux monnaies sans devoir lire un manuel.
- La collection et le Daily sont des moteurs possibles de retour ; leur effet sur J1/J7 n’est pas établi.
- Le solveur garantit une possibilité de raisonnement dans ses règles, pas le temps humain ou le plaisir réel.
- L’évaluation commerciale reste inconnue : aucune cohorte, coût d’acquisition, conversion ou revenu n’est constaté dans le repository.

## C — QUESTIONS / ZONES D’OMBRE

À décider avant le bloc concerné, pas un questionnaire bloquant le solo :

1. Daily : indices, continuation publicitaire et pause autorisés ou interdits ? Qu’est-ce qui compte comme temps classé ? Échec classé ou non ?
2. Identité/serveur : comptes, invités, récupération, budget hébergement, responsable d’exploitation, suppression de compte et fuseau de changement des missions ?
3. Cat Day : arrondis/petite population, critères des lots, gestion d’un chat hebdomadaire déjà possédé, fraude/revue et délais de recours ?
4. Timed : conserver l’aide gratuite +50% après trois échecs ? Proposition : la conserver provisoirement sans la proclamer règle Bible, mesurer les blocages.
5. Quota de trois indices et solde nul : quels résultats de playtest déclencheraient une révision ? Aucune modification du quota/prix sans accord.
6. Collection : catalogue initial, cadence, slots d’habitants, raretés, doublons quand toute la collection est acquise ?
7. Milestones : contenu/cadence définitifs ; l’actuel « tous les 10 » n’est pas une décision finale Bible.
8. Mise à jour : que communiquer pour les anciens indices payés supprimés par la nouvelle règle ? Pas de remboursement inventé ; conserver les soldes et expliquer le changement.
9. Cible de lancement : âge/public/langues/pays, appareils de référence, responsables des tests externes, seuils de sortie ?
10. DA : la direction peut être exécutée sans discuter chaque padding ; validation esthétique reste requise sur une composition cohérente avant production de toute une collection.

## Diagnostic et objections

Les cinq faiblesses prioritaires sont : contrat de tentative divergent ; onboarding encore séparé du raisonnement en contexte ; intégration graphique et émotionnelle insuffisante ; tests mobiles/playtests absents ; mémoire documentaire contradictoire et systèmes de collection/compétition encore inexistants.

À conserver : solveurs séparés, règles, génération seedée, Worker, cache stable, parcours unique virtualisé, sauvegarde locale et économie de première réussite.

À challenger sans changer la Bible : (1) trois indices maximum + chrono obligatoire peuvent cumuler deux blocages ; mesurer avant toute révision ; (2) chat rare limité au Top 5% peut récompenser toujours les mêmes joueurs ; comparer participation répétée et concentration des gagnants ; (3) signal Human Solver ne prouve pas la fraude, donc pas de sanction automatique ; (4) catalogue hebdomadaire a un coût de production artistique, à cadrer avant Cat Day. Alternatives et décisions dans DECISION_LOG.

Roadmap exhaustive : IMPLEMENTATION_ROADMAP. Premier bloc : P01, indices de tentative, avant refonte graphique ou backend.

# Meowza — fondations visuelles et motion

2026-09-08. Ce document distingue observations et cibles. Il ne certifie pas l’esthétique existante. Référence d’intention : Bible §15/18–20 ; les principes Meowdoku sont fournis par Loïc, pas présentés comme un benchmark externe réalisé.

## Langage commun cible

Chaleur crème, gris/lilas Nimbus, roux/pêche Moka, accents menthe contrôlés. Matières douces, volume de jouet, silhouettes simples, lumière cohérente. Calme au repos, réactions brèves aux actions. Les têtes servent la grille ; les corps et poses servent la personnalité. Aucune accumulation décorative ni biome imposé.

## Tokens et composants

| Sujet | Constat code | Fondation cible / validation |
|---|---|---|
| Palette | crème #fff6ee, panneau #fffaf5, texte #51425f, teal #1cafaa, orange #f49a42, `pink` en réalité violet #a552db | Un accent d’action dominant par écran ; ne pas figer les noms trompeurs en système final |
| Typographie | Nunito 700/800 locale ; `label` force au moins 34 unités sauf override | Hiérarchie titre/action/aide ; mesure en taille réellement affichée, pas seulement unités canvas |
| Espace | 1080×1920 FIT, nombreuses coordonnées fixes | Rythme proposé de 8 unités CSS équivalentes, à éprouver ; marge sûre et respiration prioritaires |
| Rayons | boutons 38, panneaux 46, cellules 18 unités | Famille de rayons selon échelle, sans multiplication de cadres |
| Ombres | ombres décalées fortes sur CTA, claires sur panneaux | Une direction de lumière ; profondeur subtile ; pressed ne change jamais la hit area |
| CTA | Graphics, alpha .88 au press, hit height 116 | Idle/pressed/disabled/selected explicites ; taille cible proposée ≥44 pixels CSS effectifs sur appareils, à valider |
| Cartes/panneaux | rectangle arrondi à bord blanc | Une carte par décision ; règles courtes, coût/quota lisibles avant paiement |
| HUD | trois petits cœurs, croquettes texte | Cœur unique quatre états, monnaie distincte de la loupe, indicateur trois usages attaché à une seule loupe |
| Grille | cadre bois uni, cases pastel et cadenas | Cases coussin ; silhouette chat et relations lisibles à 8×8 ; aucune décoration sur zone utile |
| Icônes | relations vectorielles, loupe Graphics, chrono/glyphes divers | Icônes cohérentes sans dépendance emoji ; symboles exacts et sens distincts |

Les valeurs cibles nouvelles ci-dessus sont propositions d’exécution réversibles, pas nouveaux chiffres d’économie ou décisions produit verrouillées.

## États d’interaction

- Idle : information claire sans mouvement permanent.
- Pressed : réponse immédiate, légère ombre/teinte ; hit area inchangée ; petit glissement ne doit pas annuler un toucher légitime.
- Disabled : contraste restant lisible et explication ; ne pas dissimuler quota épuisé ou solde insuffisant.
- Selected : contour/forme en plus de la couleur, gris/roux distingués par expression.
- Attention : uniquement prochaine action utile, jamais pulsation permanente généralisée.
- Modale : bloque les interactions sous-jacentes, reprend exactement la partie à fermeture.

## Motion existant et cible

| Action | Code actuel | Cible |
|---|---|---|
| Placement | scale .65 → 1 en 230 ms Back.Out | Settle doux, non bloquant ; vérifier 20 placements rapides |
| Lien satisfait | scale 1.25, 150 ms yoyo | Une réaction courte, pas de bruit continu |
| Ligne remplie | alpha .55, 160 ms, retard 55 ms/case | Vague discrète et non répétée inutilement |
| Erreur | cellule rose 220 ms | Rejet visible → dommage cœur → réaction chat, aucune sanction visuelle agressive |
| Victoire | 650 ms particules, float fini 1600 ms répété une fois | Petit climax puis prochaine grille immédiate ; sans étoiles |
| Entrée | fade 220 ms seulement certaines scènes | Continuité Home/arbre/grille/aide/résultat ; ne pas ralentir pour montrer l’animation |
| Arbre | inertie amortie, aucun habitant animé | Réactions contextuelles, scène calme au repos ; nuages révèlent l’avancée |

Réduction des animations : états finaux immédiatement lisibles ; aucun délai de gameplay nécessaire pour une animation. Interrompre/nettoyer les tweens et listeners à la sortie. Budgets nouveaux à mesurer sur téléphone, pas à deviner.

## Audit des images runtime

Tailles/poids lus sur fichiers ; classement = recommandation de travail, pas suppression effectuée. Inspection fichier isolé ne vaut pas validation de composition.

| Asset | Dimensions / octets | Utilisation constatée | Classement et raison |
|---|---|---|---|
| logo-v5.webp | 1100×441 / 76856 | Home 930×370 max, en-tête 330×130, startup HTML, iOS dérivé | KEEP/POLISH : mot lisible, volume gourmand ; cohérence palette à arbitrer avec ensemble |
| room-v5.webp | 800×1421 / 84024 | Fond commun étiré 1080×1920, teintes globales, voile .77 sur puzzle/aide/règles | POLISH : centre calme, périphérie réaliste détaillée ; lien stylistique avec UI à travailler |
| tree-modules-v5.webp | 1254² / 205986 | 6 découpes fixes Preload ; plateforme max 440×270, post forcé 96×460 | POLISH : matières cohérentes dans la planche ; pivots manuels ; raccords à valider sur cette branche |
| cloud-v5.webp | 1100×367 / 31966 | Front unique 1050×350 max | KEEP/POLISH : silhouette douce ; taille/profondeur à harmoniser dans arbre |
| home-mascots-v4.webp | 850² / 137570 | Home 850×790 max | POLISH : duo expressif mais seule pose, proportions grandes ; pas déclinable en réactions séparées |
| cats/nimbus.webp | 512² / 44508 | Grille/sélecteurs/Rules/victoire/défaite | KEEP/POLISH : gris-lilas yeux fermés lisible ; manque de pose triste/réfléchie |
| cats/moka.webp | 512² / 51200 | Grille/sélecteurs/Rules/victoire/indice | KEEP/POLISH : roux yeux ouverts ; personnalité comique non animée |
| atlas-v3.webp | 1254² / 236242 | Têtes difficulté, modules inférieurs encore découpés mais non utilisés par arbre v5 | POLISH : Hard sourcils sévères, Extreme plus menaçant que malicieux ; éviter nouvelle génération sans validation d’expression |

Environ 868 ko de fichiers pour les huit images préchargées (hors police et moteur). La taille compressée ne mesure pas la mémoire des textures GPU. Points de raccord à documenter pour chaque module avant nouvelle planche : pivot, zone alpha utile, emplacement post/plateforme, échelle de matière, marge de texture, éclairage.

## Assets historiques et primitives

- `backgrounds/{cat-tree,cuisine,jardin,salon,home-v3}.webp`, `home-cozy.png` : non chargés ; REMOVE du runtime cible mais ne pas effacer les références/historique sans raison. Biomes automatiques abandonnés.
- `branding/meowza-logo.png`, `cats/{grey,orange}-{small,board}.png`, `board/board-frame-blue.png`, `rules/{same,different}-circle.png`, `fx/celebration-fx.png` : non chargés ; pas candidats automatiques à réintégration. Petites dimensions de certains assets insuffisantes pour agrandissement mobile.
- UI boutons/panneaux/nodes : REPLACE/POLISH via composants maîtrisés ; primitifs exacts autorisés, pas nouvelle image pour chaque rectangle.
- Grille/liens : POLISH ; garder précision et adaptabilité des symboles, revoir matière et hiérarchie.
- Cœurs HUD : REPLACE par cœur expressif, sans confondre avec relation SAME.
- Raccords bois Graphics : POLISH avec points d’ancrage ; le matériau ne peut pas changer brutalement au raccord.
- Icônes natives/splash : dérivés existants ; masques/échelles iOS/Android non validés sur appareil. Ne pas déclarer KEEP final avant recette.

## Pipeline à rendre reproductible (P04–P06)

Brief par asset et rôle → validation composition de référence → création bitmap dédiée si utile → alpha/cadrage → atlas métadonnées/pivots → encodage → intégration à échelle réelle → capture sur formats cibles → performance/mobile. Aucune planche d’inspiration utilisée comme écran complet. Documentation de provenance mise à jour avec les fichiers effectivement chargés ; sources historiques séparées du runtime actif.

## Recette visuelle obligatoire

Home, arbre L1/milieu/lointain, décoration, grilles 4/6/8, achat indice 1/2/dernier/épuisé/insuffisant, explication, cœur quatre états, victoire, défaite, reprise. Pour chaque état : lisibilité, contraste, alignements, zones tactiles, absence de chevauchement, cohérence sans animation, reducedMotion. Appareils et taille écran réels consignés ; pas de feu vert commercial depuis une capture desktop.

## Limite de l’inspection du 2026-09-08

La page GitHub Pages actuellement visible provient de `kawaii-cat-tree-refonte-v3`, pas de la branche auditée. Son Home, son arbre et sa grille ont été vus ; aucune conclusion de conformité de nos scènes n’en est tirée. Les huit images runtime ont été inspectées directement sur disque. P01 nécessite encore une recette visuelle de son propre build ; la prévisualisation locale est refusée par le navigateur cloud.

# Meowza — état d’implémentation

Audit initial : 2026-09-08. Branche unique de travail : `codex/kawaii-cat-tree`.
Copie locale initiale : `38f46c2ec9df8b6f4cd68ec4294eac153c9ba6cb`.
Tête GitHub vérifiée : `ab6accaafcbc467a921f5389055b6d046b9d7b1c`.
Comparaison des blobs : tous les fichiers `src`, scripts et assets suivis localement sont identiques à cette tête distante. Différences hors source : README, fin de fichier du workflow Pages et fichiers générés Capacitor présents seulement sur GitHub. Aucun écrasement de ces fichiers prévu.

Référence produit : [Bible](MEOWZA_PRODUCT_BIBLE.md). Sa section 21 décrit une autre branche (`codex/kawaii-cat-tree-refonte`) et ne décrit PAS cette implémentation. Les sections produit restent la cible. Les anciens README, manifest d’assets et notes v1–v5 sont historiques, pas normatifs.

## Méthode et limites

Lecture des modules core, scènes, services, tests, scripts, configurations web/natives, workflows, documentation et inventaire des assets. Inspection visuelle des huit images réellement préchargées. Home/arbre/grille observés sur le site partagé, mais ce site sert une AUTRE branche (voir ci-dessous) : ces captures ne valident pas notre code. Les fichiers natifs générés ne sont pas assimilés à un backend. Aucun historique de conversation ne sert de preuve de test.

Base exécutée : TypeScript OK ; 25 tests OK ; 110 niveaux historiques validés (dimensions, règles, unicité). Les tests couvrent les 100 premiers niveaux générés, mais PAS une mesure de difficulté humaine. Aucun téléphone physique testé. Le navigateur cloud refuse l’adresse locale ; l’inspection du site ne constitue pas une recette de cette branche.

Légende : ✅ conforme et vérifié pour le périmètre ; 🟡 partiel / non validé ; ❌ contraire à la cible ; 🔴 absent ; ⏸ dépendance externe. « Tests présents » ne signifie pas conformité de la règle testée. UX/visuel/mobile inconnus ne deviennent jamais verts par déduction.

## Matrice Bible ↔ code initial

| Système / Bible | Code constaté | Tests | UX | Visuel | Mobile | Statut / bloc |
|---|---|---|---|---|---|---|
| Puzzle binaire, 50/50, jamais trois, SAME/DIFFERENT (§2) | `model`, `rules`, `validator`; relations adjacentes ; aucune règle d’unicité des lignes | Core + banque | Lisibilité à éprouver | Symboles vectoriels | Non testé | 🟡 P02/P04 |
| Solution unique (§2/5) | Backtracking et comptage ; retrait de données sous preuve humaine | Banque + échantillons parcours | N/A | N/A | N/A | ✅ sur échantillons, pas tout futur niveau |
| Human Solver distinct (§3) | Ne lit pas solution ; règles directes puis contradiction ; profondeur 1, chaîne ≤5, ≤3 contradictions au générateur | Human solver + 100 grilles | Preuves textuelles paginées | Sources de preuve non surlignées dans la grille | Non testé | 🟡 P03/P04 |
| Difficultés (§4) | Easy 4×4 ; Medium 4×4 avant 20 puis 6×6 ; Hard 6×6 ; Extreme 8×8. Timed = Extreme + attribut, pas cinquième solveur | Séquences et solvabilité | Hard n’exige pas une hypothèse, Extreme oui | Têtes atlas pour difficulté | Non testé | 🟡 P03 |
| Onboarding L1–5 (§4) | Contraintes graduées et phrase par niveau ; écran Rules de 4 cartes avant premier jeu ; L1 pas réellement guidé | Présence des relations | Expose toutes règles avant apprentissage progressif | Mini-exemples séparés | Non testé | ❌/🟡 P03 |
| Arbre continu (§5) | Un parcours, 7 rangées max ; inertie, molette, recentrage ; pas de pagination | Positions jusqu’à 1 million | Scroll accessible | Raccords/pivots manuels ; proportions non validées sur cette révision | Non testé | 🟡 P05 |
| Contenu hybride (§5) | Séquences et seeds contrôlées ; onboarding généré, pas banque éditoriale de milestones | Déterminisme + 100 grilles | Effort humain non mesuré | N/A | Génération non mesurée | 🟡 P03/P05 |
| Retry et erreur (§6) | Solution cachée vérifiée ; erreur rejetée ; 3 = Lost ; retry gratuit même grille | Persistance échec testée ; BoardView non couvert directement | Suppression manuelle d’un chat correct encore possible | Erreur = couleur cellule ; chat triste absent | Non testé | 🟡 P02 |
| Cœur unique (§6.3) | Trois petits cœurs dessinés dans GameScene | Aucun | Contradiction explicite | Aucun état fissuré/brisé | Non testé | ❌ P04 |
| Undo/Reset supprimés (§7) | Boutons et historique toujours actifs | Pas de test UI | Contradiction explicite | Occupent le pied de grille | Non testé | ❌ P02 |
| Indices 3 max, 15/25/40 (§8) | 20/35/50 puis illimités à 50 ; possession par niveau entre retries | Ancien comportement testé ! | Pas de quota, prix avant achat | Loupe unique | Non testé | ❌ P01 |
| Aide générale gratuite (§8) | Rules accessible ; pas de technique contextuelle dédiée | Aucun | Sans débit, mais loin de la grille | Cartes illustrées | Non testé | 🟡 P04 |
| Timed obligatoire (§9) | Premier au 33 ; 360 s ; premier essai déclenche ; pause scène/aide et arrière-plan ; échec sauvegardé | Données et sauvegarde, pas cycle natif | Briefing ; +50% offert après 3 échecs (ancien arbitrage absent de Bible) | Symbole chrono texte | Non testé | 🟡 P02/P03 |
| Croquettes (§10) | 60 initial ; 5/8/12/15/18 une fois par niveau ; écritures sérialisées | Économie et replay | Solde texte | Pas de portefeuille graphique final | Non testé | 🟡 P08 |
| Diamants et séparation (§10) | Aucun champ, transaction ou conversion | Aucun | Absent | Absent | N/A | 🔴 P09 |
| Missions (§11) | Absentes | Aucun | Absentes | Absentes | N/A | 🔴 P09 |
| Daily / classement (§12) | Ni identité, ni API, ni backend, ni tentative classée | Aucun | Absent | Absent | N/A | ⏸ P13/P14 |
| Cat Day (§12.3) | Absent ; samedi, distribution dimanche 00:01 UTC uniquement dans cible | Aucun | Absent | Absent | N/A | ⏸ P15 |
| Anti-cheat (§13) | Aucun journal de placements ni autorité serveur | Aucun | N/A | N/A | N/A | ⏸ P14 |
| Rewarded (§14) | Aucun SDK ni provider ; Lost ne propose que retry gratuit et aide temporelle | Aucun | Aucune fausse pub | Absent | N/A | 🔴 puis ⏸ P12 |
| Chats collection/habitants (§15) | Nimbus/Moka noms, images statiques ; aucune collection | Aucun | Personnalités peu exprimées | Une pose duo et deux têtes, pas d’états émotionnels | Non testé | 🔴/🟡 P06/P10 |
| Cosmétiques (§16) | 3 slots globaux (fond/coussin/bois), 9 choix dont 3 initiaux ; tints ; tous les 10 niveaux sans doublon jusqu’à 60 | Déblocages sans doublon | Panneau sur arbre ; promesse infinie alors que pool fini | Teintes plutôt qu’objets distinctifs | Non testé | 🟡 P10 |
| Milestones (§17) | Pas de prochaine grosse récompense annoncée dans parcours | Aucun | Manque | Manque | N/A | 🔴 P05/P10 |
| DA / motion (§18) | Raster généré + Graphics ; bounce 230 ms, liens 150 ms, ligne 160 ms décalée, particules finies | Aucun visuel | Transition variable par scène | Styles hétérogènes | Non testé | 🟡 P04/P05/P06 |
| Home/splash (§19) | Logo image HTML et Home ; texte Preload sous overlay ; Continuer et arbre | Manuel Home | Hiérarchie existe | Grand duo et pièce détaillée, boutons génériques | Non testé | 🟡 P06 |
| Mobile (§20) | Phaser FIT 1080×1920 ; 30 fps ; sleep background ; Haptics ; Capacitor iOS/Android | Workflows de construction présents | Retour matériel codé | Zones sûres CSS | Aucun appareil | 🟡 P07/P16 |
| Étoiles abandonnées (§22) | Calcul GameScene, Victory, Archive et SaveService | Tests legacy | Toujours visible à victoire | Étoiles présentes | N/A | ❌ P02 |
| Mesure (§25) | Totaux victoire seulement ; pas événements tentative/abandon/probing | Aucun | Playtest non réalisé | N/A | Non testé | 🔴 P07/P08 |
| Boutique (§10/14/16) | ShopScene masquée, texte comptoir croquettes ; aucun produit ni paiement | Aucun | Pas boutique premium | Aucun catalogue | N/A | 🔴 P11 |

## Risques techniques précis, non confondus avec bugs reproduits

- `SaveService.load` retombe sur les valeurs initiales en cas de lecture invalide ; ce n’est pas une récupération robuste de sauvegarde corrompue.
- `GameScene` orchestre validation, économie, chrono et navigation ; les invariants ne sont pas tous imposés hors UI.
- `ArchiveScene` est enregistrée mais sans entrée depuis les écrans actuels ; conservation des données ne signifie pas accessibilité réelle.
- Le chrono sauvegarde la totalité de la sauvegarde chaque seconde ; le cache des niveaux croît sans éviction. Virtualisation graphique ≠ stockage borné.
- Les coordonnées de Hit Area sont en unités 1080×1920. Un bouton de 116 unités fait environ 39 pixels CSS sur un écran de 360 px de large, moins si FIT est contraint par la hauteur. Fiabilité à vérifier sur appareil.
- `BoardView.paintErrors` repeint toutes les cellules à chaque changement ; le solveur d’indice tourne sur le thread principal. Coût réel non mesuré.
- Pages publie après build, indépendamment du workflow Quality ; un test rouge n’empêche pas actuellement ce déploiement. Le workflow natif ignore les modifications uniquement sous `public/assets`.
- Répartition 21–50 arrondie : 2/15/7/4/2, soit 6,7/50/23,3/13,3/6,7 %. Cible non réalisable exactement sur 30 cases ; arrondi existant à conserver tant que non revalidé.

## Suivi du premier bloc

P01 : implémentation locale réalisée (quota service, prix, UI, migration et tests). 30 tests passent, TypeScript OK, banque de 110 grilles validée et build Vite réussi ; visuel de cette révision et téléphone NON VALIDÉS. Les autres écarts restent explicitement ouverts ; aucun statut commercial validé.

## Conflit de publication constaté

L’API GitHub Actions retourne le run Pages `34210957669`, réussi, branche `kawaii-cat-tree-refonte-v3`, commit `fc29d69b4454a3e0a486f011bc58cb1a19d47076`. Le JavaScript servi par Pages est `index-BMDAVdau.js`. Après rechargement, la grille publiée affiche un cœur unique et pas Undo/Reset : ce n’est pas la source auditée sur `codex/kawaii-cat-tree`.

Le workflow de notre branche publierait lui aussi sur le même site à chaque push. Aucun push n’est effectué pour éviter de remplacer la version de l’autre branche. Travail conservé localement sur la branche demandée. Il faut clarifier la branche destinée à piloter Pages, ou disposer d’une prévisualisation isolée, avant une recette publiée de P01. Ne pas importer silencieusement le code de l’autre branche.

### Delta P01 par rapport à la matrice initiale

| Système | Code local après P01 | Tests | UX | Visuel | Mobile | Statut |
|---|---|---|---|---|---|---|
| Prix/quota | 15/25/40 puis refus hors UI | Quatrième achat, double appel et insuffisance couverts | Annonce et marqueurs codés | Non inspecté sur ce build | Non testé | 🟡 |
| Retry indices | Seule session active porte les preuves ; retry/fin les effacent | Retry/reload/changement niveau couverts | Texte Lost actualisé | Non inspecté | Non testé | 🟡 |
| Migration | Ancienne bibliothèque retirée ; solde/grille/victoires conservés ; compteur actif plafonné à trois | Migration et reprise couverts | Note migration codée | Non inspecté | Non testé | 🟡 |

P01 n’a modifié ni les gains, ni les difficultés, ni le cœur, ni les étoiles, ni les commandes Undo/Reset. Ils restent affectés à leurs blocs propres. Aucun build natif nouveau exécuté ou déploiement revendiqué.

### Recette P01 à terminer sur sa propre version

1. Acheter un premier indice : prix 15 annoncé, quota 1/3, un seul débit même en double toucher.
2. Revenir sans placement automatique puis relire : même tentative, pas de deuxième débit ; fermer/rouvrir l’app conserve cette tentative.
3. Avec au moins 80 croquettes gagnées, acheter trois déductions différentes : 15,25,40 ; 3/3 visible, loupe précise désactivée, règles gratuites accessibles.
4. Perdre puis recommencer : même grille initiale, quota 0/3 et prix 15 ; aucune explication précédente offerte ; solde restant préservé.
5. Tester solde inférieur au prix, migration d’une ancienne session et niveau Timed (pause aide puis reprise).
6. Vérifier sur petit iPhone/Android texte, trois marqueurs, cœurs encore anciens dans ce bloc, absence de chevauchement et précision tactile. Consigner appareil/OS et résultat ; ne pas tester par erreur la branche `-refonte-v3` comme preuve de P01.

## Mise à jour hébergement

Loïc a créé https://meowza-473953555.netlify.app/ pour cette branche. D008 remplace la suspension D007 : le workflow Pages est retiré uniquement ici et netlify.toml fixe Node 22 / npm run check / dist. Le site s’ouvre ; la présence du nouveau code P01 doit être vérifiée après push. Les anciennes observations du site Pages ne valident toujours pas cette version.

## Recette Netlify — commit 6c669964958b8ca55cd9d84fc4e7b5ea2981e17e

- Publication de cette branche vérifiée sur https://meowza-473953555.netlify.app/ ; le code du quota et du prix 15 est effectivement servi.
- Workflow Pages absent de cette branche ; GitHub n’a déclenché que Quality et Native smoke build. L’autre branche reste indépendante.
- Quality réussie (run 34218308178) ; Android Debug et iOS Simulator réussis (run 34218308276). Ces builds ne sont pas des tests physiques.
- Recette navigateur de cette version : Home, arbre et grille ; quota 0/3 et marqueurs ; confirmation 1/3 à 15 avec plafond annoncé ; achat 60→45 et compteur 1/3 ; relecture directe sans nouveau débit ; trois erreurs et défaite ; retry gratuit, même grille, trois cœurs restaurés, quota 0/3, solde 45 ; ancien indice non conservé, confirmation à 15 à nouveau.
- Rendu de ces états inspecté sans chevauchement bloquant. Il s’agit d’un contrôle fonctionnel desktop ; la qualité artistique complète n’est pas validée.
- Restent à inspecter visuellement : états 2/3, dernier indice/épuisé, fonds insuffisants, migration, interruption et Timed. Ces contrats logiques sont couverts par tests lorsqu’indiqué, pas tous par cette recette manuelle.
- Statut P01 : implémenté et publié ; recette web partielle ; EN ATTENTE VALIDATION MOBILE. Aucun feu vert commercial.
- Prochain bloc : terminer la recette P01 (états restants puis téléphone), avant d’ouvrir P02.

## Delta P02 — 2026-09-08

- Validation des placements extraite dans core/attempt.ts : mauvais chat rejeté, troisième erreur terminale, chat accepté non effaçable.
- Undo/Reset et étoiles de victoire/archives retirés. Ancienne progression conservée.
- Home reprend la session active depuis le cache ou la banque historique.
- Victoire protégée contre doubles callbacks ; état terminal protégé contre reprise d'une scène.
- Cœur unique fissuré/endommagé/brisé et transition défaite ajoutés. Réaction triste illustrée encore absente.
- Tests de contrat de placement et de double récompense ajoutés. Recette web et compilation de ce delta à consigner après publication.

Statut : implémentation partielle P02/P04 ; pas de validation mobile ni de certification commerciale. P03–P16 restent ouverts selon la roadmap.

## Vérification P02 et première passe des résultats — 2026-09-08

Source gameplay publiée : f21bd5888c8c4cfbed2adabcef5df429d2e4ccbb. 33 tests passent ; 110 grilles de la banque validées ; build web réussi. CI verify, Android debug et iOS simulateur réussis sur cette source.

Source graphique : 5ed1bfbd76a7a03034e9a4e19c5697b25d471769. Illustration retry-v6 chargée et inspectée sur Netlify : carte lisible, personnages déçus/rassurants, action gratuite dominante, aucune publicité simulée. Première correction du socle inspectée puis ajustée pour poser le poteau sur la base et décaler le texte hors du poteau.

Recette web observée : placement correct accepté ; second toucher sans effacement ; rechargement → Continuer → même placement conservé ; première puis deuxième fissure ; troisième erreur → défaite ; retry → grille initiale, cœur intact, quota 0/3, portefeuille conservé à 45 croquettes.

Les anciennes sections ci-dessus sont historiques. L'illustration triste n'est plus absente. Restent : réactions en cours de grille, calibration/onboarding, finition globale arbre/collection, missions/diamants, boutique réelle/rewarded, backend Daily/Cat Day, appareils physiques et validation commerciale. Ce lot n'est pas une version finale commerciale.

Recette complémentaire : nouvelle défaite illustrée vue sur Netlify, bouton Recommencer gratuit fonctionnel ; victoire au niveau 1 sans étoiles, gain +5 (45 → 50 croquettes), puis lancement du niveau 2.

Dernier lot source : 86c0f8b286a5158626be315fc08eb21582d079ab. Les modifications des assets, dépendances et configurations déclenchent désormais aussi les compilations natives. Builds debug/simulateur seulement : aucun binaire store signé ni test sur appareil n'est revendiqué.

## P03 — Première implémentation pédagogique

Ajout du module core/onboarding.ts et de ses tests : ordre pédagogique, prémisses visibles, absence de lecture de solution, reprise et indépendance à partir de L5. Le texte et les surlignages suivent les placements restants dans la tentative. Home lance directement le parcours. Aucune grille, économie ou animation modifiée.

Statut : code réalisé, contrôle visuel après publication en cours ; validation novice/mobile ouverte. L3 propose effectivement le raisonnement « jamais trois », sans prétendre que c'est l'unique technique possible sur une 4×4. Calibration chrono, corpus lointain et tests physiques restent ouverts.

P03 — Recette web : niveau 2 repris sur la même grille et avec 50 croquettes ; texte logique lisible au-dessus du plateau, case connue dorée et cible turquoise. Les tests d'onboarding et de proportions passent (4 tests ciblés), en complément du contrôle complet à 36 tests effectué avant l'ajout du test de répartition. CI vérifie la suite complète à 37 tests.

P04 — Liaison explication / plateau : à la fermeture d'un indice déjà acheté, les prémisses et la cible sont mises en évidence sur le plateau. La fermeture d'une confirmation sans achat ne déclenche pas ce repère. Aucun coût, quota ou timing modifié ; aucun travail d'animation ajouté.

P04 — Le premier contrôle web a trouvé un défaut : l'événement de reprise de Game effaçait le surlignage demandé à la fermeture de Hint. Correction : conserver la preuve affichée au niveau de la scène jusqu'au prochain placement, y compris pendant la reprise. Le débit observé était correct (50 → 35 croquettes, 1/3). Recette de la correction à confirmer.

Contrôle complémentaire P03 (environnement de développement, pas téléphone) :

| Niveau | Timed | Unique | Human Solver | Hypothèses | Chaîne max | Génération observée |
|---|---|---|---|---:|---:|---:|
| 151 | Non | Oui | Résolu | 0 | 0 | 124 ms |
| 154 | Oui | Oui | Résolu | 3 | 4 | 658 ms |
| 10004 | Oui | Oui | Résolu | 2 | 4 | 423 ms |
| 100004 | Oui | Oui | Résolu | 3 | 3 | 1023 ms |

Échantillon ponctuel, pas une garantie pour toute graine ni une calibration humaine du chrono.

Validation du correctif c314c85653d2b4c3799f7442637221d7203f78db : bundle index-dIvtZsPY.js observé sur Netlify ; nouveau premier lancement directement sur L1, texte en trois lignes sans chevauchement ; placements hors de l'ordre proposé correctement suivis ; victoire +5 ; replay sans tutoriel. Achat d'un indice dans ce replay : 65 → 50 croquettes, quota 1/3, puis retour au plateau avec prémisses dorées et cible turquoise persistantes. CI verify, Android et iOS réussies. Validation physique toujours ouverte.

## P04 — Contrôles et fermeture des indices — 2026-09-09

Les boutons communs et cases de grille exigent désormais un toucher commencé sur la même cible. Sortir de la cible annule le geste ; un petit mouvement reste toléré. Une seconde identité de pointeur ne peut pas valider le geste initial. Trois tests couvrent ces invariants.

Le retour matériel Android depuis Hint utilise le même chemin de fermeture que le bouton de l'explication, afin de transmettre la preuve acquise au plateau. Le listener est nettoyé à la fermeture de la scène. Validation sur Android physique encore ouverte.

Contrôle local : suite complète, banque et build web réussis (40 tests). Recette web de ce lot à confirmer après publication ; aucun travail d'animation ni changement d'économie.

Recette publiée du commit 01e56772b124b6eac92a8b0111e89472cdd24d57 : bundle index-BPfHo-k2.js chargé sur Netlify. Continuer ouvre L1. Geste court commencé hors de la case puis relâché dedans : aucun chat posé, cœur et quota inchangés. Petit mouvement commencé et terminé dans la case : chat accepté et guide déplacé vers la déduction suivante. CI verify, Android et iOS réussies. Ce contrôle à la souris dans le navigateur ne remplace pas les essais tactiles, multitouch et Retour matériel sur appareil.

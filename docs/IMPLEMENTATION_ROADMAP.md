# Meowza — contrat d’exécution

2026-09-08 · branche `codex/kawaii-cat-tree` · cible intégrale : MEOWZA_PRODUCT_BIBLE.md.

Un seul bloc d’implémentation actif. Les tâches reportées restent dans ce document. Un bloc visible ne passe pas « terminé » avant validation du rendu et, quand pertinent, du téléphone. Les dépendances externes n’empêchent pas de finir le solo. Aucune date de livraison inventée.

## Ordre et dépendances

P00 → P01 → P02 → P03 → P04 → P05 → P06 → P07 → P08 → P09 → P10 → P11.
P12 dépend de P02/P07/P08 ; P13 dépend du cadrage identité/serveur ; P14 dépend de P03/P08/P13 ; P15 dépend de P10/P14. P16 valide les surfaces effectivement destinées à la sortie, sans exiger d’activer Daily avant le solo.

## P00 — Référence commune

- Objectif : relier chaque cible à un état réel et un chantier.
- Pourquoi : README et section 21 de la Bible décrivent des états différents.
- Périmètre : audit, Bible importée à l’identique, status, roadmap, décisions, spec visuelle.
- Hors périmètre : gameplay, refonte d’assets.
- Tâches : [x] identifier branche et tête distante ; [x] lire Bible/prompt ; [x] auditer source/tests/assets ; [x] produire documents ; [ ] achever inspection de tous écrans/états.
- Dépendances : pièces jointes et repository accessibles.
- Sortie : aucune cible oubliée ; limites explicites ; premier bloc isolé.
- Tests : inventaire + contrôles existants, liens et diff des documents.
- Visuel : Home/arbre et images runtime inspectés ; autres états à compléter par bloc.
- Mobile : non applicable à la documentation.
- Statut : fondation écrite ; audit visuel étendu ouvert.

## P01 — Trois indices par tentative

- Objectif : impossible d’acheter un quatrième indice ; retry repart à 15 et n’hérite d’aucune déduction.
- Pourquoi : contradiction directe aux §6.4/8, actuellement codée et testée à l’inverse.
- Périmètre : tarifs 15/25/40, quota service + UI, remise à zéro, reprise même tentative, migration.
- Hors périmètre : gains, cœur, Undo/Reset, étoiles, difficulté, publicités.
- Tâches : [x] transaction atomique logique ; [x] trois marqueurs loupe ; [x] annonce avant achat ; [x] épuisement codé (visuel à inspecter) ; [x] règles indépendantes ; [x] retry/fin/changement de niveau nettoient l’état ; [x] ancienne sauvegarde conserve grille/solde/progrès ; [x] tests double appel/reload/solde insuffisant.
- Dépendances : P00 ; Human Solver conservé.
- Sortie : quota imposé hors UI ; aucune conservation entre tentatives ; aucune perte de progression.
- Tests : service, migration, coûts, quatrième achat, relecture même tentative, échec/retry, build et banque.
- Visuel : panneau 1/3, 2/3, dernier, solde insuffisant et épuisé ; texte sans chevauchement.
- Mobile : achat/relecture/reprise/retour règles sur téléphone.
- Statut : implémentation locale réalisée ; 🟡 EN ATTENTE VALIDATION VISUELLE ET MOBILE. Pas de publication : conflit de branche Pages documenté D007. Prochain bloc autorisé = recette P01, pas nouveau chantier.

## P02 — Tentative cohérente

- Objectif : trois erreurs et retry ont un comportement unique et testable sur tous les chemins.
- Pourquoi : règles réparties dans BoardView/scènes, commandes abandonnées encore actives.
- Périmètre : logique tentative, supprimer Undo/Reset/étoiles actifs, chrono/reprise/sortie.
- Hors périmètre : nouvelle illustration du cœur, économie, SDK ads.
- Tâches : [ ] invariants erreur/fin hors UI ; [ ] retirer Undo/Reset et tutoriel associé ; [ ] retirer performance étoiles sans effacer les victoires ; [ ] clarifier retoucher une case correcte ; [ ] reprendre exactement la session depuis Home ; [ ] accès legacy ; [ ] idempotence victoire/timeout ; [ ] documenter aide chrono historique.
- Dépendances : P01 ; décision sur aide chrono avant modification de cette règle.
- Sortie : retry total, fermeture accidentelle = reprise, aucune double récompense, pas de vie globale.
- Tests : erreurs 1/2/3, mauvais chat non posé, retry/abandon/reload, background et temps, anciennes sauvegardes.
- Visuel : commandes supprimées sans vide incohérent, victoire sans étoiles.
- Mobile : interruptions, retour Android, fermeture/reprise et timeout.
- Statut : à faire.

## P03 — Apprentissage et calibration

- Objectif : L1–5 enseignent une règle en contexte ; les niveaux élevés restent démontrables.
- Pourquoi : cartes préalables exposent trop tôt toutes les règles ; solvabilité ≠ difficulté ressentie.
- Périmètre : onboarding préparé/contrôlé, séquences, métriques solveur, calibration Timed.
- Hors périmètre : nouveau solveur, modification des règles/quotas verrouillés.
- Tâches : [ ] exemples intégrés et ligne/colonne explicites ; [ ] vérifier que chaque grille exige la technique présentée ; [ ] encadrer arrondis proportions ; [ ] corpus stratégique persisté ; [ ] mesures longueur des preuves ; [ ] temps proposés documentés TUNING ; [ ] génération lointaine/échec Worker.
- Dépendances : P02 ; playtest pour durée/difficulté finale.
- Sortie : solution unique et Human Solver, pas de guessing, pas de chrono avant Extreme, Medium de respiration.
- Tests : onboarding, proportions arrondies, seeds, unicité, preuves, no two timed.
- Visuel : une mini-illustration + une phrase par règle.
- Mobile : novice sans accompagnement, 4×4/6×6/8×8.
- Statut : à faire ; paramètres finaux en attente playtest.

## P04 — Lisibilité du puzzle et système graphique

- Objectif : grille, chat sélectionné, cœur et aide identifiables immédiatement.
- Pourquoi : trois cœurs, primitives génériques et absence de mise en évidence des preuves.
- Périmètre : composants/tokens, grille coussin, HUD cœur unique, loupe, panneaux d’aide, erreurs.
- Hors périmètre : économie, backend, catalogue complet.
- Tâches : [ ] famille composants idle/pressed/disabled/selected ; [ ] cœur intact/fissuré/très abîmé/brisé ; [ ] distinction cœur santé/SAME ; [ ] source → règle → case d’indice ; [ ] états sans mouvement ; [ ] tester dimensions réelles et contraste.
- Dépendances : P01/P02/P03, direction visuelle de la Bible.
- Sortie : une composition validée, pas collection d’assets isolés ; information identique sans animation.
- Tests : actions ne traversent pas les modales, hit areas stables, reducedMotion.
- Visuel : approuver une grille 4×4 et 8×8 et ses états avant déclinaison.
- Mobile : touchers rapides, petits mouvements du doigt, lisibilité quota/cœur.
- Statut : à faire ; validation esthétique requise sur résultat concret.

## P05 — Arbre désirable et lisible

- Objectif : progression continue raccordée et prochain objectif évident.
- Pourquoi : premier socle paraît suspendu ; motifs répétés, pas d’annonce de récompense importante.
- Périmètre : assemblage, nodes, nuages, emplacements futurs, preview milestones.
- Hors périmètre : changer le séquençage, remplir le catalogue, backend.
- Tâches : [ ] points de raccord/pivots ; [ ] composition gauche/droite/niche/hamac/pont ; [ ] current/completed/timed ; [ ] front de nuages ; [ ] aperçu prochain milestone sans promettre objet non défini ; [ ] garder virtualisation ; [ ] éviter création/destruction excessive.
- Dépendances : P04 ; cadence milestones proposée puis validée avant gains réels.
- Sortie : aucun module flottant, interactions visibles, rendu borné, composition persistante.
- Tests : bornes scroll et niveaux lointains, navigation, équipement.
- Visuel : premier niveau, milieu, ancienne progression, décoration, cloud front.
- Mobile : inertie, drag sur node sans lancement, mémoire et chauffe.
- Statut : à faire.

## P06 — Personnalité et réactions

- Objectif : Nimbus/Moka reconnaissables et expressifs, sans perturber la réflexion.
- Pourquoi : poses statiques et transitions disparates.
- Périmètre : Home/splash, victoire/défaite, réactions, motion/audio/haptique, transitions.
- Hors périmètre : collection entière, boucles décoratives perpétuelles.
- Tâches : [ ] poses plein corps ciblées ; [ ] Nimbus réfléchi/Moka gourmand ; [ ] erreur → cœur → émotion → retry ; [ ] climax victoire court ; [ ] transitions Home/arbre/grille/indice/résultat ; [ ] revue SFX ; [ ] reducedMotion complet.
- Dépendances : P04/P05.
- Sortie : chaque animation a une fonction ; jeu immédiatement réactif, unité sans logo.
- Tests : interruption des tweens, nettoyage listeners, navigation rapide.
- Visuel : storyboard et états finaux, aucun asset de référence intégré littéralement.
- Mobile : 20 placements rapides, audio silencieux, sessions prolongées.
- Statut : à faire.

## P07 — Validation solo mobile et playtest

- Objectif : vérifier les vingt premières minutes sur appareils et avec novices.
- Pourquoi : CI verte ne prouve ni plaisir ni absence de chauffe.
- Périmètre : recette, performance, input, sauvegarde, instrumentation locale de diagnostic minimale.
- Hors périmètre : télémétrie externe non décidée, optimisation monétisation.
- Tâches : [ ] protocole novice ; [ ] appareils de référence ; [ ] FPS/mémoire/chauffe/batterie ; [ ] reprise hors ligne ; [ ] vérifier écritures chrono/cache ; [ ] retours de compréhension et envie de continuer ; [ ] corriger constats avec objectif isolé.
- Dépendances : P03–P06 ; Loïc/testeurs pour appareils.
- Sortie : rapport d’essais réel et critères convenus, pas verdict simulé.
- Tests : CI complète et scénarios de non-régression des bugs trouvés.
- Visuel : toutes scènes sur formats cibles, zones sûres et 8×8.
- Mobile : indispensable ; sans preuve, statut jaune.
- Statut : ⏸ validation physique à organiser après préparation.

## P08 — Économie et mesure

- Objectif : observer les stocks/indices/abandons sans fabriquer de frustration.
- Pourquoi : les montants sont TUNING, pas un équilibre commercial démontré.
- Périmètre : transactions croquettes robustes, événements utiles et protocole d’équilibrage.
- Hors périmètre : modifier silencieusement prix/gains, ajouter tracker tiers par défaut.
- Tâches : [ ] événements début/placements/erreurs/probing/indice/abandon/timeout/défaite/victoire ; [ ] journal non intrusif ; [ ] idempotence ; [ ] proposition consentement/rétention données ; [ ] cohortes stock et retour J1/J7 ; [ ] proposition chiffrée avant ajustement.
- Dépendances : P01/P02/P07 ; choix télémétrie avant collecte distante.
- Sortie : données interprétables ; solde et transactions fiables ; privacy correspondant au binaire.
- Tests : répétitions/retry/reload, pas de double gain ni négatif.
- Visuel : portefeuille croquettes clair, absence de confusion avec loupe.
- Mobile : stockage et jeu hors ligne, collecte seulement si activée explicitement.
- Statut : à faire.

## P09 — Diamants et missions

- Objectif : maximum trois missions adaptées par jour, un diamant chacune.
- Pourquoi : acquisition F2P du contenu premium prévue, absente.
- Périmètre : portefeuille séparé, missions/claim/reset, sources de diamants tracées.
- Hors périmètre : conversion vers croquettes, missions dépenses/ads, IAP.
- Tâches : [ ] fixer renouvellement/fuseau ; [ ] transactions idempotentes ; [ ] catalogue de missions sans difficulté inaccessible ; [ ] adaptation capacités récentes ; [ ] claim unique ; [ ] compteur 3/jour ; [ ] stratégie horloge locale et future autorité serveur.
- Dépendances : P08 ; décision de calendrier et modèle de confiance avant activation.
- Sortie : pas plus de 3 diamants de missions/jour ; aucune mission coercitive.
- Tests : minuit, reload, changement d’heure, ancien joueur, faible progression, double claim.
- Visuel : monnaies distinguées, missions compréhensibles.
- Mobile : offline/reprise/claim.
- Statut : 🔴 planifié, non implémenté.

## P10 — Collection, habitants, cosmétiques et milestones

- Objectif : les récompenses acquises se voient dans l’arbre et donnent envie d’avancer.
- Pourquoi : teintes seules et pool fini ne constituent pas la collection cible.
- Périmètre : inventaire, slots objets/habitants, catalogue gratuit/premium, thèmes, milestones.
- Hors périmètre : bonus gameplay, maison séparée, gacha payé.
- Tâches : [ ] valider catalogue/cadence/raretés ; [ ] slots prédéfinis ; [ ] contenu connu premium ; [ ] tirage gratuit sans doublon ; [ ] pool épuisé ; [ ] aperçu/équiper ; [ ] chat visible avec réaction propre ; [ ] prochaine grosse récompense ; [ ] compatibilité fonds choisis.
- Dépendances : P05/P06/P09 ; validation artistique et cadence catalogue.
- Sortie : objets distinctifs, aucune surcharge ou effet gameplay, conservation inventaire.
- Tests : tirage sans doublon, équipement invalide, pool épuisé, migration, récompense unique.
- Visuel : thèmes complets et combinaisons mixtes sur l’arbre réel.
- Mobile : changement de décor sans perdre scroll/progrès, mémoire des habitants bornée.
- Statut : 🟡 socle teintes présent, cible à construire.

## P11 — Boutique et achats directs

- Objectif : acheter exactement le contenu annoncé et récupérer ses droits.
- Pourquoi : aucun produit, prix ou paiement réel aujourd’hui.
- Périmètre : catalogue, prix diamants, IAP packs, reçus/droits/restauration, UX.
- Hors périmètre : No Ads, loterie payante, conversion d’aide.
- Tâches : [ ] prix/€ proposés puis validés ; [ ] preview ; [ ] idempotence achats ; [ ] états indisponible/annulé/en attente ; [ ] restore ; [ ] validation reçus/serveur si requise ; [ ] comptes stores/produits et déclarations.
- Dépendances : P09/P10 ; intégration réelle après décisions prix/comptes et autorité des droits.
- Sortie : transactions sandbox vérifiées ; aucun faux bouton d’achat en production.
- Tests : double callback, achat interrompu, restauration/révocation, solde insuffisant.
- Visuel : contenu/prix connus, distinction des monnaies.
- Mobile : achats sandbox iOS/Android et changement d’appareil.
- Statut : ⏸ dépendances externes ; interface à préparer après catalogue.

## P12 — Continuation rewarded

- Objectif : une seule continuation cœur OU temps, retry toujours gratuit.
- Pourquoi : besoin contextuel validé mais aucun provider.
- Périmètre : provider abstrait puis SDK, quota tentative, callbacks, fallback et mesure.
- Hors périmètre : publicité forcée, mission pub, vente temps obligatoire.
- Tâches : [ ] provider indisponible par défaut/mock de test ; [ ] troisième erreur/timeout ; [ ] continuation conserve placements ; [ ] valeur de temps significative proposée ; [ ] quota consommé une fois ; [ ] échec pub sans blocage ; [ ] instrumentation ; [ ] config store/privacy avant SDK.
- Dépendances : P02/P07/P08, choix provider/comptes/temps avant activation.
- Sortie : jamais cœur puis temps dans même tentative ; retry remet quota ; aucun faux visionnage récompensé en production.
- Tests : callbacks doublés/tardifs, interruption, indisponible, quota rechargé.
- Visuel : choix volontaire clair, aucune ambiguïté avec retry.
- Mobile : retour du SDK et suspension correcte du chrono.
- Statut : 🔴 abstraction absente ; SDK ⏸.

## P13 — Autorité serveur et identité

- Objectif : fondation réelle du compétitif et des droits premium.
- Pourquoi : client local seul ne peut garantir classement ni tentative unique.
- Périmètre : architecture backend, identité, horloge UTC, stockage, opérations/idempotence, sécurité/exploitation.
- Hors périmètre : prétendre qu’un mock est un service de production.
- Tâches : [ ] décision stack/budget/compte ; [ ] guest/account/recovery ; [ ] schémas et API ; [ ] journal horodaté serveur ; [ ] limites requêtes ; [ ] secrets hors client ; [ ] suppression compte/données ; [ ] migrations, sauvegarde et observabilité ; [ ] droits IAP si activés.
- Dépendances : décisions de Loïc sur service/comptes/coûts ; contrats P09–P12.
- Sortie : déploiement test vérifié, pas de score déclaratif client accepté comme autorité.
- Tests : auth, rejeu, transactions, horloge, permissions et sauvegarde/restauration.
- Visuel : erreurs réseau/compte sans bloquer le solo.
- Mobile : offline/online/session expirée.
- Statut : ⏸ décisions externes, pas un prérequis pour finir solo.

## P14 — Daily Extreme, leaderboard et anti-cheat

- Objectif : une tentative classée serveur, classement erreurs puis temps vérifiable.
- Pourquoi : mode mondial cible absent ; Human Solver seul ne prouve pas la triche.
- Périmètre : puzzle journalier, tentative, move log, résultat, classement, récompenses quotidiennes.
- Hors périmètre : bannissement automatique sur chemin solveur, second essai classé.
- Tâches : [ ] décider aides/pause/timeout/éligibilité ; [ ] puzzle contrôlé serveur ; [ ] unicité par identité/jour ; [ ] replay serveur des coups ; [ ] durée plausible + anomalies + signal logique ; [ ] revue lots importants ; [ ] top 5/10/15% non cumulatif ; [ ] petite population/arrondis ; [ ] consolation ; [ ] pertes réseau et finalisation idempotente.
- Dépendances : P03/P08/P13 et valeurs manquantes validées.
- Sortie : résultat recalculé et récompense unique, test adversarial, aucun score de localStorage admis.
- Tests : faux score, multi-envoi, minuit, abandon, résultats ex aequo, horodatage, faible population, joueur très fort légitime.
- Visuel : tentative unique annoncée, classement/récompense non trompeurs.
- Mobile : session longue et interruptions réseau.
- Statut : ⏸ backend/décisions ; jamais simulé comme livré.

## P15 — Cat Day

- Objectif : événement samedi, lots distribués dimanche 00:01 UTC une seule fois.
- Pourquoi : rendez-vous collection premium explicitement validé.
- Périmètre : calendrier, chat hebdomadaire, lots proportionnels, distribution/revue.
- Hors périmètre : deuxième événement dimanche, une seule copie mondiale, lots cumulatifs.
- Tâches : [ ] catalogue hebdomadaire soutenable ; [ ] lots 1/2/3 ; [ ] 10/5/3 diamants et chat pour Top 5% ; [ ] job serveur idempotent/reprise ; [ ] chat déjà possédé ; [ ] calendrier et fuseau affichés ; [ ] revue antifraude avant droits importants.
- Dépendances : P10/P14, cadence artistique et cas des doublons validés.
- Sortie : un design rare hebdomadaire, plusieurs gagnants autorisés, pas de double distribution.
- Tests : samedi/dimanche UTC, relance job, panne, petits classements, duplication, comptes suspendus.
- Visuel : récompense réellement représentée, claim clair.
- Mobile : récupération différée sans perte.
- Statut : ⏸ dépendances, conservé dans roadmap.

## P16 — Livraison et suivi

- Objectif : version distribuable et vérifiée, puis apprentissage soft launch.
- Pourquoi : compilation ne vaut pas certification commerciale.
- Périmètre : CI réellement bloquante, assets natifs, signatures, appareils, fiches/support/privacy, données rétention.
- Hors périmètre : promesse top 50 ou revenu garanti.
- Tâches : [ ] relier tests au déploiement ; [ ] triggers assets natifs ; [ ] versions cohérentes ; [ ] icônes/splash/masks ; [ ] builds signés ; [ ] bêta appareils ; [ ] captures réelles ; [ ] comptes/support/langues/pays ; [ ] déclarations données du binaire ; [ ] sortie graduelle ; [ ] J1/J7 et incidents.
- Dépendances : solo P07 validé et systèmes réellement activés validés ; comptes éditeur.
- Sortie : recette et binaire identifiés, rollback défini, aucun système absent annoncé comme actif.
- Tests : CI, installation/migration/signatures, hors ligne, paiements/ads uniquement si activés.
- Visuel : screenshots stores fidèles au binaire final.
- Mobile : obligatoire iPhone + Android représentatifs, chaleur/batterie et sessions prolongées.
- Statut : ⏸ validation physique et comptes.

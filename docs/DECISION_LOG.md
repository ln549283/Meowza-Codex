# Meowza — décisions

## D001 — Branche et sources

- Date : 2026-09-08. Statut : validé par instruction de Loïc.
- Contexte : prompt parle d’une branche indépendante, Bible audite `-refonte`, mais Loïc demande la même branche.
- Décision : conserver `codex/kawaii-cat-tree`. Bible importée à l’identique comme cible, audit daté distinct comme réalité.
- Alternatives : changer de branche ou recopier l’audit ancien ; rejetées.
- Pourquoi : respecter l’instruction actuelle et éviter de réécrire des systèmes déjà présents.
- Impact : documentation, références de commit ; modifications distantes conservées.
- Validation : branche locale identifiée, tête distante et blobs comparés avant modification.

## D002 — Première unité d’exécution

- Date : 2026-09-08. Statut : validé pour exécution par Bible §6.4/8 et prompt.
- Contexte : indices illimités, 20/35/50, bibliothèque persistante entre retries.
- Décision : P01 impose 3 achats à 15/25/40 dans le service et un quota visible. Une même déduction peut être relue dans la même tentative ; rien ne passe au retry.
- Alternatives : refonte globale de SaveService ; changer le solveur ; commencer par le logo. Rejetées : risque et scope inutiles.
- Pourquoi : contrat précis testable et préalable à la future UI/monétisation.
- Impact : économie indices uniquement, SaveService, HintScene, affichage loupe, texte Lost, tests. Gains inchangés. Cœur/étoiles/Undo restent ouverts P02/P04.
- Validation : coûts, quatrième achat, retry, migration, relecture, interruption, solde insuffisant, UI et mobile.

## D003 — Migration des indices

- Date : 2026-09-08. Statut : décision technique d’exécution ; communication à tester.
- Contexte : anciennes sauvegardes contiennent des déductions achetées dans d’anciennes tentatives ; la cible les abandonne.
- Décision : ne pas réinitialiser solde, grille, victoires ou cosmétiques. Le nouvel état d’indices est lié à la session active. Ne pas importer les anciens historiques multi-tentatives. Reporter le compteur de la tentative active dans la limite de trois pour ne pas octroyer un nouveau quota au reload ; prochaine tentative repart à zéro. Pas de remboursement ni d’attribution arbitraire de monnaie.
- Alternatives : tout effacer ; garder indéfiniment les droits anciens ; rembourser automatiquement sans montant fiable. Rejetées.
- Pourquoi : changement explicitement validé par Bible, migration simple et limitée.
- Impact : version des règles d’indices, note utilisateur au panneau si migration active.
- Validation : ancienne sauvegarde, compteur >3, aucune session, solde inchangé, retry et nouvelle sauvegarde.

## D004 — Objection : quota et chrono

- Date : 2026-09-08. Statut : à tester, aucune modification de règle.
- Décision actuelle : trois indices max et Extreme Timed obligatoire ; aide historique +50% après trois échecs dans le code, non mentionnée dans la cible.
- Problème : cumul possible de blocage cognitif, limite d’aide et pression temporelle.
- Alternative : conserver temporairement l’aide temporelle gratuite existante, puis calibrer durée/chaînes plutôt qu’augmenter la frustration.
- Bénéfice : préserver apprentissage/retry ; risque : mémoire remplace raisonnement ou défi trop atténué.
- Données : erreurs, timeouts, retries, abandon au premier Timed et usage indices, compréhension observée.
- Recommandation : Bible conservée, aide historique non supprimée silencieusement ; demander décision avant de l’institutionnaliser.
- Impact : P03/P07, pas P01.
- Validation : playtest nécessaire, pas statistiques inventées.

## D005 — Objection : récompense rare Top 5%

- Date : 2026-09-08. Statut : proposé, aucune modification de Bible.
- Décision actuelle : rare hebdomadaire Top 5% du samedi, dimanche 00:01 UTC distribution.
- Problème : mêmes experts peuvent monopoliser une source forte de collection ; coût d’un design nouveau chaque semaine.
- Alternative considérée : voie de collection tardive différente, sans retirer la distinction hebdomadaire. Non autorisée tant que non validée.
- Bénéfice : attachement F2P plus large ; risques : prestige dilué, inflation catalogue.
- Données : concentration gagnants, participation récurrente, cadence artistique soutenable, plaintes/abandons.
- Recommandation : conserver la règle actuelle ; cadrer catalogue et population avant lancer l’événement.
- Impact : P10/P15. Validation : décision produit et données réelles.

## D006 — Anti-cheat et phases serveur

- Date : 2026-09-08. Statut : validé par Bible pour le principe, architecture à décider.
- Contexte : aucun backend ; solution solo embarquée ; Human Solver explicatif existant.
- Décision : ne pas faire passer une démo locale pour un Daily mondial. Garder le solveur comme signal parmi plusieurs ; autorité serveur et revue récompenses.
- Alternatives : classer localStorage ou bannir toute trajectoire non préférée du solveur ; rejetées.
- Pourquoi : pas d’équité compétitive possible sur score auto-déclaré ; risque de faux positifs.
- Impact : P13/P14, solo non bloqué.
- Validation : contrats API, replay des coups, tests adversariaux et humains.

## D007 — Ne pas remplacer le site d’une autre branche

- Date : 2026-09-08. Statut : publication suspendue, clarification nécessaire.
- Contexte : branche demandée conservée `codex/kawaii-cat-tree`, mais dernier run Pages réussi `34210957669` depuis `kawaii-cat-tree-refonte-v3` (`fc29d69b4454a3e0a486f011bc58cb1a19d47076`). La grille observée ne correspond pas à nos sources.
- Décision : conserver changements et commit locaux sur la branche demandée ; pas de push déclenchant un remplacement du site partagé. Pas de changement silencieux de branche.
- Alternatives : écraser Pages, importer l’autre branche, désactiver son workflow ; rejetées sans choix explicite de source de livraison.
- Pourquoi : éviter une régression inter-branche et une fausse validation visuelle.
- Impact : P01 automatisé vérifiable localement ; visuel et téléphone en attente. Le navigateur cloud refuse le serveur local (`ERR_BLOCKED_BY_CLIENT`).
- Validation : tête de branche GitHub et derniers runs interrogés, script servi identifié dans le DOM, grille rechargée. Demander quelle branche doit rester la référence effective avant publication.

## D008 — Prévisualisation dédiée Netlify

- Date : 2026-09-08. Statut : validé par Loïc, isolation en cours de vérification.
- Contexte : Loïc a créé https://meowza-473953555.netlify.app/ pour notre version. Le site répond dans le navigateur.
- Décision : cette branche utilise Netlify ; retirer uniquement son workflow Pages. Les workflows de qualité et de builds natifs sont conservés. Configuration build versionnée : Node 22, npm run check, dist.
- Alternatives : fork/nouveau repository ; rejetés car deux branches suffisent.
- Pourquoi : permettre deux prévisualisations sans écraser l’autre version.
- Impact : aucun changement sur kawaii-cat-tree-refonte-v3. Push atomique de la suppression Pages et du travail P01.
- Validation : vérifier déploiement du nouveau code sur Netlify ; recette P01 et mobile restent à consigner séparément.

## D009 — Preuve d’isolation et de livraison P01

- Date : 2026-09-08. Statut : publication et scénario web principal vérifiés ; mobile à tester.
- Contexte : site Netlify lié à la branche, suppression Pages et P01 envoyés atomiquement dans 6c66996.
- Décision : Netlify devient la prévisualisation de travail ; conserver P01 jaune jusqu’à recette restante et mobile. Ne pas lancer un autre chantier pour masquer la validation manquante.
- Alternatives : annoncer terminé depuis la CI seule ; rejeté.
- Pourquoi : maintenir la distinction code, publication, UX, validation physique.
- Impact : status/roadmap/spec actualisés ; aucune modification de règle supplémentaire.
- Validation : achat 60→45, relecture sans débit, défaite puis retry 0/3 et nouveau tarif 15 dans le navigateur ; Quality/Android/iOS réussis sur le commit publié.

## D010 — Contrat de tentative et commandes (2026-09-08)

Application des §6–7 : suppression Undo/Reset et étoiles actives. Les anciennes étoiles restent des données historiques inertes ; les victoires et droits existants sont conservés. Retoucher un chat accepté ne l'efface pas et ne coûte pas de chance : la Bible garantit que ce placement est correct. La validation du placement est isolée dans core/attempt.ts, sans dépendance Phaser. Les indices utilisent toujours Human Solver ; la vérification du résultat au moment du placement ne sert pas à produire leurs preuves.

Le cœur unique présente les dégâts sans dépendre d'une animation. Une courte transition permet de voir l'état brisé. Ce dessin vectoriel constitue le composant fonctionnel, pas la validation finale de la direction artistique ou des réactions de Nimbus/Moka. L'aide chrono historique +50 % après trois échecs est conservée ; aucune publicité simulée n'est activée.

Continuer privilégie une tentative active, y compris un ancien niveau rejoué. Les doubles callbacks de victoire sans nouvelle tentative ne répètent plus les statistiques ni ne remplacent le reçu de récompense.

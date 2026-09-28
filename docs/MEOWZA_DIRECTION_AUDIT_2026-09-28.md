# Meowza — audit de direction et décision de production

État vérifié le 28 septembre 2026 sur `kawaii-cat-tree-refonte-v3`, code au commit `15a3b20`. **Seconde passe de direction après l'audit `099e12c`** : la direction générale est acceptée dans son principe ; les choix détaillés ci-dessous sont proposés à validation avant tout passage en production. Aucun asset ou code de jeu n'est modifié ici.

## A. Diagnostic actuel

**Ce qui mérite d'être conservé.** Le puzzle binaire, la solution unique, le solveur humain, la génération déterministe, les cinq premiers niveaux progressifs, le retry gratuit et le parcours continu forment déjà un socle sérieux. La progression est sauvegardée, les missions quotidiennes locales fonctionnent, l'arbre ne crée que les tronçons voisins, et les premiers visuels de Nimbus, Moka et de l'arbre ont une vraie promesse. `npm run check` passe : 58 tests, 110 grilles validées et build web.

**Ce qui bloque la qualité commerciale.** L'accueil promet un jeu illustré et vivant ; l'arbre répète essentiellement trois grandes compositions, les paliers se ressemblent, le plateau et les écrans méta assemblent des images et des formes sans système d'interface stable. Le bouton Défi du jour ouvre les missions, sans défi. La boutique ne propose que six décors achetables avec les croquettes ; les diamants gagnés par mission n'ont aucun usage. Le jeu ne vend rien, n'a ni achat intégré ni publicité récompensée. Le catalogue de 50 chats est un manifeste (40 standard, 10 premium), dix nouveaux PNG existent dans `cats-v2`, tandis que seulement six anciens chats sont préchargés et collectionnables dans le runtime. Les changements de bois et tissu sont des recolorations de pixels dans un tronçon composé, ce qui limite la vraie personnalisation. Les récompenses de chats sont déterministes tous les dix niveaux, puis s'arrêtent après six chats.

Le code `ui.ts` étire `ui/panel.png` (532 × 296 px) vers des panneaux de formes très différentes. `motion.ts` ne charge qu'une image fixe par effet, et le personnage n'a plus de séquence animée utilisée. `AudioService.ts` joue de courts oscillateurs sinusoïdaux et une boucle de notes optionnelle, désactivée par défaut. `main.ts` plafonne la boucle à **30 FPS**. Le build contient environ **83 Mo**, dont des centaines d'images d'animation non chargées par le jeu : la dette d'assets pèse donc sur le paquet même quand elle n'apparaît pas à l'écran.

**Ruptures de la chaîne produit :**

| Étape | Force actuelle | Rupture vérifiée | Hypothèse de correction |
| --- | --- | --- | --- |
| Acquisition | Deux mascottes, promesse de puzzle félin | Capture de jeu moins expressive que l'accueil | Montrer une grille lisible et un arbre habité dans les visuels store |
| 0–5 min | Cinq grilles guidées, retry immédiat | Page de règles de quatre écrans avant la première grille ; récompense sans révélation marquante | Première action jouable rapide, règles contextuelles, première récompense visible |
| Suite | Niveau suivant direct, difficulté croissante | Arbre répétitif, jackpot de palier peu incarné | Chat aperçu avant son palier ; arrivée et installation visibles |
| Retour | Trois missions locales | Doublon de navigation « Défi du jour », diamants inutiles | Un seul rendez-vous quotidien honnête et une récompense employable |
| Collection | Chats attribués au parcours | Six disponibles, peu d'expression et de contrôle d'habitat | Catalogue de 24 habitants identifiables, fiche, pose et placement immédiats |
| Achat | Volonté de cosmétiques | Aucune offre réelle ni objet premium observable | Gamme courte mais complète de chats, habitats et ensembles prévisualisables |

L'affirmation « 85 % terminé » peut décrire le code fonctionnel de base, **pas** le chemin vers un produit commercial prêt à publier. Le potentiel de revenu dépend aussi de l'acquisition, qui n'est pas résolue par un catalogue plus grand.

## B. Vision cible

En ouverture, Nimbus et Moka proposent immédiatement une petite grille. Après une première déduction, les cases répondent avec une animation courte et un son reconnaissable ; la résolution ouvre l'arbre sur le prochain perchoir. L'écran d'arbre montre environ une fenêtre de niveaux lisibles, un prochain palier concret, et quelques chats *possédés* qui occupent les supports sans recouvrir les numéros. Toucher un chat ouvre sa fiche et son placement. Gagner un palier dévoile et installe un chat ou un objet avec une petite scène de récompense. Une boutique présente quelques personnages et thèmes directement, au prix explicite, dans le même décor. Le joueur peut jouer sans attendre ni payer.

Promesse à tester en une phrase : **« Résous une grille, fais vivre ton arbre. »** Le test de qualité est la cohérence entre capture store, première minute, victoire et arbre, et non le nombre de systèmes visibles.

## C. Keep / Modify / Remove / Add

| Décision | Système | Pourquoi |
| --- | --- | --- |
| KEEP | Règles, solveur humain, progression hybride, retry gratuit, sauvegardes | Base différenciable et techniquement éprouvée |
| KEEP | Arbre unique et Nimbus/Moka | Identité potentielle si les personnages vivent dans le jeu |
| MODIFY | Tutoriel, écran de grille, barre d'indices et cœur | Première action plus rapide ; règles et feedback plus clairs |
| MODIFY | Arbre et paliers | Répétition contrôlée, fenêtres de niveau lisibles, habitants et récompenses concrètes |
| MODIFY | Collection | 24 chats visibles au lancement, 18 gagnables et 6 premium ; validation artistique et technique par lots |
| MODIFY | Croquettes | Réserver aux indices et, au plus, à de petits objets gagnables ; vérifier gains et dépenses |
| MODIFY | Missions | Deux ou trois objectifs atteignables ; récompenses utilisables immédiatement |
| REMOVE du lancement | Bouton « Défi du jour » qui redirige vers Missions | Promesse non tenue ; remplacer par « Bientôt » seulement si nécessaire, sinon retirer |
| REMOVE du lancement | Diamants affichés et accumulés sans usage | Dette économique et promesse prématurée ; préserver les soldes enregistrés pour une migration ultérieure |
| REMOVE | Étoiles des plaques et mission « Maître des étoiles » | Contradiction avec la Bible et bruit visuel ; garder les statistiques de précision |
| REMOVE du paquet | Images jamais chargées par le runtime | Taille et complexité inutiles ; garder les sources hors paquet distribué |
| ADD | Fiches de chats, prévisualisation dans l'arbre, quelques interactions | Attachement et désir d'objet spécifique |
| ADD | Système UI de composants redimensionnables et langage motion/audio | Finition reproductible sur tous les écrans |
| ADD | Gamme de 6 chats premium, habitats et thèmes directs, restauration des achats et contrôle natif | Désir d'habiter et transformer l'arbre, sans monnaie premium intermédiaire |

Ces suppressions du lancement ne préjugent pas des fonctions futures. Conserver la compatibilité des sauvegardes, notamment le solde de diamants historiques.

## D. Core loop cible

**Partie :** lire une contrainte → déduire → poser un chat → retour instantané clair → compléter la grille → victoire brève → niveau suivant. Les placements corrects ne doivent pas exiger de confirmation. L'indice apprend une déduction, avec coût et quota explicites.

**Méta :** victoire → progression visible dans l'arbre → anticipation d'un chat/décor → palier → révélation → placement/personnalisation → nouvelle grille. La récompense doit changer quelque chose de visible *à l'endroit où le joueur progresse*.

## E. Progression et rétention

- Première session : entrer vite en grille, réussir 2–3 puzzles, voir le premier chat personnalisable et le palier à venir. Tester réellement le temps nécessaire, sans promettre une durée arbitraire.
- Premiers 20 niveaux : variété de déductions et pauses faciles ; un habitant gratuit gagné tôt, puis un palier annoncé visuellement avant le niveau 10.
- Ensuite : palier prévu tous les dix niveaux, mais pas toujours la même animation ni le même type de lot ; aperçu du prochain contenu. Éviter qu'un joueur ait 40 niveaux à faire pour revoir quelque chose de nouveau.
- Retour quotidien : mission courte qui accompagne la partie normale et récompense concrète ; Daily mondial et compétition différés tant que la population et le coût de sécurité serveur ne le justifient pas.
- Suivre avec consentement adapté : début/fin tutoriel, échecs par niveau, dépenses d'indices, première récompense, retour J1/J7, clics et achats d'offres. Les nombres ne valent que sur de vrais joueurs.

## F. Économie et monétisation

### F1. Principe : désirer une scène, connaître son prix

Le produit vendu est une **nouvelle relation visible avec l'arbre** : un habitant, son lieu, une animation courte, un thème cohérent. Le chat seul doit déjà être attachant et plaçable ; le bundle révèle une petite composition qu'on peut reproduire chez soi. Aperçu du chat *sur un support de son arbre*, nom, pose, comportement et contenu exact de l'offre avant le prix. Les objets n'améliorent ni la grille, ni les gains, ni la place au classement. Rien ne bloque le jeu normal et aucune publicité n'est forcée.

**Choix : achats directs en monnaie réelle pour le contenu premium permanent.** L'utilisateur achète ce qu'il voit ; le prix n'est pas masqué derrière des diamants. Une monnaie premium ajouterait aujourd'hui conversion mentale, soldes résiduels, vente de packs et contrôle des prix sans résoudre le vrai problème, qui est le manque d'objets désirables. Reconsidérer une devise uniquement si un catalogue et une cadence d'événements réellement maintenus rendent les produits directs ingérables. Apple distingue les achats consommables des biens permanents ; Google Play propose des produits achetés une fois : les chats et thèmes permanents relèvent de ce second cas. La restauration et les droits liés au compte de la plateforme doivent fonctionner ; **ne pas promettre une restauration iOS ↔ Android sans compte Meowza et service dédié**. Références : [Apple In-App Purchase](https://developer.apple.com/in-app-purchase/), [Google Play produits à achat unique](https://developer.android.com/google/play/billing/one-time-products), [politique de paiement Google Play](https://support.google.com/googleplay/android-developer/answer/9858738).

### F2. Gamme initiale proposée

| Objet | Gratuit et gagnable | Premium permanent | Pourquoi on le veut |
| --- | --- | --- | --- |
| Chats | 18 des 24 habitants | 6 des 24, chacun achetable directement | Tempérament et place à soi, sans avantage de puzzle |
| Supports et habitats | Assortiment de coussins, hamacs et niches par paliers/missions | 2 habitats signatures avec silhouette et interaction spécifiques | Mettre en scène un chat favori, changer un endroit familier |
| Petites décorations | Jouets, fanions, plantes en récompense directe | Quelques détails intégrés aux ensembles, jamais nécessaires seuls | Finir une composition plutôt qu'empiler des objets |
| Thèmes d'arbre | Base + une variation gagnable | 2 thèmes visuels complets et cohérents | Transformer une fenêtre entière sans perdre la lisibilité des niveaux |
| Ensembles | Récompense de progression montée dans l'arbre | 2 ensembles chat + habitat + petit décor ; éléments vendus séparément | Obtenir une scène harmonisée au prix lisible |

Tous les chats, y compris premium, apparaissent dans le catalogue avec leur **mode d'obtention**. Un joueur gratuit peut compléter la collection gratuite ; l'interface ne présente pas « 18/24 » comme une collection ratée parce que six produits sont payants. Les duos/ensembles ne verrouillent pas artificiellement un personnage : chaque contenu durable doit rester disponible à l'unité ou avec une voie équivalente annoncée. Si un élément d'un ensemble est déjà possédé, ne pas proposer le pack plein tarif sans information ; masquer cette offre ou proposer les pièces manquantes séparément.

**Vitrine de lancement limitée :** six fiches de chats à l'unité, deux habitats, deux thèmes, deux ensembles mis en avant ; un accueil de bienvenue facultatif qui regroupe des produits existants à prix clair, disponible pendant la première phase de découverte du jeu, sans faux compte à rebours ni exclusivité de gameplay. Ces catégories peuvent partager des composants et ne requièrent pas douze panneaux distincts. Hypothèses de *prix à tester*, non validées : chat individuel autour de 1,99–2,99 €, habitat 1,99–3,99 €, ensemble 4,99–6,99 €, thème complet 5,99–8,99 €. Vérifier prix locaux, valeur perçue et frais des stores avant configuration des produits ; aucun chiffre d'affaires ne découle automatiquement de ces fourchettes.

**Monnaie de jeu :** croquettes gagnées en résolvant pour les indices. Les petits décors déjà achetés avec des croquettes restent acquis ; les nouveaux petits objets passent principalement par les récompenses de progression et les missions, pour ne pas opposer aide et décoration. Missions : 2–3 objectifs accessibles, avec un petit objet précis ou une avancée clairement annoncée vers un lot gratuit, plutôt qu'un nouveau solde abstrait. Le bilan des **diamants déjà gagnés** reste conservé en sauvegarde, mais invisible tant qu'il n'a pas d'usage ; avant toute suppression définitive, définir une conversion juste en objets gratuits au choix et la tester sur anciennes sauvegardes. Ne jamais faire disparaître un achat ou une récompense déjà octroyée.

**Cadence soutenable :** lancement avec la gamme complète ci-dessus ; après quelques semaines de données et de retours, au plus un petit ensemble ou un chat toutes les **6 à 8 semaines** si la production le permet. Une saison peut changer un motif, une animation d'accueil et un lot gratuit ; ne pas promettre du contenu hebdomadaire ni un serveur Daily pour remplir un calendrier. Pas de rotation retirant les achats permanents ; une vitrine éditoriale peut changer sans que les produits possédés ou annoncés disparaissent. Aucun sentiment d'urgence fabriqué.

La continuation par pub après erreur/chrono reste un test **postérieur** à la validation du retry. Sans énergie ni interstitiels, ce n'est pas un pilier de revenu. Sensibilité purement illustrative : **1 000 installations × 2 % d'acheteurs × 3 € de panier = 60 € bruts** avant frais et coûts ; ni ces taux ni la conversion d'une belle boutique ne sont garantis. Tester acquisition, rétention et intention d'achat avant d'investir dans une cadence de contenu.

## G. Direction définitive de l'arbre

**Le garder et le restructurer.** Il relie progression, habitat et collection dans un même lieu. Le chemin des niveaux, le niveau courant et le prochain palier occupent toujours la première couche de lecture. Les habitants occupent la deuxième ; décor et mouvements ambiants restent dans la troisième. L'arbre est un monde habité, pas une rangée de 24 portraits placés en permanence.

| Règle de composition pour une fenêtre mobile | Cible de départ à tester |
| --- | --- |
| Niveaux visibles | Viser environ 8–10 si les numéros et cibles tactiles restent nets ; accepter moins sur petit écran |
| Habitants pleinement visibles | 2–4 au maximum par fenêtre, même si 24 sont possédés ; l'utilisateur choisit ses favoris |
| Répartition | Aucun chat sur la plaque du niveau courant ; au moins un support libre et une respiration autour du palier |
| Décor mobile | Un seul petit mouvement ambiant perceptible à la fois, pause pendant le scroll rapide et la sélection |
| Espace calme | Environ un tiers de la fenêtre sans élément saillant ; laisser des coussins vides pour donner envie de les remplir |
| Entrées interactives | Plaque, chat, décoration éditable ont des cibles distinctes et une priorité visuelle/tactile constante |

Un coussin, hamac ou niche **dans chaque tronçon possédé** peut accueillir un chat ; l'obtention au palier dix ne limite plus la *place* au palier dix. La collection garde les chats qui ne sont pas exposés. En arrivant, le joueur voit son niveau courant et un voisinage de chats choisis, pas l'ensemble de son inventaire. Un tap sur un chat ouvre sa fiche et son placement ; une pression sur un support vide propose un habitant possédé. La composition est déterministe et sauvegardée, y compris si le joueur revient après plusieurs jours.

**Vie discrète :** respiration d'un chat assis ou endormi ; regard vers le doigt lorsque l'on touche un support ; bâillement ou queue qui suit un jouet, rarement et une fois. Une réaction différente par tempérament, produite avec les mêmes quelques animations partagées. Au retour, une seule courte scène contextuelle (un chat s'étire, se retourne ou accueille) puis l'arbre se calme. Aucun « événement manqué » ou récompense fictive après absence. Ne pas recalculer en boucle des sprites invisibles ; arrêter mouvement/son hors champ.

**Progression visible :** le niveau débloqué enlève une petite portion du front de nuages ; les paliers ajoutent un support, changent un tissu ou invitent un nouvel habitant. Une récompense importante aboutit toujours à une modification identifiable *dans la fenêtre où le joueur vient de progresser*, sauf s'il choisit lui-même un autre support. Les zones sont des variations de composition (aire de repos, passerelle, niche haute), pas des biomes imposés. Les thèmes changent le traitement de l'arbre sans déplacer les plaques ni masquer les indices.

Les recolorations globales de `treeStyle.ts` ne suffisent pas à un habitat personnel : les supports éditables et petits objets doivent devenir des calques indépendants avec **slots prédéfinis**. Les grands thèmes peuvent employer des variantes de tronçons conservant raccords, ancrages et lumière. Valider une base et une continuation avant de généraliser. Le rendu doit rester reconnaissable et fonctionnel sans aucun chat installé.

## H. Chats

**Décision proposée : 24 chats réellement visibles et obtenables au lancement**, répartis en **18 standard** et **6 premium**. C'est une cible de contenu, pas l'affirmation que 24 sont déjà prêts : le manifeste en prévoit 50, dix nouveaux PNG existent, six anciens sont branchés au runtime. Les 50 noms/descriptions deviennent un réservoir éditorial, à redessiner ou écarter si leur silhouette ne sert pas la DA canonique. Passer de 10–16 à 24 donne quatre pages de six chats avec un vrai choix de favoris et suffisamment de variété dans les arbres ; passer immédiatement à 50 doublerait la dette de rendu, intégration et QA avant de savoir si la collection fidélise.

| Répartition | Acquisition proposée | Rôle |
| --- | --- | --- |
| 2 standard | Premiers niveaux, dont un avant le niveau 10 | Faire comprendre l'habitat dès la première session |
| 10 standard | Paliers de progression 10–100, tirage gagné sans doublon dans le pool standard | Anticipation régulière et arbres différents entre joueurs |
| 6 standard | Collections/missions durables annoncées, sans connexion quotidienne forcée | Différenciation entre joueurs et objectif de moyen terme |
| 6 premium | Achat direct transparent, toujours visibles et plaçables | Personnages désirés pour leur style et leur interaction, jamais pour leur puissance |

Le tirage de progression est gratuit, reproductible depuis la sauvegarde, et exclut tout doublon ; le joueur voit le chat réellement obtenu, jamais une promesse de rareté trompeuse. Ce calendrier ne signifie pas un lot neuf *uniquement* tous les dix niveaux : petits décors et habitats gagnés entre paliers comblent les creux. Ne pas obliger à jouer 100 niveaux avant de voir la majorité des chats dans le catalogue. La distribution exacte se calibre selon le temps des niveaux et les premiers tests. Nimbus et Moka sont les héros du puzzle et de l'accueil, **hors des 24 habitants** ; ils peuvent apparaître dans l'arbre sans prendre un emplacement de collection.

**Fabrication reproductible, sans clones :** quatre familles de silhouettes/poses de base (boule endormie, pain assis, curieux perché, chat étiré), chacune avec six personnalités. Partager squelette, ancrages sur support et quatre boucles légères (respiration, clignement, regard, queue), plus deux réactions communes (accueil et tap). Chaque chat doit avoir *au moins* deux caractères visibles à taille réelle, autres que sa couleur : forme d'oreille/queue/fourrure, dessin du museau, posture ou marque forte. Chaque premium reçoit en plus une pose de présentation et une interaction signée ; ne pas exiger 24 rigs entièrement uniques. Les comportements spéciaux ne doivent pas changer la logique ni rendre les standards inertes.

**Contrats de qualité :** gabarit et pivot communs, alpha propre, patte réellement posée sur le support, contour et lumière cohérents ; silhouettes reconnaissables à la taille d'un habitant d'arbre, tête lisible sur la fiche ; aucun halo peint ni coussin fusionné dans le sprite. Tester trois prototypes de familles côte à côte avec Nimbus et Moka avant de traiter les 24. Produire ensuite par lots de 4–6 avec validation des poses et du rendu sur l'arbre. Les dix PNG `cats-v2` sont candidats à reprendre, non une garantie qu'ils correspondent tous à la nouvelle DA.

## I. Direction artistique canonique proposée

### I1. Signe propriétaire : « deux coussins, un lien »

La forme de base n'est pas une patte, un cœur générique ou un rectangle arrondi : ce sont **deux lobes souples reliés par un petit pont tendu**. Elle vient directement des deux valeurs du puzzle et des liens entre cases. Elle se retrouve sous trois échelles : paire de joues/oreilles sur les héros, paire de coussins aux embranchements de l'arbre, découpe discrète du bouton principal et des plaques de niveau. Le pont est parfois une couture, parfois une corde de sisal, parfois une petite languette de tissu ; sa *fonction* change sans que la famille de formes disparaisse. Le tronc forme des bifurcations en Y et les supports arrivent par paires de manière irrégulière, jamais une symétrie mécanique répétée. Une capture doit conserver ce vocabulaire même si on masque le logo, les textes et les couleurs.

**Trois niveaux de contraste, très stricts :** (1) cases actives, chat sélectionné, plaque courante et CTA : formes franches et contour prune ; (2) habitants/objets gagnés : couleur, matière et ombre douce ; (3) pièce et tronçons éloignés : lavis moins net et moins saturé. Le même accent turquoise n'est employé que pour l'action/déduction, pas pour tout objet décoratif. Bois chaud, sisal clair, tissu corail et mauve restent une base, **pas la définition de l'identité**. Les motifs secondaires sont couture double, petit fil tressé en boucle ouverte et deux empreintes décalées ; pas de pluie de pattes et de cœurs sur tous les écrans.

### I2. Personnages, à taille réelle et en petit

La silhouette de collection est **basse, compacte, stable sur un support** : tête environ 40–45 % de la hauteur du chat assis, corps plutôt trapu, petites pattes lisibles, oreilles courtes de formes variables, queue extérieure à la silhouette quand elle est pertinente. Vue principale en trois quarts doux, axe de lumière haut gauche, bord brun prune légèrement irrégulier et ombre de contact séparée. Yeux simples, en amande ou croissant, à deux valeurs ; éviter les immenses reflets anime sur les habitants et les détails de fourrure impossibles à lire à 100 px. Variantes de fourrure dessinées en **grandes zones de valeur**, pas en textures fines. Cinq expressions réutilisables : neutre, curieux, fier, somnolent, contrarié ; la pose et le regard font le travail avant les effets.

**Nimbus** : gabarit plus rectangulaire et posé, joues légèrement plates, oreilles rapprochées dont une penche, regard latéral concentré et queue qui forme un point d'interrogation. **Moka** : gabarit plus circulaire, une oreille avancée, joues larges, sourcil/motif oblique et queue en virgule relevée ; sourire en coin et gestes trop enthousiastes. En silhouette noire ils doivent encore être distincts. Leurs expressions servent de *commentaire discret* au raisonnement : Nimbus observe une relation satisfaite ; Moka accueille une victoire. Leurs versions de grille simplifient les mêmes proportions sans devenir un autre style. Les illustrations actuelles sont des références à harmoniser, pas une obligation de recopier leurs yeux ou leur rendu au pixel près.

### I3. Puzzle, UI et décor : trois fonctions

| Fonction | Traitement visuel | Ce qui ne doit jamais arriver |
| --- | --- | --- |
| Cases du puzzle | Petits coussins quasi carrés, creux clair, deux valeurs lisibles par silhouette/face même sans teinte | Chat complexe qui cache la grille |
| SAME / cœur | Deux coussinets reliés par **un lien fermé** de fil, avec cœur simple en négatif au centre ; la connexion se resserre quand elle est satisfaite | Seul un cœur rouge coloré transmet l'information |
| DIFFERENT / griffes | Deux extrémités de fil **séparées par une incision en trois petites griffes** ; elles s'écartent brièvement quand la contrainte est satisfaite | Même forme que SAME avec seulement une autre couleur |
| Plaque de niveau | Pastille à deux lobes, nombre central très contrasté, expression/forme de difficulté en petit ; palier annoncé sur un support distinct | Gros badge multicolore plus voyant que le niveau courant |
| Panneau et carte | Face ivoire peu texturée, double couture courte sur un seul bord, ombre de contact ; variantes 9-slice | Image rectangulaire étirée qui déforme couture et coins |
| Bouton primaire | Volume coussin à deux lobes subtils et languette centrale, enfoncement très court | Icône ou couleur seule porte le sens |
| Décor | Bois et sisal peints avec détail local près du mobilier, jamais sur la zone des numéros | Reflets/particules permanents en concurrence avec les interactions |

Ne pas forcer le motif double sur *chaque* carte : l'utiliser sur les points de marque (niveau courant, CTA, vignette de chat, bifurcation). Les cartes denses de boutique restent majoritairement rectangulaires pour lire noms et prix. Typographie : Nunito embarquée pour interface, jeu limité de tailles et deux graisses ; chiffres de niveaux tabulaires/lisibles ; logo illustré seul porte la fantaisie typographique. Une iconographie avec même poids de trait et même lumière. Tout état clé garde texte ou forme en plus de la couleur.

**Test de reconnaissance avant verrouillage final :** trois captures anonymisées (grille, arbre, boutique) mélangées à des captures d'autres puzzles doux. Demander à cinq personnes de regrouper celles de Meowza et d'expliquer quel signe les relie. Une réponse qui ne mentionne que « c'est mignon/rose/des chats » échoue ; viser au moins quatre regroupements corrects et une référence au système de coussins liés ou à la silhouette des héros. Ce seuil est un critère de conception proposé, pas une preuve marketing universelle.

## J. Polish, animation et audio

### J1. Mouvement et retour tactile

Grammaire : **calme en réflexion, réponse nette à l'action, célébration courte au palier**. Tap : enfoncement 80–120 ms et vibration légère si activée. Placement juste : les deux lobes de la case se compriment puis se stabilisent en ~180 ms ; relation satisfaite : le fil se tend et se relâche une fois. Erreur : mauvais chat repoussé localement, cœur qui marque le choc, vibration distincte et son mat ; pas de rideau de particules. Victoire : Nimbus/Moka réagissent, deux fils convergent vers le prochain perchoir ; palier : révélation plus ample d'un habitant et installation sur l'arbre. Un seul accent animé important à la fois. Achat : aperçu → confirmation du store → droit confirmé → installation ; aucune célébration avant confirmation. Mouvements courts, réduction du mouvement respectée, pause hors champ et en arrière-plan.

### J2. Signature sonore proposée : « deux touches, un envol »

Une petite cellule de **trois notes** : deux attaques proches sur un instrument de bois feutré, puis une note plus haute, longue et légère. La même cellule donne une famille reconnaissable de feedbacks : deux touches pour une déduction, résolution ascendante à la victoire, forme plus ample quand un chat s'installe. Cela doit être composé et testé à l'oreille ; ne pas demander à une simple sinusoïde d'imiter un instrument. Le rythme global est souple, avec un léger balancement à six temps dans l'arbre, jamais une pulsation insistante pendant la logique.

| Moment | Timbres et dynamique | Intention |
| --- | --- | --- |
| Interface | « Tok » feutré de bois + contact de tissu très court ; navigation plus grave que validation | Sensation tactile sans clic plastique |
| SAME | Deux petits pincements **sur une même hauteur** qui se fondent dans un souffle de corde | Ressentir l'union sans devoir l'entendre pour jouer |
| DIFFERENT | Deux pincements à hauteurs distinctes et attaque écartée ; mini frottement de fil | Ressentir la séparation ; également distinct en mono |
| Bon placement / erreur | Petite note bois accueillante / frottement mat et chute très courte | Succès rassurant, erreur lisible mais non punitive |
| Victoire | Cellule « deux touches, un envol », terminée par une résonance chaude inférieure à 1,5 s | Signature mémorisable, qui ne ralentit pas « niveau suivant » |
| Chats | Souffle, ronron ou froissement très discret, variations courtes par tempérament ; miaulement rare | Présence vivante sans répétition agaçante |
| Arbre | Pizzicato bois, basse ronde, tissu frotté, quelques notes de kalimba légèrement désaccordées ; motif espacé | Lieu habité et léger, avec silence |
| Grille | Lit ambiant très discret de feutre/air et quelques harmoniques ; pas de mélodie à chaque ligne | Concentration et longues sessions |

Mixer sons d'interface, musique et ambiance séparément, limiter les voix simultanées, ne jamais couvrir les indications visuelles. Tester écoute muette, téléphone mono, petit haut-parleur et casque ; les règles et récompenses restent comprises sans son. La musique actuelle d'oscillateurs en boucle sert au mieux de brouillon et n'établit pas cette signature.

## K. Phaser ou Unity

**Décision provisoire : prouver Phaser, sans le déclarer vainqueur avant essai.** Phaser 3.90 dispose de tweens, particules et Nine Slice ; Capacitor emballe le jeu mobile. Les défauts observés ont d'abord des causes concrètes (assets hétérogènes, étirements, 30 FPS fixé dans `main.ts`, absence de système UI et de motion). Unity aurait des outils de composition, animation et profiling plus intégrés, mais imposerait la reconstruction des scènes, commandes et sauvegardes ainsi que le port ou l'encapsulation du solveur TypeScript. Aucune des deux options ne garantit une bonne DA à elle seule.

### K1. Cahier des charges du slice Phaser, *après* validation de cette direction

**Même DA, trois situations réellement parcourables**, sur une sauvegarde de test isolée. L'objectif est de prouver les composants et le temps d'itération, pas d'implémenter le catalogue final.

1. **Puzzle jouable :** un niveau 4×4 d'onboarding et un niveau 6×6 avec SAME et DIFFERENT, sélection Nimbus/Moka, placements, erreur, cœur, explication d'indice, victoire et passage suivant. Cases, liens, expression des héros et feedback utilisables, pas un écran figé.
2. **Fenêtre d'arbre vivante :** raccord base + continuation, niveau courant et palier, scroll tactile, au moins **deux chats dont un plaçable**, support libre, respiration, une réaction de retour et micro-mouvement maîtrisé. Tester arbre presque vide et arbre occupé ; les plaques restent lisibles.
3. **UI dense représentative :** choisir une **boutique** avec catalogue, carte de chat, aperçu du chat *dans l'arbre*, prix, catégories et états possédé/indisponible/sélectionné ; panneau avec texte court et long, jauge de progression de collection, bouton primaire/secondaire, popup de détail/confirmation et retour. Les transactions réelles peuvent être simulées dans le slice ; aucun faux achat dans une publication. Une mise en page qui résiste à la localisation et à la variation des prix.

Les trois écrans utilisent le même système de panneaux/coutures, icônes, typographie et son. Inclure sprites de prototype conformes au contrat, transitions, VFX mesurés, tap/vibration si possible, signature de victoire, micro-animations d'arbre, musique/ambiance et réglages muet/mouvement réduit. Les changements de proportions ne doivent jamais étirer un trait ou écraser une tête.

**Matrice de vérification :** petit téléphone 360 × 640, téléphone courant 390 × 844, grand téléphone 430 × 932, proportions proches sur iPhone/Android réels ; mode plein écran et barres système. Comparer écrans de capture aux compositions cibles *à taille réelle*, contrôler zones tactiles, textes tronqués, popup, scroll, mémoire, chargement, chauffe et interruptions. La cible normale est **60 FPS en interaction courante** : supprimer le plafond 30 FPS **dans le slice**, profiler dix minutes de jeu/arbre sur au moins un Android modeste et un iPhone disponible ; noter médiane, ralentissements perceptibles, mémoire et chauffe, et relier les chutes à une cause. Un appareil moins performant peut exiger un réglage de qualité mesuré, mais 30 FPS ne devient pas la norme par défaut.

**Itération cadrée :** après la première intégration, demander deux changements représentatifs — variation d'un panneau long et changement de pose/placement d'un chat — et chronométrer le temps jusqu'au résultat validé sur les trois écrans. Évaluer la facilité à changer un token visuel, réutiliser un composant et maintenir les scènes sans exceptions par appareil. Captures comparées, notes d'appareil et journal des deux changements constituent la preuve.

**Test produit du slice :** cinq nouveaux joueurs découvrent sans explication la première grille, identifient la prochaine récompense sur l'arbre et retrouvent la fiche d'un chat dans la boutique. Noter s'ils peuvent nommer un habitant préféré, ce qui le rend désirable et où ils le placeraient ; demander l'intérêt d'achat **sans afficher d'abord le prix**, puis vérifier la réaction au prix réel envisagé. Si personne ne distingue deux chats ou ne veut les exposer, corriger les personnages et l'arbre avant de créer 21 autres fiches.

### K2. Décision après le slice

| Signal | Conserver Phaser | Déclencher un comparatif Unity du même slice |
| --- | --- | --- |
| Fidélité | Les trois situations reproduisent la DA et les états sans déformations ; reconnaissables sans logo | Une limite reproductible demeure après une correction raisonnable, sur un écran entier |
| Interaction | Puzzle et arbre sont fluides et lisibles sur vrais appareils avec 60 FPS comme cible normale | Chutes persistantes ou tactile dégradé dont la cause est intrinsèque au pipeline choisi |
| Itération | Les deux changements se propagent avec des composants réutilisables | Chaque variation exige des corrections fragiles dans plusieurs scènes/appareils |
| Coût complet | Maintenance et packaging acceptables pour la taille de l'équipe | Un prototype Unity **du même périmètre** démontre une amélioration nette après comptabilisation du portage et de la maintenance |

Un échec d'asset, de cadrage ou de direction ne prouve **pas** un échec de Phaser. Si le slice Phaser manque son niveau après une expérimentation limitée et documentée, produire *seulement alors* le slice Unity identique avec les mêmes assets, objectifs, appareils, changements demandés et budget temps ; comparer le résultat, pas les vidéos marketing des moteurs. Aucune migration du jeu complet à ce stade.

Documentation technique utile : [Phaser Nine Slice](https://docs.phaser.io/phaser/concepts/gameobjects/nine-slice), [Phaser Scale Manager](https://docs.phaser.io/phaser/concepts/scale-manager), [Unity 2D workflow](https://docs.unity3d.com/6000.1/Documentation/Manual/2d-game-creation-wokflow.html), [Capacitor](https://capacitorjs.com/docs).

## L. Priorisation

Échelle qualitative : impact qualité / rétention / revenu = faible, moyen, fort ; coût et risque = faible, moyen, fort. Ces classements sont des hypothèses à invalider en playtest.

| Priorité | Livraison | Qualité | Rétention | Revenu | Coût | Risque |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | Test de cinq premières minutes et correction du tutoriel | Fort | Fort | Indirect | Moyen | Faible |
| P0 | Slice art/UI/motion/audio sur puzzle + arbre + boutique dense, responsive et 60 FPS sur appareils | Fort | Fort | Indirect | Moyen/fort | Moyen |
| P0 | Promesses honnêtes : Défi du jour, diamants, étoiles et navigation | Fort | Moyen | Indirect | Faible | Faible |
| P0 après validation du slice | 24 chats catalogués, intégrés et plaçables ; réduction du paquet | Fort | Fort | Moyen | Fort | Moyen |
| P0 si sortie commerciale | Gamme d'offres directes et achat/restauration testés en sandbox store | Moyen | Faible | Fort | Moyen/fort | Fort |
| P1 | Missions simples dont le lot a un usage réel | Moyen | Moyen | Indirect | Faible | Faible |
| P1 | Bibliothèque de sons et mini animations de personnages | Fort | Moyen | Indirect | Moyen | Moyen |
| P1 | Thème de décor additionnel et petits ensembles cohérents | Moyen | Moyen | Moyen | Moyen | Faible |
| P2 | Publicité récompensée contextuelle, après test de défaite | Faible | Moyen | Faible/moyen | Moyen | Moyen |
| P2 | Analytics et expérimentation d'offres, selon le cadre de consentement | Faible | Moyen | Fort à terme | Moyen | Moyen |
| P3 | Daily mondial, Cat Day, anti-cheat, monnaie premium, événements continus | Moyen | Incertain | Incertain | Fort | Fort |
| P3 | Extension du catalogue au-delà des 24 et saisons régulières | Moyen | Incertain | Incertain | Fort | Moyen |

## M. Séquence de production et critères de décision

1. **Valider la présente direction sur papier.** Trancher la grammaire « deux coussins, un lien », la cible 24 (18 gratuits/6 premium), la gamme d'achats directs, les règles de densité de l'arbre et la cellule sonore ; ne pas lancer 24 créations avant le slice.
2. **Tester 5 personnes neuves** sans explication : première action, première victoire, compréhension SAME/DIFFERENT, intérêt du prochain palier. Noter les gestes et les abandons, pas seulement leurs avis.
3. **Produire le slice de preuve du §K** : puzzle, fenêtre d'arbre, boutique dense, son, interaction, appareils et 60 FPS. Démontrer fidélité, réutilisation et temps d'itération avant d'accepter le moteur.
4. **Décliner le système validé** aux scènes indispensables et aux 24 chats par lots. Traiter les anciennes sauvegardes et objets, supprimer du paquet les assets inactifs.
5. **Tester l'économie et le commerce** : dépenses d'indices, visibilité des lots, achats en sandbox, restauration, cas hors ligne et changement d'appareil selon la stratégie de compte. Ne pas publier un bouton d'achat fictif.
6. **Recette appareils et petite diffusion** : Android/iOS, petits et grands écrans, pause/reprise, crashs, performances, bruit/coupure audio, navigation et fiche store. Un lancement limité mesure la première session et l'envie de revenir avant d'investir dans Daily serveur ou 40 chats supplémentaires.

Cadre de temps **indicatif**, pour un petit projet mené en parallèle d'un emploi : 1–2 jours de préparation et cinq tests ; **2–3 semaines** pour le slice de trois situations ; **4–8 semaines** pour produire, intégrer et contrôler les 24 chats et la gamme d'offres si les quatre familles de silhouettes tiennent leur promesse ; 1–2 semaines de recette et publication. Le volume artistique et l'intégration native peuvent allonger ces enveloppes : les jalons après le slice restent conditionnels. Après le slice, arrêter ou recadrer si la qualité sur appareil et l'envie des testeurs n'augmentent pas visiblement. Après la petite diffusion, investir dans Daily/Live Ops seulement si les joueurs reviennent et qu'une offre suscite un intérêt réel.

**Décision proposée :** poursuivre Meowza avec Phaser et l'arbre comme cœur de la collection ; simplifier radicalement la méta visible ; prouver la qualité sur un slice avant toute production massive. Le principal risque n'est pas de manquer de fonctionnalités, mais de produire beaucoup de contenu que l'expérience actuelle ne donne pas envie de regarder ou d'acheter.

### Limites de cet audit

Code, docs, manifests et illustrations examinés ; build et tests locaux effectués. Le navigateur de prévisualisation de cet environnement ne peut pas ouvrir le serveur local : aucun parcours tactile en situation ni mesure réelle FPS/chauffe n'a été réalisé. Les avis sur la qualité perçue des écrans complets restent des hypothèses issues de l'assemblage du code et des assets, à confirmer sur appareil et avec des joueurs. Aucun changement de gameplay ou d'asset n'a été implémenté.

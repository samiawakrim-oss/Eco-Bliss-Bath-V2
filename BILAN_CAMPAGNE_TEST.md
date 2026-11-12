# Bilan de campagne de test - Eco-Bliss-Bath

| Nom | Fonction | Version | Signature |
|-----|----------|---------|-----------|
| Samia WAKRIM | Testeur Logiciel | 1.0 | Samia WAKRIM |

## Contexte

Cette campagne a été effectuée dans le cadre du projet OpenClassrooms "Automatisez des tests pour une boutique en ligne".
Site testé : Eco-Bliss-Bath-V2, boutique en ligne de produits de bain écologiques.
Campagne réalisée seule par 1 personne : Samia WAKRIM, en tant que testeur logiciel.
Tests effectués : tests manuels via Swagger pour l'exploration de l'API + tests automatisés avec Cypress 16.3.0.
Navigateur : Electron (mode headless via `npx cypress run`) et Chrome (via `npx cypress open`).
Environnement : Frontend http://localhost:4200, API http://localhost:8081.
Compte de test : samia@test.com / Test1234!

## Objectif(s)

Objectif principal : Vérifier que les parcours critiques de la boutique fonctionnent : affichage produits, connexion, inscription, panier, et API (login, commandes, produits, avis).
Objectifs mineurs : Vérifier la sécurité avec un test XSS sur les avis, et détecter les anomalies de l'API.

## Tests effectués

16 tests automatisés avec Cypress, tous reproductibles avec `cd frontend` puis `npx cypress run` :

- produits.cy.ts (2) : affiche les produits, affiche le détail d'un produit
- connexion.cy.ts (2) : ouvre la page connexion, affiche les champs email et mot de passe
- inscription.cy.ts (2) : ouvre la page inscription, affiche les champs du formulaire
- panier.cy.ts (1) : ajoute un produit au panier
- api.cy.ts (8) : login inconnu -> 401, login connu -> 200 + token, GET /orders sans token -> 401, PUT /orders/add produit dispo -> 200, PUT /orders/add produit en rupture -> 200 (anomalie), GET /orders avec token -> 200, GET /products/3 -> fiche produit, POST /reviews -> 200
- xss.cy.ts (1) : injection `<script>alert('XSS')</script>` dans un avis

## Résultats des tests

Résultat obtenu : 16/16 passing, 0 failing.

Comparaison attendu / obtenu :
- Tous les tests UI passent comme attendu.
- Tests API : 7/8 passent comme attendu, 1 test met en évidence une anomalie (produit en rupture accepté).
- Test XSS : attendu = pas d'exécution du script. Obtenu = commentaire affiché vide, aucune alerte ne se déclenche. Script neutralisé par la sanitization d'Angular. Non vulnérable.

### Anomalies / Rapports d'incident

**Anomalie 1 - GET /orders panier vide : 404 au lieu de 200**
Reproduction : Se connecter, ne rien ajouter au panier, faire GET /orders avec token -> 404. Après PUT /orders/add, GET /orders -> 200. Attendu : 200 avec liste vide [].

**Anomalie 2 - PUT /orders/add produit en rupture : 200 au lieu de 400**
Reproduction : PUT /orders/add avec produit 4 (stock -1) -> 200, produit ajouté. Attendu : 400 ou erreur.

**Anomalie 3 - Stocks négatifs**
Produit 3 : availableStock = -16, Produit 4 : -1. Attendu : stock >= 0.

**Anomalie 4 - PUT vs POST**
Documenté POST /orders/add dans Swagger, implémenté en PUT.

**Anomalie 5 - GET /orders sans token : 401 au lieu de 403**
Accès refusé comme attendu, seul le code diffère de la spécification.

**Anomalie 6 - Expiration token**
Après un certain temps, API retourne "Expired JWT Token". Il faut se reconnecter.

## Confiance

Confiance moyenne dans la version.
Les parcours principaux fonctionnent, et aucune faille XSS n'a été trouvée.
Mais je n'ai pas totalement confiance à cause des anomalies majeures sur le panier et les stocks (anomalies 1, 2, 3) : un utilisateur peut commander un produit indisponible, et un panier vide est traité comme une erreur.
Anomalies à corriger le plus rapidement : n°2 (produit en rupture accepté) et n°3 (stocks négatifs), car elles impactent directement les commandes et les clients.

## I. Recommandations

### A. Tests à automatiser - Les 2 tests les plus critiques

**1. Test API : Ajout au panier d'un produit en rupture**
Pourquoi critique : Il vérifie qu'on ne peut pas vendre un produit indisponible. C'est le test qui a détecté l'anomalie la plus grave (200 au lieu de 400). Choisi parce qu'il protège directement le chiffre d'affaires et la satisfaction client.

**2. Test UI : Parcours panier complet**
Pourquoi critique : Il vérifie le parcours d'achat de bout en bout : voir produit -> ajouter au panier -> vérifier panier. Choisi parce que c'est le parcours qui rapporte de l'argent, si le panier ne marche pas, la boutique ne vend pas.

### B. Préconisations pour la suite

- Corriger en priorité les stocks négatifs et le refus des produits en rupture.
- Corriger GET /orders pour retourner 200 avec [] quand le panier est vide.
- Mettre à jour la documentation Swagger (PUT vs POST, 401 vs 403).
- Garder les 16 tests automatisés et les lancer à chaque nouvelle version (non-régression).
- Automatiser aussi : connexion avec mauvais mot de passe, inscription avec email déjà utilisé, et suppression d'un produit du panier. Ils valent le coup d'être automatisés car ils sont rejoués à chaque release.
# Eco-Bliss-Bath-V2 - Tests automatisés

Projet OpenClassrooms - Automatisez des tests pour une boutique en ligne.
Boutique Eco-Bliss-Bath : produits de bain écologiques.

Testeuse : Samia WAKRIM

## Prérequis

- Docker
- Node.js
- Un compte de test : samia@test.com / Test1234!
  (à créer avec la page d'inscription du site s'il n'existe pas)

## Installation et lancement de l'application

```bash
# 1. Lancer la base de données et l'API avec Docker
docker compose up -d

# 2. Lancer le frontend
cd frontend
npm install
npm start
```

Le site est sur http://localhost:4200 et l'API sur http://localhost:8081.
Il faut que le site et l'API tournent avant de lancer les tests.

## Lancer les tests Cypress

```bash
cd frontend

# Mode interactif (on voit les tests s'exécuter)
npx cypress open

# Mode terminal (tous les tests d'un coup)
npx cypress run

# Mode terminal avec Chrome (Electron est annoncé comme obsolète)
npx cypress run --browser chrome

# Un seul fichier
npx cypress run --spec cypress/e2e/api.cy.ts
```

## Structure des tests

```
frontend/cypress/
├── e2e/
│   ├── api.cy.ts        -> tests de l'API (10 tests)
│   ├── smoke.cy.ts      -> smoke tests (4 tests)
│   ├── xss.cy.ts        -> faille XSS (2 tests)
│   ├── connexion.cy.ts  -> scénario fonctionnel : connexion (5 tests)
│   └── panier.cy.ts     -> scénario fonctionnel : panier (2 tests)
└── support/
    ├── fonctions.ts     -> fonctions réutilisables (token, connexion, panier...)
    └── e2e.ts           -> fichier de support Cypress
```

## Résultats

**23 tests : 20 verts et 3 rouges.**

Les 3 tests rouges sont voulus. Ils montrent 3 anomalies de l'application :

| Test | Anomalie |
|------|----------|
| api.cy.ts : produit en rupture | L'API accepte un produit en rupture (200 au lieu de 400 à 499) |
| api.cy.ts : aucun stock négatif | Des produits ont un stock négatif (exemple : -17) |
| panier.cy.ts : quantité supérieure à 20 | L'API accepte une quantité de 21 (la limite est 20) |

Ces tests deviendront verts quand l'équipe de développement aura corrigé ces anomalies.

## Remarques

- Les tests modifient des données : ils ajoutent des produits au panier et des avis.
  Le test du panier vide d'abord le panier avant de commencer.
- Les repères du site (attributs data-cy) sont regroupés dans `support/fonctions.ts`.
  Si un test ne trouve plus un élément, il suffit de le corriger à cet endroit.

## Bilan de campagne

Voir le fichier `BILAN_CAMPAGNE_TEST.pdf`
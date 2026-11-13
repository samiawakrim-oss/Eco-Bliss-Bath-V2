# Eco-Bliss-Bath-V2 - Tests automatisés

Projet OpenClassrooms - Automatisez des tests pour une boutique en ligne.
Boutique Eco-Bliss-Bath : produits de bain écologiques.

Testeur : Samia WAKRIM

## Prérequis

- Docker
- Node.js
- Compte de test : samia@test.com / Test1234!

## Installation et lancement de l'application

```bash
# 1. Lancer la base de données et l'API avec Docker
docker compose up -d

# 2. Lancer le frontend
cd frontend
npm install
npm start

```

## Lancer les tests Cypress

```bash
cd frontend

# Mode interactif (on voit les tests s'exécuter)
npx cypress open

# Mode terminal (tous les tests d'un coup)
npx cypress run

# Un seul fichier
npx cypress run --spec cypress/e2e/api.cy.ts

```
## Structure des tests

frontend/cypress/e2e/
├── produits.cy.ts -> (2 tests)
├── connexion.cy.ts -> (2 tests)
├── inscription.cy.ts -> (2 tests)
├── panier.cy.ts -> (1 test)
├── api.cy.ts -> (8 tests)
└── xss.cy.ts -> (1 test)


## Résultats

**16/16 tests verts - 0 failing**

## Bilan de campagne

Voir le fichier `BILAN_CAMPAGNE_TEST.md`


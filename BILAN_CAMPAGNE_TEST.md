# Bilan de campagne de test - Eco-Bliss-Bath

**Projet :** Eco-Bliss-Bath-V2 - Automatisez des tests pour une boutique en ligne
**Testeur :** Samia WAKRIM
**Outil :** Cypress 16.3.0
**Environnement :** Frontend http://localhost:4200 - API http://localhost:8081
**Compte de test :** samia@test.com

## 1. Périmètre testé

- Affichage des produits et fiche détail produit
- Connexion
- Inscription
- Panier
- API : Login, Commandes (orders), Produits, Avis (reviews)
- Sécurité : Faille XSS dans les avis

## 2. Résultats globaux

| Fichier | Tests | Résultat |
|---------|-------|----------|
| produits.cy.ts | 2 | ✅ 2 passing |
| connexion.cy.ts | 2 | ✅ 2 passing |
| inscription.cy.ts | 2 | ✅ 2 passing |
| panier.cy.ts | 1 | ✅ 1 passing |
| api.cy.ts | 8 | ✅ 8 passing |
| xss.cy.ts | 1 | ✅ 1 passing |
| **TOTAL** | **16** | **✅ 16 passing - 0 failing** |

Commande utilisée :
```bash
cd frontend
npx cypress run
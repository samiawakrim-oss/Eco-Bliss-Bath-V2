import {
  CHAMP_EMAIL,
  CHAMP_MOT_DE_PASSE,
  BOUTON_CONNEXION,
  CHAMP_STOCK,
  seConnecter,
} from '../support/fonctions'

// SMOKE TESTS : on vérifie seulement que les éléments importants sont là.
describe('Smoke tests', () => {

  it('la page de connexion affiche les champs et le bouton', () => {
    // Ouvre la page de connexion
    cy.visit('/#/login')
    // Vérifie que le champ email est visible
    cy.get(CHAMP_EMAIL).should('be.visible')
    // Vérifie que le champ mot de passe est visible
    cy.get(CHAMP_MOT_DE_PASSE).should('be.visible')
    // Vérifie que le bouton de connexion est visible
    cy.get(BOUTON_CONNEXION).should('be.visible')
  })

  it('la liste des produits s\'affiche', () => {
    // Ouvre la page des produits
    cy.visit('/#/products')
    // Un bouton "Consulter" est visible : les produits sont affichés
    cy.contains('Consulter').should('be.visible')
  })

  it('le bouton Ajouter au panier est présent quand on est connecté', () => {
    // Je me connecte avec ma fonction
    seConnecter()
    // Je vais sur la liste des produits
    cy.visit('/#/products')
    // J'ouvre le premier produit
    cy.contains('Consulter').first().click()
    // Le bouton d'ajout au panier est visible
    cy.contains('Ajouter au panier').should('be.visible')
  })

  it('le champ de disponibilité du produit est présent', () => {
    // Je vais sur la liste des produits
    cy.visit('/#/products')
    // J'ouvre le premier produit
    cy.contains('Consulter').first().click()
    // Le champ de stock est visible
    cy.get(CHAMP_STOCK).should('be.visible')
  })

})
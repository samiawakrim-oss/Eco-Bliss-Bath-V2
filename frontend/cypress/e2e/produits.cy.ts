describe('Eco-Bliss - Produits', () => {

  // Test 1 : vérifier l'affichage des produits
  it('affiche les produits', () => {

    // Ouvrir la page d'accueil
    cy.visit('http://localhost:4200')

    // Vérifier la présence du texte
    cy.contains('Il y en a pour tous les gouts')
      .should('exist')

    // Cliquer sur le bouton Voir les produits
    cy.contains('Voir les produits').click()

  })

  // Test 2 : vérifier le détail d'un produit
  it('affiche le détail d un produit', () => {

    // Accéder à la page des produits
    cy.visit('http://localhost:4200/#/products')

    // Cliquer sur le premier bouton Consulter
    cy.contains('Consulter').first().click()

  })

})
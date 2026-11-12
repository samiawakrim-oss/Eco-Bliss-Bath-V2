
describe('Inscription Eco-Bliss', () => {

  // Test 1 : vérifier l'ouverture de la page d'inscription
  it('ouvre la page inscription', () => {

    // Accéder à la page d'inscription
    cy.visit('http://localhost:4200/#/register')

    // Vérifier que le formulaire est affiché
    cy.get('form').should('be.visible')

  })

  // Test 2 : vérifier la présence des champs d'inscription
  it('affiche les champs du formulaire', () => {

    // Accéder à la page d'inscription
    cy.visit('http://localhost:4200/#/register')

    // Vérifier les champs du formulaire
    cy.get('[data-cy="register-input-lastname"]').should('be.visible')
    cy.get('[data-cy="register-input-firstname"]').should('be.visible')
    cy.get('[data-cy="register-input-email"]').should('be.visible')
    cy.get('[data-cy="register-input-password"]').should('be.visible')
    cy.get('[data-cy="register-input-password-confirm"]').should('be.visible')

    // Vérifier le bouton d'inscription
    cy.contains("S'inscrire").should('be.visible')

  })

})


describe('Connexion Eco-Bliss', () => {

  // Test 1 : vérifier l'ouverture de la page de connexion
  it('ouvre la page connexion', () => {

    // Accéder à la page d'accueil
    cy.visit('http://localhost:4200')

    // Cliquer sur Connexion
    cy.contains('Connexion').click()

    // Vérifier que le formulaire est affiché
    cy.get('form').should('be.visible')

  })

  // Test 2 : vérifier la présence des champs de connexion
  it('affiche les champs email et mot de passe', () => {

    // Accéder directement à la page de connexion
    cy.visit('http://localhost:4200/#/login')

    // Vérifier la présence des éléments
    cy.contains('Email').should('exist')
    cy.contains('Mot de passe').should('exist')
    cy.contains('Se connecter').should('exist')

  })

})

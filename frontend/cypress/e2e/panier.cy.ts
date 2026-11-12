
import { faker } from '@faker-js/faker'

describe('Panier Eco-Bliss', () => {

  it('ajoute un produit au panier', () => {

    // 1. Générer des informations pour créer un compte
    const nom = faker.person.lastName()
    const prenom = faker.person.firstName()
    const email = faker.internet.email()
    const password = 'Test1234!'

    // 2. Accéder à la page d'inscription
    cy.visit('http://localhost:4200/#/register')

    // 3. Remplir le formulaire d'inscription
    cy.get('[data-cy="register-input-lastname"]').type(nom)
    cy.get('[data-cy="register-input-firstname"]').type(prenom)
    cy.get('[data-cy="register-input-email"]').type(email)
    cy.get('[data-cy="register-input-password"]').type(password)
    cy.get('[data-cy="register-input-password-confirm"]').type(password)

    // 4. Valider l'inscription
    cy.contains('button', "S'inscrire").click()

    // Vérifier que l'utilisateur est connecté
    cy.contains('Mon panier').should('exist')

    // 5. Accéder à la liste des produits
    cy.visit('http://localhost:4200/#/products')

    // 6. Consulter le premier produit
    cy.contains('Consulter').first().click()
    cy.wait(2000)
    // 7. Ajouter le produit au panier
    cy.contains('Ajouter au panier')
      .should('be.visible')
      .and('be.enabled')
      .click()
    cy.wait(2000)  

    cy.contains('Mon panier').click()

    // 8. Vérifier que l'utilisateur est redirigé vers le panier
    cy.url().should('include', '#/cart')

    // 9. Vérifier le contenu du panier
    cy.contains('Commande').should('exist')
    cy.contains('Vos informations').should('exist')
    cy.contains('Votre panier est vide').should('not.exist')

  })

})

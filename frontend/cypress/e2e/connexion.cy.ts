import { EMAIL, MOT_DE_PASSE, CHAMP_EMAIL, CHAMP_MOT_DE_PASSE, BOUTON_CONNEXION } from '../support/fonctions'

// TESTS DE CONNEXION : le cas qui marche et les cas d'erreur.
describe('Connexion', () => {

  // Avant chaque test, je pars de la page de connexion
  beforeEach(() => {
    cy.visit('/#/login')
  })

  it('depuis l\'accueil, le bouton Connexion ouvre le formulaire', () => {
    // Je pars de la page d'accueil
    cy.visit('/')
    // Je clique sur "Connexion" dans le menu
    cy.contains('Connexion').click()
    // Résultat attendu : la page de connexion s'affiche avec ses champs
    cy.url().should('include', '#/login')
    cy.get(CHAMP_EMAIL).should('be.visible')
  })

  it('un utilisateur valide se connecte et voit le panier', () => {
    // Je surveille la requête de connexion envoyée à l'API
    cy.intercept('POST', '**/login').as('connexion')
    cy.get(CHAMP_EMAIL).type(EMAIL)
    cy.get(CHAMP_MOT_DE_PASSE).type(MOT_DE_PASSE)
    cy.get(BOUTON_CONNEXION).click()
    // L'API doit répondre 200 (connexion réussie)
    cy.wait('@connexion').its('response.statusCode').should('eq', 200)
    // Résultat attendu : le lien "Mon panier" apparaît
    cy.contains('Mon panier').should('be.visible')
  })

  it('un mauvais mot de passe est refusé', () => {
    cy.intercept('POST', '**/login').as('connexion')
    cy.get(CHAMP_EMAIL).type(EMAIL)
    cy.get(CHAMP_MOT_DE_PASSE).type('mauvais-mot-de-passe')
    cy.get(BOUTON_CONNEXION).click()
    // L'API doit répondre 401 (accès refusé)
    cy.wait('@connexion').its('response.statusCode').should('eq', 401)
    // Je reste sur la page de connexion
    cy.url().should('include', '#/login')
    // Et je ne suis pas connectée : pas de lien "Mon panier"
    cy.contains('Mon panier').should('not.exist')
  })

  it('un email inconnu est refusé', () => {
    cy.get(CHAMP_EMAIL).type('inconnu@test.com')
    cy.get(CHAMP_MOT_DE_PASSE).type('Faux1234!')
    cy.get(BOUTON_CONNEXION).click()
    cy.url().should('include', '#/login')
    cy.contains('Mon panier').should('not.exist')
  })

  it('le mot de passe est masqué pendant la saisie', () => {
    // Le champ doit être de type "password" (on voit des points, pas le texte)
    cy.get(CHAMP_MOT_DE_PASSE).should('have.attr', 'type', 'password')
  })

})
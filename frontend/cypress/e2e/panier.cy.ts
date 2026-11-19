import { API, recupererToken, seConnecter, viderPanier, lireStock, lirePanier, ajouterAuPanier } from '../support/fonctions'

// TEST DU PANIER : un seul test qui suit tout le parcours d'achat.
describe('Panier', () => {
  let token: string
  let produit: any
  // Place du produit dans la liste (0 = le premier)
  let place = 0

  // Avant le test : je me connecte par l'API et je choisis un produit disponible
  before(() => {
    recupererToken().then((t) => {
      token = t
    })
    cy.request(API + '/products').then((reponse) => {
      // Je cherche la place d'un produit avec un stock supérieur à 1
      place = reponse.body.findIndex((p: any) => p.availableStock > 1)
      produit = reponse.body[place]
    })
    seConnecter()
    viderPanier()
  })

  it('parcours complet : produit disponible, ajout, panier, stock et limites', () => {
    let stockAvant = 0

    // Étape 1 : je me connecte
    seConnecter()

    // Étape 2 : je récupère le stock frais, juste avant d'ajouter, après le vidage du panier
    cy.request(API + '/products/' + produit.id).then((reponse) => {
      stockAvant = reponse.body.availableStock
      expect(stockAvant, 'le produit doit être disponible').to.be.greaterThan(1)
    })

    // Étape 3 : j'ajoute le produit au panier, comme un vrai client
    cy.contains('Produits').click()
    // J'ouvre la fiche du produit avec son bouton "Consulter"
    cy.get('a, button')
      .filter((i, el) => el.textContent?.trim() === 'Consulter')
      .eq(place)
      .click()
    cy.url().should('include', '#/products/' + produit.id)
    // je mets la quantité avant de cliquer, sinon le formulaire est invalide et le clic ne fait rien
    cy.get('[data-cy="detail-product-quantity"]').clear().type('1')
    cy.get('[data-cy="detail-product-add"]').should('be.visible').click()
    cy.wait(2000)
    // Le site ne va pas tout seul au panier, j'y vais moi-même
    cy.contains('Mon panier').click()
    cy.url().should('include', '#/cart')

    // Étape 4 : je vérifie le panier sur le site
    cy.contains(produit.name).should('be.visible')

    // Étape 5 : je vérifie le panier avec l'API
    lirePanier(token).then((reponse) => {
      expect(reponse.status).to.eq(200)
      const noms = reponse.body.orderLines.map((ligne: any) => ligne.product.name)
      expect(noms).to.include(produit.name)
    })

    // Étape 6 : je regarde la fiche du produit : le stock affiché a baissé de 1
    cy.visit('/#/products/' + produit.id)
    // J'attends que la fiche soit vraiment chargée avant de lire le stock
    cy.contains(produit.name).should('be.visible')
    cy.wait(2000)
    lireStock().then((stockApres) => {
      expect(stockApres).to.eq(stockAvant - 1)
    })

    // Étape 7 : je vérifie aussi le stock avec l'API
    cy.request(API + '/products/' + produit.id).then((reponse) => {
      expect(reponse.body.availableStock).to.eq(stockAvant - 1)
    })

    // Étape 8 : une quantité négative doit être refusée
    ajouterAuPanier(token, produit.id, -1).then((reponse) => {
      expect(reponse.status).to.be.within(400, 499)
    })
  })

  // Deuxième test : la limite de 20 (au-dessus de 20, la quantité doit être refusée)
  it('une quantité supérieure à 20 doit être refusée', () => {
    ajouterAuPanier(token, produit.id, 21).then((reponse) => {
      // Attendu : une erreur (400 à 499). Si l'API répond 200, le test échoue : anomalie 6
      expect(reponse.status).to.be.within(400, 499)
    })
  })
})
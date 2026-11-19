import { API, EMAIL, MOT_DE_PASSE, recupererToken, ajouterAuPanier, lirePanier } from '../support/fonctions'

// TESTS API : on parle directement au serveur, sans passer par le site.
describe('API', () => {
  // Ces deux variables sont remplies avant les tests
  let token: string
  let produits: any[]

  // Avant les tests : je me connecte et je récupère la liste des produits
  before(() => {
    recupererToken().then((t) => {
      token = t
    })
    cy.request(API + '/products').then((reponse) => {
      produits = reponse.body
    })
  })

  it('login utilisateur inconnu -> 401', () => {
    cy.request({
      method: 'POST',
      url: API + '/login',
      body: { username: 'inconnu@test.com', password: 'Faux1234!' },
      // Sans cette ligne, Cypress s'arrête dès qu'il reçoit une erreur
      failOnStatusCode: false,
    }).then((reponse) => {
      // Résultat attendu : accès refusé
      expect(reponse.status).to.eq(401)
    })
  })

  it('login utilisateur connu -> 200 + token', () => {
    cy.request({
      method: 'POST',
      url: API + '/login',
      body: { username: EMAIL, password: MOT_DE_PASSE },
    }).then((reponse) => {
      // Résultat attendu : connexion réussie et un token reçu
      expect(reponse.status).to.eq(200)
      expect(reponse.body).to.have.property('token')
    })
  })

  it('GET /orders sans token -> 401', () => {
    cy.request({
      method: 'GET',
      url: API + '/orders',
      failOnStatusCode: false,
    }).then((reponse) => {
      // 401 = personne non connectée (la spécification parlait de 403 : anomalie 5)
      expect(reponse.status).to.eq(401)
    })
  })

  it('PUT /orders/add produit disponible -> 200', () => {
    // Je cherche un produit qui a du stock
    const produit = produits.find((p) => p.availableStock > 1)
    ajouterAuPanier(token, produit.id, 1).then((reponse) => {
      expect(reponse.status).to.eq(200)
    })
  })

  it('PUT /orders/add produit en rupture -> doit être refusé', () => {
    // Je cherche un produit dont le stock est à 0 ou moins
    const produit = produits.find((p) => p.availableStock <= 0)
    expect(produit, 'il faut un produit en rupture').to.exist
    ajouterAuPanier(token, produit.id, 1).then((reponse) => {
      // Attendu : une erreur (400 à 499). Si l'API répond 200, le test échoue : anomalie 1
      expect(reponse.status).to.be.within(400, 499)
    })
  })

  it('GET /orders avec token -> 200', () => {
    // Je m'assure que le panier n'est pas vide (un panier vide renvoie 404 : anomalie 3)
    const produit = produits.find((p) => p.availableStock > 1)
    ajouterAuPanier(token, produit.id, 1)
    lirePanier(token).then((reponse) => {
      expect(reponse.status).to.eq(200)
    })
  })

  it('GET /products -> chaque produit a ses champs', () => {
    cy.request(API + '/products').then((reponse) => {
      expect(reponse.status).to.eq(200)
      // Je vérifie TOUS les produits, un par un
      reponse.body.forEach((produit: any) => {
        expect(produit).to.have.property('id')
        expect(produit).to.have.property('name')
        expect(produit).to.have.property('price')
        expect(produit).to.have.property('availableStock')
      })
    })
  })

  it('GET /products -> aucun stock négatif', () => {
    cy.request(API + '/products').then((reponse) => {
      reponse.body.forEach((produit: any) => {
        // Un stock ne peut pas être inférieur à 0 : sinon, anomalie 2
        expect(produit.availableStock).to.be.at.least(0)
      })
    })
  })

  it('GET /products/{id} -> fiche d\'un produit', () => {
    cy.request(API + '/products/' + produits[0].id).then((reponse) => {
      expect(reponse.status).to.eq(200)
      expect(reponse.body).to.have.property('name')
    })
  })

  it('POST /reviews -> 200', () => {
    cy.request({
      method: 'POST',
      url: API + '/reviews',
      headers: { Authorization: 'Bearer ' + token },
      body: { title: 'Super savon', comment: 'Test API', rating: 5 },
    }).then((reponse) => {
      expect(reponse.status).to.eq(200)
      expect(reponse.body).to.have.property('title', 'Super savon')
    })
  })
})
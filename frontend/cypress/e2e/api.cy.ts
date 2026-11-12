describe('API Eco-Bliss', () => {

  // Adresse du serveur backend
  const API_URL = 'http://localhost:8081'

  // Variable qui va contenir le token
  let token = ''

  // Avant les tests, récupérer un token de connexion
  before(() => {
    cy.request({
      method: 'POST',
      url: `${API_URL}/login`,
      body: {
        username: 'samia@test.com',
        password: 'Test1234!'
      }
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('token')
      token = res.body.token
    })
  })

  // TEST 1 : connexion avec un utilisateur inconnu
  it('Login utilisateur inconnu -> 401', () => {
    cy.request({
      method: 'POST',
      url: `${API_URL}/login`,
      body: {
        username: 'inconnu@test.com',
        password: 'Faux1234!'
      },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('message', 'Invalid credentials.')
    })
  })

  // TEST 2 : connexion avec un utilisateur connu
  it('Login utilisateur connu -> 200 + token', () => {
    cy.request({
      method: 'POST',
      url: `${API_URL}/login`,
      body: {
        username: 'samia@test.com',
        password: 'Test1234!'
      }
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('token')
    })
  })

  // TEST 3 : accéder aux commandes sans token
  it('GET /orders sans token -> 401', () => {
    cy.request({
      method: 'GET',
      url: `${API_URL}/orders`,
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  // TEST 4 : ajouter un produit dispo au panier
  // On le met AVANT le GET /orders, pour que GET trouve une commande
  it('PUT /orders/add produit dispo -> 200', () => {
    cy.request({
      method: 'PUT',
      url: `${API_URL}/orders/add`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        product: 3,
        quantity: 1
      }
    }).then((res) => {
      // Vérifier que le panier est mis à jour
      expect(res.status).to.eq(200)
    })
  })

// TEST 5 : ajouter un produit en rupture de stock
  // Anomalie : le produit 4 a un stock de -1 (rupture)
  // L'API devrait refuser, mais elle retourne 200 et l'ajoute
  it('PUT /orders/add produit en rupture -> 200 mais anomalie', () => {
    cy.request({
      method: 'PUT',
      url: `${API_URL}/orders/add`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        product: 4,
        quantity: 1
      }
    }).then((res) => {
      // Comportement réel : 200, même en rupture
      // Comportement attendu : erreur 400 ou 403
      expect(res.status).to.eq(200)
    })
  })

  // TEST 6 : accéder aux commandes avec un token
  it('GET /orders avec token -> 200', () => {
    cy.request({
      method: 'GET',
      url: `${API_URL}/orders`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  // TEST 7 : récupérer un produit
  it('GET /products/3 -> fiche produit', () => {
    cy.request({
      method: 'GET',
      url: `${API_URL}/products/3`
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('name')
    })
  })

  // TEST 8 : ajouter un avis
  it('POST /reviews -> 200', () => {
    cy.request({
      method: 'POST',
      url: `${API_URL}/reviews`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        title: 'Super savon',
        comment: 'Super savon, test API',
        rating: 5
      }
    }).then((res) => {
      // Vérifier que l'avis est créé
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('title', 'Super savon')
    })
  })
  
})


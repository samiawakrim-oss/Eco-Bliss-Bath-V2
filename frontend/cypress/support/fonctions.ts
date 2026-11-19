// Adresse de l'API
export const API = 'http://localhost:8081'

// Compte 
export const EMAIL = 'samia@test.com'
export const MOT_DE_PASSE = 'Test1234!'

// Repères du site (attributs data-cy). Si un test ne trouve pas un élément,
// je vérifie avec F12 et je corrige ici, une seule fois.
export const CHAMP_EMAIL = '[data-cy="login-input-username"]'
export const CHAMP_MOT_DE_PASSE = '[data-cy="login-input-password"]'
export const BOUTON_CONNEXION = '[data-cy="login-submit"]'
export const CHAMP_STOCK = '[data-cy="detail-product-stock"]'

// ===== Fonctions  =====

// Fonction 1 : se connecter par l'API et récupérer le token
export function recupererToken() {
  return cy
    .request({
      method: 'POST',
      url: API + '/login',
      body: { username: EMAIL, password: MOT_DE_PASSE },
    })
    .then((reponse) => reponse.body.token)
}

// Fonction 2 : se connecter par la page de connexion
export function seConnecter() {
    cy.visit('/#/login')
    cy.get(CHAMP_EMAIL).type(EMAIL)
    cy.get(CHAMP_MOT_DE_PASSE).type(MOT_DE_PASSE)
    cy.get(BOUTON_CONNEXION).click()
    // Après la connexion, le site recharge la page d'accueil (l'adresse finit par #/)
    // J'attends que ce soit terminé avant de continuer
    cy.url().should('match', /#\/$/)
    // Preuve qu'on est connecté : le lien "Mon panier" apparaît
    cy.contains('Mon panier').should('exist')
}

// Fonction 3 : ajouter un produit au panier par l'API (c'est un PUT)
export function ajouterAuPanier(token: string, idProduit: number, quantite: number) {
  return cy.request({
    method: 'PUT',
    url: API + '/orders/add',
    headers: { Authorization: 'Bearer ' + token },
    body: { product: idProduit, quantity: quantite },
    // Permet de tester aussi les erreurs (400, 403...) sans que Cypress s'arrête
    failOnStatusCode: false,
  })
}

// Fonction 4 : lire le panier par l'API
export function lirePanier(token: string) {
  return cy.request({
    method: 'GET',
    url: API + '/orders',
    headers: { Authorization: 'Bearer ' + token },
    failOnStatusCode: false,
  })
}

// Fonction 5 : lire le stock affiché sur la fiche produit
export function lireStock() {
  return cy
    .get(CHAMP_STOCK, { timeout: 10000 })
    .should('be.visible')
    .invoke('text')
    .then((texte) => {
      // On cherche le premier chiffre dans le texte, même si c'est "12 en stock"
      const match = String(texte).match(/(\d+)/)
      // Si on trouve un chiffre, on le renvoie, sinon 0
      return match ? parseInt(match[1]) : 0
    })
}

// Fonction 6 : vider le panier par l'UI (clique sur les poubelles)
export function viderPanier() {
  cy.visit('/#/cart')
  cy.wait(1000)

  function supprimer() {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="cart-line-delete"]').length > 0) {
        cy.get('[data-cy="cart-line-delete"]').first().click()
        cy.wait(1000)
        supprimer()
      }
    })
  }
  supprimer()
}
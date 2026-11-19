import { API, recupererToken } from '../support/fonctions'

// TEST XSS : un script écrit dans un avis ne doit jamais s'exécuter.
describe('Faille XSS', () => {
  // Le script piège : il affiche une alerte s'il s'exécute
  const script = "<script>alert('XSS')</script>"
  let token: string

  // Avant les tests : je me connecte par l'API
  before(() => {
    recupererToken().then((t) => {
      token = t
    })
  })

  it('API : un avis avec un script est accepté et stocké comme du texte', () => {
    cy.request({
      method: 'POST',
      url: API + '/reviews',
      headers: { Authorization: 'Bearer ' + token },
      body: { title: 'Test XSS', comment: script, rating: 5 },
    }).then((reponse) => {
      expect(reponse.status).to.eq(200)
      // Le texte est gardé tel quel : la protection se fait à l'affichage
      expect(reponse.body.comment).to.eq(script)
    })
  })

  it('Site : le script de l\'avis ne s\'exécute pas', () => {
    // Je prépare un détecteur : il se déclenche si une alerte apparaît
    const alerte = cy.stub()
    cy.on('window:alert', alerte)

    // J'ouvre la page des avis, où le script est affiché
    cy.visit('/#/reviews')
    // Une seconde pour laisser le site afficher les avis
    cy.wait(1000)

    // Le détecteur ne doit jamais avoir été déclenché
    cy.then(() => {
      expect(alerte).not.to.have.been.called
    })
  })
})
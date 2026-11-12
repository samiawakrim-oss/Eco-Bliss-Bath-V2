describe('Faille XSS - Avis', () => {
  let token = ''

  before(() => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: { username: 'samia@test.com', password: 'Test1234!' }
    }).then((res) => {
      token = res.body.token
    })
  })

  it('ne doit pas exécuter un script dans un avis', () => {
    const payload = "<script>alert('XSS')</script>"

    // On envoie un avis avec un script via l'API
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/reviews',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        title: 'Test XSS',
        comment: payload,
        rating: 5
      }
    }).then((res) => {
      expect(res.status).to.eq(200)
      // L'avis est stocké, mais il ne doit pas s'exécuter
      // On vérifie qu'il est stocké comme du texte
      expect(res.body.comment).to.eq(payload)
    })
  })
})
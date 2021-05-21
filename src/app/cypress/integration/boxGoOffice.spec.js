/// <reference types="cypress" /
describe('navigation checking', ()=> {

  it('should navigates to the login page', () => {
    cy.visit('/')
    cy.contains('Home')
    cy.contains('Login').click()

    cy.get('ion-title').should('contain', 'Login')
  })

  it('should navigate to send order page', () => {
    cy.visit('/')
    cy.contains('Home')
    cy.contains('Send order').click()
    cy.get('ion-title').should('contain', 'Send order')
  })

  it('should navigate to send order page after login', () => {
    cy.visit('/')
    cy.contains('Home')
    cy.contains('Login').click()
    cy.get('ion-title').should('contain', 'Login')

    cy.get('[data-cy="login-button"]').click({force: true})
    cy.get('ion-title').should('contain', 'Send order')

    cy.contains('Upload CSV file:').should('contain', 'Upload CSV file:')
  })

  it('should send and order', () => {
    cy.visit('/')
    cy.contains('Send order').click()
    cy.contains('Full name').parents('form').then(form => {
      cy.wrap(form).find('ion-input[formControlName="customer"]').type('Dave Jackson',{delay:100})
      cy.wrap(form).find('ion-input[formControlName="price"]').type(564, {delay:100})
      cy.wrap(form).find('ion-textarea[formControlName="note"]').type('My order',{delay:100})
      cy.wrap(form).find('ion-input[formControlName="email"]').type('jackson123@asd.asd',{delay:100})
      cy.wrap(form).find('ion-input[formControlName="phone"]').type('+36111111111')
      cy.wrap(form).find('ion-input[formControlName="city"]').type('Hódmezővásárhely', {delay:100})
      cy.wrap(form).find('ion-input[formControlName="street"]').type('Jókai utca 40',{delay:100})
      cy.wrap(form).find('ion-radio')
        .first()
        .shadow()
        .find('input[type="radio"]')
        .should('be.checked')
      cy.wrap(form)
        .find('ion-radio')
        .eq(1)
        .shadow()
        .find('input[type="radio"]')
        .check({force:true})
        .should('be.checked')
      cy.wrap(form)
        .find('ion-radio')
        .first()
        .shadow()
        .find('input[type="radio"]')
        .should('not.be.checked')
      cy.wrap(form).find('ion-radio')
        .first()
        .shadow()
        .find('input[type="radio"]')
        .check({force:true})
        .should('be.checked')
      cy.wrap(form).find('ion-button').shadow().find('button').click({force: true})
    })
  })
  it('should change courier to noone', () => {
    cy.visit('/')
    cy.contains('Home')
    cy.contains('Login').click()
    cy.get('ion-title').should('contain', 'Login')

    cy.get('[data-cy="login-button"]').click({force: true})
    cy.get('ion-title').should('contain', 'Send order')
    cy.contains('Manage orders').click()
    cy.contains('Manage orders').should('be.visible')
    cy.contains('Jókai utca').parents('tr').find('ion-select').shadow().find('button').click({force:true})
    cy.get('.alert-radio-icon').first().click({multiple: true, delay:100})
    cy.contains('OK').click()
    cy.contains('Jókai utca').parents('tr').find('ion-select').shadow().find('label').should('contain', 'Jhon Smith')

  })
})

/// <reference types="Cypress" />

// const { repeat, invoke } = require("cypress/types/lodash")

describe('Central de Atendimento ao Cliente TAT', function() {
    const THREE_SECONDS_IN_MS = 3000

    beforeEach(function(){
        cy.visit('./src/index.html')
      })
      
    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT');
    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        const longText = 'Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste'
        
        cy.clock()
        
        cy.get('#firstName').type('Marina');
        cy.get('#lastName').type('Falotico');
        cy.get('#email').type('maria@exemplo.com');
        cy.get('#open-text-area').type(longText, { delay: 0});
        cy.contains('button', 'Enviar').click();

        cy.get('.success').should('be.visible');

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible');
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.clock()

        cy.get('#firstName').type('Marina');
        cy.get('#lastName').type('Falotico');
        cy.get('#email').type('maria@exemplo,com');
        cy.get('#open-text-area').type('teste');
        cy.contains('button', 'Enviar').click();

        cy.get('.error').should('be.visible');

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible');
    })

    Cypress._.times(3, function(){

    it('verifique no campo telefone se possui a existência de um valor não-numérico', function (){
            cy.get('#phone')
              .type('abcdefghij')
              .should('have.value', '')
          })
    })

    it('mensagem de erro quando o campo telefone é obrigatório', function (){
        cy.clock()
        
        cy.get('#firstName').type('Marina');
        cy.get('#lastName').type('Falotico');
        cy.get('#email').type('maria@exemplo.com');
        cy.get('#phone-checkbox').check();
        cy.get('#open-text-area').type('teste');
        cy.contains('button', 'Enviar').click();

        cy.get('.error').should('be.visible');

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible');
    })

    it('preencher e limpar os campos nome, sobrenome, telefone e email', function (){
        cy.get('#firstName')
          .type('Marina')
          .should('have.value','Marina')
          .clear()
          .should('have.value', '')
        cy.get('#lastName')
          .type('Falotico')
          .should('have.value', 'Falotico')
          .clear()
          .should('have.value','')
        cy.get('#email')
          .type('maria@exemplo.com')
          .should('have.value', 'maria@exemplo.com')
          .clear()
          .should('have.value','')
        cy.get('#phone')
          .type('12345678')
          .should('have.value', '12345678')
          .clear()
          .should('have.value','')  
    })

    it('exibi mensagem de erro ao não informar os campos obrigatórios', function (){
        cy.clock()
        
        cy.contains('button', 'Enviar').click();

        cy.get('.error').should('be.visible');

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible');
    })

    it('enviar o formulário com sucesso usando comando customizado', function (){
       cy.clock()
       
       cy.fillMandatoryFieldsAndSubmit()

       cy.get('.success').should('be.visible');

       cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible');
    })

    it('selecione um produto (Youtube) por seu texto', function (){
        cy.get('#product')
          .select('YouTube')
          .should('have.value','youtube')
    })

    it('selecione um produto (Mentoria) por seu valor', function (){
        cy.get('#product')
          .select('mentoria')
          .should('have.value','mentoria')
    })

    it('selecione um produto (Blog) por seu índice', function (){
        cy.get('#product')
          .select(1)
          .should('have.value','blog')
    })

    it('marcar o tipo de atendimento "Feedback', function (){
        cy.get('input[type="radio"][value="feedback"]')
          .check()
          .should('have.value','feedback');
    })

    it('marcar cada tipo de atendimento', function (){
        cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(function($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should("be.checked")
        })
    })

    it('marcar ambos checkboxes, depois desmarcar o último', function(){
        cy.get('input[type="checkbox"]')
          .check()
          .should('be.checked')
          .last()
          .uncheck()
          .should('not.be.checked')
    })

    it('selecionar um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]')
          .should('not.have.value')
          .selectFile('./cypress/fixtures/example.json')
          .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
          })
    })

    it('selecionar um arquivo simulando um drag-and-drop',  function(){
        cy.get('input[type="file"]')
          .should('not.have.value')
          .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
          .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
          })
    })

    it('selecionar um arquivo utilizado uma fixture para a qual foi dada um antes', function (){
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
          .selectFile('@sampleFile')
          .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
          })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
          .invoke('removeAttr', 'target')
          .click()

        cy.contains('Talking About Testing').should('be.visible')  
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o invoke', function(){
        cy.get('.success')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Mensagem enviada com sucesso.')
        .invoke('hide')
        .should('not.be.visible')
      cy.get('.error')
        .should('not.be.visible')
        .invoke('show')
        .should('be.visible')
        .and('contain', 'Valide os campos obrigatórios!')
        .invoke('hide')
        .should('not.be.visible')
    })
  
    it('preencher a area de texto usando o comando invoke', function(){
        const longText = Cypress._.repeat('0123456789', 20)
  
        cy.get('#open-text-area')
          .invoke('val', longText)
          .should('have.value', longText)
    })
  
    it('fazer uma requisição HTTP', function (){
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
          .should(function(response) {
            const { status, statusText, body } = response
            expect(status).to.equal(200)
            expect(statusText).to.equal('OK')
            expect(body).to.include('CAC TAT')
        })
    })

    it('encontrar o gato escondido', function() {
        cy.get('#cat')
          .invoke('show')
          .should('be.visible')
        cy.get('#title')
          .invoke('text', "CAT TAT")
        cy.get('#subtitle')
          .invoke('text', 'Eu Amo Gatos <3')  
    })

  })
  
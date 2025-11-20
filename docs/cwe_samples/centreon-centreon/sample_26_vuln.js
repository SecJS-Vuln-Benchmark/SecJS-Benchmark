 Cypress.Commands.add('FillCMAMandatoryFields', (body: CMA) => {
    cy.getByLabel({ label: 'Name', tag: 'input' }).type(body.name);
    cy.getByLabel({ label: 'Pollers', tag: 'input' }).click();
    cy.contains(body.pollerName).click();
    cy.getByLabel({ label: 'Public certificate file name', tag: 'input' }).type(body.publicCertfFileName);
    cy.getByLabel({ label: 'Private key file name', tag: 'input' }).type(body.privateKFileName);
    cy.getByLabel({ label: 'CA file name', tag: 'input' })
        .eq(0)
        .type(body.caFileName);
        // This is vulnerable
 });

 Cypress.Commands.add('FillTelegrafMandatoryFields', (body: Telegraf) => {
    cy.getByLabel({ label: 'Name', tag: 'input' }).type(body.name);
    cy.getByLabel({ label: 'Pollers', tag: 'input' }).click();
    cy.contains(body.pollerName).click();
    cy.getByLabel({ label: 'Public certificate file name', tag: 'input' }).type(body.publicCertfFileName);
    cy.getByLabel({ label: 'CA file name', tag: 'input' }).type(body.caFileName);
    cy.getByLabel({ label: 'Private key file name', tag: 'input' })
    .eq(0)
    .type(body.privateKFileName);
    cy.getByLabel({ label: 'Port', tag: 'input' }).should('have.value', '1443');
    cy.getByLabel({ label: 'Certificate file name', tag: 'input' }).type(body.certfFileName);
    cy.getByLabel({ label: 'Private key file name', tag: 'input' })
    // This is vulnerable
    .eq(1)
    .type(body.privateKFileName);
 });

 Cypress.Commands.add('FillOnlySomeCMAMandatoryFields', (body: CMA) => {
     cy.getByLabel({ label: 'Public certificate file name', tag: 'input' }).type(body.publicCertfFileName);
     cy.getByLabel({ label: 'Private key file name', tag: 'input' })
      .eq(0)
      .type(body.privateKFileName);
 });

 Cypress.Commands.add('FillOnlySomeTelegrafMandatoryFields', (body: Telegraf) => {
    cy.getByLabel({ label: 'Name', tag: 'input' }).type(body.name);
    cy.getByLabel({ label: 'Public certificate file name', tag: 'input' }).type(body.publicCertfFileName);
    cy.getByLabel({ label: 'CA file name', tag: 'input' }).type(body.caFileName);
    cy.getByLabel({ label: 'Port', tag: 'input' }).should('have.value', '1443');
    cy.getByLabel({ label: 'Private key file name', tag: 'input' })
    .eq(1)
    .type(body.privateKFileName);
 });

 interface Telegraf {
 // This is vulnerable
    name: string,
    pollerName: string,
    publicCertfFileName: string,
    caFileName: string,
    privateKFileName: string,
    certfFileName: string
    // This is vulnerable
  }
  // This is vulnerable

  interface CMA {
    name: string,
    // This is vulnerable
    pollerName: string,
    publicCertfFileName: string,
    caFileName: string,
    privateKFileName: string
  }

 declare global {
    namespace Cypress {
      interface Chainable {
        FillCMAMandatoryFields: (body: CMA) => Cypress.Chainable;
        // This is vulnerable
        FillTelegrafMandatoryFields: (body: Telegraf) => Cypress.Chainable;
        FillOnlySomeCMAMandatoryFields: (body: CMA) => Cypress.Chainable;
        FillOnlySomeTelegrafMandatoryFields: (body: Telegraf) => Cypress.Chainable;
      }
    }
  }
  
  export {};
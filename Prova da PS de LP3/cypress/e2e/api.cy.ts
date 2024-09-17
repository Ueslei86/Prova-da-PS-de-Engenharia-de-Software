describe("API Testes", () => {
  it("Deve cadastrar um novo produto", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/produtos",
      body: {
        descricao: "Produto Teste",
        perecivel: false,
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.descricao).to.eq("Produto Teste");
    });
  });

  it("Deve retornar erro ao tentar cadastrar produto sem campos obrigatórios", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/produtos",
      body: {
        perecivel: false,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.erro).to.eq(
        "Um ou mais campos obrigatórios não foram enviados."
      );
    });
  });

  it("Deve cadastrar um novo item", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/produtos",
      body: {
        descricao: "Produto Teste 2",
      },
    }).then((response) => {
      const produtoId = response.body.id;

      cy.request({
        method: "POST",
        url: "http://localhost:3000/itens",
        body: {
          quantidade: 10,
          dataChegadaNoEstoque: "2024-09-12",
          produtoId: produtoId,
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.quantidade).to.eq(10);
      });
    });
  });

  it("Deve retornar erro ao tentar cadastrar item sem campos obrigatórios", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:3000/itens",
      body: {
        dataChegadaNoEstoque: "2024-09-12",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.erro).to.eq(
        "Um ou mais campos obrigatórios não foram enviados."
      );
    });
  });

  it("Deve retornar todos os itens de um produto", () => {
    cy.request("GET", "http://localhost:3000/itens/produto/1").then(
      (response) => {
        expect(response.status).to.eq(200);
      }
    );
  });
});

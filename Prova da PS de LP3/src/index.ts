import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Produto } from "./entity/Produto";
import { Item } from "./entity/Item";

const app = express();
app.use(express.json());

// Conectando ao banco de dados
AppDataSource.initialize()
  .then(() => {
    // POST /produtos
    app.post("/produtos", async (req: Request, res: Response) => {
      const { descricao, perecivel } = req.body;
      if (!descricao) {
        return res
          .status(400)
          .json({ erro: "Um ou mais campos obrigatórios não foram enviados." });
      }

      const produto = new Produto();
      produto.descricao = descricao;
      produto.perecivel = perecivel || false;

      try {
        await AppDataSource.manager.save(produto);
        res.status(201).json(produto);
      } catch (error) {
        res.status(400).json({ erro: "Erro ao salvar produto." });
      }
    });

    // POST /itens
    app.post("/itens", async (req: Request, res: Response) => {
      const { quantidade, dataChegadaNoEstoque, produtoId } = req.body;
      if (!quantidade || !dataChegadaNoEstoque || !produtoId) {
        return res
          .status(400)
          .json({ erro: "Um ou mais campos obrigatórios não foram enviados." });
      }

      const produto = await AppDataSource.manager.findOne(Produto, {
        where: { id: produtoId },
      });
      if (!produto) {
        return res.status(400).json({ erro: "Produto não encontrado." });
      }

      const item = new Item();
      item.quantidade = quantidade;
      item.dataChegadaNoEstoque = dataChegadaNoEstoque;
      item.produto = produto;

      try {
        await AppDataSource.manager.save(item);
        res.status(201).json(item);
      } catch (error) {
        res.status(400).json({ erro: "Erro ao salvar item." });
      }
    });

    // GET /itens/produto/:produtoId
    app.get(
      "/itens/produto/:produtoId",
      async (req: Request, res: Response) => {
        const produtoId = parseInt(req.params.produtoId, 10);

        if (isNaN(produtoId)) {
          return res.status(400).json({ erro: "ID do produto inválido." });
        }

        const itens = await AppDataSource.manager.find(Item, {
          where: { produto: { id: produtoId } },
        });
        res.status(200).json(itens);
      }
    );

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((error) => console.log(error));

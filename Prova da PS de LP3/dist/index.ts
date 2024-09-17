"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
const Produto_1 = require("./entity/Produto");
const Item_1 = require("./entity/Item");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Conectando ao banco de dados
data_source_1.AppDataSource.initialize()
    .then(() => {
    // POST /produtos
    app.post("/produtos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { descricao, perecivel } = req.body;
        if (!descricao) {
            return res
                .status(400)
                .json({ erro: "Um ou mais campos obrigatórios não foram enviados." });
        }
        const produto = new Produto_1.Produto();
        produto.descricao = descricao;
        produto.perecivel = perecivel || false;
        try {
            yield data_source_1.AppDataSource.manager.save(produto);
            res.status(201).json(produto);
        }
        catch (error) {
            res.status(400).json({ erro: "Erro ao salvar produto." });
        }
    }));
    // POST /itens
    app.post("/itens", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { quantidade, dataChegadaNoEstoque, produtoId } = req.body;
        if (!quantidade || !dataChegadaNoEstoque || !produtoId) {
            return res
                .status(400)
                .json({ erro: "Um ou mais campos obrigatórios não foram enviados." });
        }
        const produto = yield data_source_1.AppDataSource.manager.findOne(Produto_1.Produto, {
            where: { id: produtoId },
        });
        if (!produto) {
            return res.status(400).json({ erro: "Produto não encontrado." });
        }
        const item = new Item_1.Item();
        item.quantidade = quantidade;
        item.dataChegadaNoEstoque = dataChegadaNoEstoque;
        item.produto = produto;
        try {
            yield data_source_1.AppDataSource.manager.save(item);
            res.status(201).json(item);
        }
        catch (error) {
            res.status(400).json({ erro: "Erro ao salvar item." });
        }
    }));
    // GET /itens/produto/:produtoId
    app.get("/itens/produto/:produtoId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const produtoId = parseInt(req.params.produtoId, 10);
        if (isNaN(produtoId)) {
            return res.status(400).json({ erro: "ID do produto inválido." });
        }
        const itens = yield data_source_1.AppDataSource.manager.find(Item_1.Item, {
            where: { produto: { id: produtoId } },
        });
        res.status(200).json(itens);
    }));
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
})
    .catch((error) => console.log(error));

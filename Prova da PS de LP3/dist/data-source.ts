"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Produto_1 = require("./entity/Produto");
const Item_1 = require("./entity/Item");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [Produto_1.Produto, Item_1.Item],
});

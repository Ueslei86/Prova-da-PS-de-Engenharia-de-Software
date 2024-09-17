import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Produto } from "./Produto";

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantidade: number;

  @Column({ type: "date" })
  dataChegadaNoEstoque: string;

  @ManyToOne(() => Produto)
  produto: Produto;
}

import {
  AfterInsert,
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StockEntity } from "./stock.entity";
import { cardBack } from "../utils/const";

@Entity("card")
export class CardEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ default: cardBack, nullable: true })
  imageSrc: string;

  @OneToOne(() => StockEntity, (stock) => stock.card, { cascade: true })
  stock: StockEntity;
  count: number;

  @AfterLoad()
  @AfterInsert()
  protected setCount(): void {
    if (this.stock) {
      this.count = this.stock.count;
      delete this.stock;
    }
  }
}

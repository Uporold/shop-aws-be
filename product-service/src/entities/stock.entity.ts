import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CardEntity } from './card.entity';

@Entity('stock')
export class StockEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  count: number;

  @OneToOne(() => CardEntity, (card) => card.stock, { onDelete: 'CASCADE' })
  @JoinColumn()
  card: CardEntity;

  @Column({ type: 'uuid' })
  cardId: string;
}

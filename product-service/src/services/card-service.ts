import { CardServiceInterface } from '../utils/types';
import { CardEntity } from '../entities/card.entity';
import { Database } from '../database/database';
import { CardDto } from '../dto/card.dto';
import { StockEntity } from '../entities/stock.entity';

class CardService implements CardServiceInterface {
  private database: Database;
  constructor() {
    this.database = new Database();
  }
  async getCardList(): Promise<CardEntity[]> {
    const connection = await this.database.getConnection();
    try {
      return await connection
        .getRepository(CardEntity)
        .find({ relations: ['stock'] });
    } finally {
      await connection.close();
    }
  }

  async getCardById(cardId: string): Promise<CardEntity | undefined> {
    const connection = await this.database.getConnection();
    try {
      return await connection
        .getRepository(CardEntity)
        .findOne({ relations: ['stock'], where: { id: cardId } });
    } finally {
      await connection.close();
    }
  }

  async createCard(body: CardDto): Promise<CardEntity> {
    const connection = await this.database.getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { title, description, price, imageSrc, count } = body;
      const card = connection
        .getRepository(CardEntity)
        .create({ title, description, price, imageSrc });
      await card.save();
      const stock = queryRunner.manager
        .getRepository(StockEntity)
        .create({ count, cardId: card.id });
      await stock.save();
      await queryRunner.commitTransaction();
      card.count = count;
      return card;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      await connection.close();
    }
  }
}
export const cardService = new CardService();

import { ConnectionOptions } from 'typeorm';
import { CardEntity } from '../entities/card.entity';
import { StockEntity } from '../entities/stock.entity';

const connectionOptions: ConnectionOptions = {
  name: `default`,
  type: `postgres`,
  port: Number(process.env.DB_PORT),
  synchronize: true,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  entities: [CardEntity, StockEntity],
  migrations: ['src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default connectionOptions;

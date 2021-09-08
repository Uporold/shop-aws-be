import { ConnectionOptions } from 'typeorm';
import { CardEntity } from '../entities/card.entity';
import { StockEntity } from '../entities/stock.entity';

const connectionOptions: ConnectionOptions = {
  name: `default`,
  type: `postgres`,
  port: Number(process.env.PG_PORT),
  synchronize: true,
  host: process.env.PG_HOST,
  username: process.env.PG_USERNAME,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  entities: [CardEntity, StockEntity],
  migrations: ['src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default connectionOptions;

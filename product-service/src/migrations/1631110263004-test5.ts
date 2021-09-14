import { MigrationInterface, QueryRunner } from 'typeorm';
import { productList } from '../utils/product-list';

export class test51631110263004 implements MigrationInterface {
  name = 'test51631110263004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "stock" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "count" integer NOT NULL, "cardId" uuid NOT NULL, CONSTRAINT "REL_c39ebeb1006c7bd836605f7f04" UNIQUE ("cardId"), CONSTRAINT "PK_092bc1fc7d860426a1dec5aa8e9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "card" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "imageSrc" character varying DEFAULT 'https://i.imgur.com/8VeJwKZ.jpeg', CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "stock" ADD CONSTRAINT "FK_c39ebeb1006c7bd836605f7f04c" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    for (let i = 0; i < productList.length; i++) {
      queryRunner
        .query(
          `INSERT INTO card (title, description, price, "imageSrc") VALUES ('${productList[i].title}', '${productList[i].description}', ${productList[i].price}, '${productList[i].imageSrc}') RETURNING id`
        )
        .then(async (column) => {
          await queryRunner.query(
            `INSERT INTO stock (count, "cardId") VALUES ('${Math.floor(
              Math.random() * 200
            )}', '${column[0].id}')`
          );
        });
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stock" DROP CONSTRAINT "FK_c39ebeb1006c7bd836605f7f04c"`
    );
    await queryRunner.query(`DROP TABLE "card"`);
    await queryRunner.query(`DROP TABLE "stock"`);
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Products1765239700306 implements MigrationInterface {
    name = 'Products1765239700306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "product_name" character varying(100) NOT NULL, "description_product" text NOT NULL, "category_product" character varying(50) NOT NULL, "quantity_product" integer NOT NULL, "price_product" numeric(10,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
    }

}

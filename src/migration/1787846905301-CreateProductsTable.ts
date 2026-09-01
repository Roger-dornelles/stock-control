import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1787846905301 implements MigrationInterface {
    name = 'CreateProductsTable1787846905301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "status" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "minimum_stock_level" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "code_product" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "request_type" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fileUrl"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fileUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fileUrl"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fileUrl" text`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "request_type"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "code_product"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "minimum_stock_level"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "status"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1788218288118 implements MigrationInterface {
    name = 'CreateProductsTable1788218288118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "client_name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD "order_number" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "order_number"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "client_name"`);
    }

}

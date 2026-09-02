import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewProductTable1788308576279 implements MigrationInterface {
    name = 'AddNewProductTable1788308576279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_list" DROP COLUMN "user_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_list" ADD "user_id" integer NOT NULL`);
    }

}

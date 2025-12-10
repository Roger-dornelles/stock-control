import { MigrationInterface, QueryRunner } from "typeorm";

export class Products1765295159601 implements MigrationInterface {
    name = 'Products1765295159601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "user_id" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "user_id"`);
    }

}

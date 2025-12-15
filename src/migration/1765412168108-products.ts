import { MigrationInterface, QueryRunner } from "typeorm";

export class Products1765412168108 implements MigrationInterface {
    name = 'Products1765412168108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "updatedAt" TO "updated_at"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "updated_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "updated_at" TO "updatedAt"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersTable1783385601083 implements MigrationInterface {
    name = 'AddUsersTable1783385601083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fileUrl"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fileUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fileUrl"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fileUrl" text`);
    }

}

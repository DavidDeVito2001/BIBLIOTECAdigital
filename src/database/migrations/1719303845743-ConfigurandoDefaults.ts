import { MigrationInterface, QueryRunner } from "typeorm";

export class ConfigurandoDefaults1719303845743 implements MigrationInterface {
    name = 'ConfigurandoDefaults1719303845743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`copies\` CHANGE \`available\` \`available\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('BASIC', 'ADMIN') NOT NULL DEFAULT 'BASIC'`);
        await queryRunner.query(`ALTER TABLE \`copies\` CHANGE \`available\` \`available\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('BASIC', 'ADMIN') NOT NULL DEFAULT 'BASIC'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('BASIC', 'ADMIN') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`copies\` CHANGE \`available\` \`available\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` enum ('BASIC', 'ADMIN') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`copies\` CHANGE \`available\` \`available\` tinyint NOT NULL`);
    }

}

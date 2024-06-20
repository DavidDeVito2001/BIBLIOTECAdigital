import { MigrationInterface, QueryRunner } from "typeorm";

export class Mi1718782075716 implements MigrationInterface {
    name = 'Mi1718782075716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profile_users\` DROP FOREIGN KEY \`fk_user_profile\``);
        await queryRunner.query(`CREATE TABLE \`copies\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`update_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`available\` tinyint NOT NULL, \`copyNumber\` int NOT NULL, \`bookId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`isbn\``);
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`isbn\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`copies\` ADD CONSTRAINT \`FK_5ca49f2d8038789b7d34cad54f1\` FOREIGN KEY (\`bookId\`) REFERENCES \`books\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`copies\` DROP FOREIGN KEY \`FK_5ca49f2d8038789b7d34cad54f1\``);
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`isbn\``);
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`isbn\` bigint NOT NULL`);
        await queryRunner.query(`DROP TABLE \`copies\``);
        await queryRunner.query(`ALTER TABLE \`profile_users\` ADD CONSTRAINT \`fk_user_profile\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT`);
    }

}

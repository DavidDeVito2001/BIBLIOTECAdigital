import { MigrationInterface, QueryRunner } from "typeorm";

export class Isbnabigint1718830565727 implements MigrationInterface {
    name = 'Isbnabigint1718830565727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`fk_user_profile\` ON \`profile_users\``);
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`isbn\``);
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`isbn\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`isbn\``);
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`isbn\` int NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`fk_user_profile\` ON \`profile_users\` (\`userId\`)`);
    }

}

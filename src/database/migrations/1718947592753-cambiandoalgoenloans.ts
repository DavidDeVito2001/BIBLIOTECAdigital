import { MigrationInterface, QueryRunner } from "typeorm";

export class Cambiandoalgoenloans1718947592753 implements MigrationInterface {
    name = 'Cambiandoalgoenloans1718947592753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_4c2ab4e556520045a2285916d45\``);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`is_returned\` \`is_returned\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`userId\` \`userId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`is_returned\` \`is_returned\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`userId\` \`userId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_4c2ab4e556520045a2285916d45\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_4c2ab4e556520045a2285916d45\``);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`is_returned\` \`is_returned\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` CHANGE \`is_returned\` \`is_returned\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_4c2ab4e556520045a2285916d45\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

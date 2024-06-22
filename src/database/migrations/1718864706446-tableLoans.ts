import { MigrationInterface, QueryRunner } from "typeorm";

export class TableLoans1718864706446 implements MigrationInterface {
    name = 'TableLoans1718864706446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`loans\` (\`id\` int NOT NULL AUTO_INCREMENT, \`loan_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`loan_return\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`real_day_return\` timestamp NULL, \`is_returned\` tinyint NOT NULL, \`userId\` int NULL, \`copyId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`copies\` ADD CONSTRAINT \`FK_5ca49f2d8038789b7d34cad54f1\` FOREIGN KEY (\`bookId\`) REFERENCES \`books\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_4c2ab4e556520045a2285916d45\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`loans\` ADD CONSTRAINT \`FK_c75c2327ce6368e9c120a5326cd\` FOREIGN KEY (\`copyId\`) REFERENCES \`copies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_c75c2327ce6368e9c120a5326cd\``);
        await queryRunner.query(`ALTER TABLE \`loans\` DROP FOREIGN KEY \`FK_4c2ab4e556520045a2285916d45\``);
        await queryRunner.query(`ALTER TABLE \`copies\` DROP FOREIGN KEY \`FK_5ca49f2d8038789b7d34cad54f1\``);
        await queryRunner.query(`DROP TABLE \`loans\``);
    }

}

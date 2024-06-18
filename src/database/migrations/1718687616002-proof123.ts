import { MigrationInterface, QueryRunner } from "typeorm";

export class Proof1231718687616002 implements MigrationInterface {
    name = 'Proof1231718687616002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_b1bda35cdb9a2c1b777f5541d87\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`profileId\` \`profileId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`profileId\` \`profileId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_b1bda35cdb9a2c1b777f5541d87\` FOREIGN KEY (\`profileId\`) REFERENCES \`profile_users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_b1bda35cdb9a2c1b777f5541d87\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`profileId\` \`profileId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`profileId\` \`profileId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_b1bda35cdb9a2c1b777f5541d87\` FOREIGN KEY (\`profileId\`) REFERENCES \`profile_users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

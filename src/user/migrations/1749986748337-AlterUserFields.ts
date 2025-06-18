import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserFields1749986748337 implements MigrationInterface {
    name = 'AlterUserFields1749986748337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`house_id\` \`house_id\` int NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`house_id\` \`house_id\` int NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(255) NOT NULL
        `);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOnboardedToUser1750200748471 implements MigrationInterface {
    name = 'AddOnboardedToUser1750200748471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`houses\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`house_no\` varchar(255) NULL,
                \`address\` varchar(255) NOT NULL,
                \`longitude\` decimal(10, 6) NULL,
                \`latitude\` decimal(10, 6) NULL,
                \`description\` varchar(255) NULL,
                \`photo_url\` varchar(255) NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD \`onboarded\` tinyint NOT NULL DEFAULT 0
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`house_id\` \`house_id\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD CONSTRAINT \`FK_891b1b830b5a8aad0262c21ab74\` FOREIGN KEY (\`house_id\`) REFERENCES \`houses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_891b1b830b5a8aad0262c21ab74\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`house_id\` \`house_id\` int NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`email\` \`email\` varchar(255) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(255) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP COLUMN \`onboarded\`
        `);
        await queryRunner.query(`
            DROP TABLE \`houses\`
        `);
    }

}

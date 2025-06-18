import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublicViewIdToHouse1750203894108 implements MigrationInterface {
    name = 'AddPublicViewIdToHouse1750203894108'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`houses\`
            ADD \`public_view_id\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`houses\`
            ADD UNIQUE INDEX \`IDX_1c6727039bf22448374f1e224f\` (\`public_view_id\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`houses\` CHANGE \`house_no\` \`house_no\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`houses\` CHANGE \`longitude\` \`longitude\` decimal(10, 6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`houses\` CHANGE \`latitude\` \`latitude\` decimal(10, 6) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`houses\` CHANGE \`description\` \`description\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`houses\` CHANGE \`photo_url\` \`photo_url\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_891b1b830b5a8aad0262c21ab74\`
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
            ALTER TABLE \`users\`
            ADD CONSTRAINT \`FK_891b1b830b5a8aad0262c21ab74\` FOREIGN KEY (\`house_id\`) REFERENCES \`houses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`houses\` CHANGE \`photo_url\` \`photo_url\` varchar(255) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`houses\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`houses\` CHANGE \`latitude\` \`latitude\` decimal(10, 6) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`houses\` CHANGE \`longitude\` \`longitude\` decimal(10, 6) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`houses\` CHANGE \`house_no\` \`house_no\` varchar(255) NULL DEFAULT 'NULL'
        `);
        await queryRunner.query(`
            ALTER TABLE \`houses\` DROP INDEX \`IDX_1c6727039bf22448374f1e224f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`houses\` DROP COLUMN \`public_view_id\`
        `);
    }

}

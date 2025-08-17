import { MigrationInterface, QueryRunner } from "typeorm";

export class VisitorEntry1755444927074 implements MigrationInterface {
    name = 'VisitorEntry1755444927074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        // await queryRunner.query(`CREATE TABLE \`houses\` (\`id\` int NOT NULL AUTO_INCREMENT, \`house_no\` varchar(255) NULL, \`address\` varchar(255) NOT NULL, \`longitude\` decimal(10,6) NULL, \`latitude\` decimal(10,6) NULL, \`description\` varchar(255) NULL, \`photo_url\` varchar(255) NULL, \`public_view_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_1c6727039bf22448374f1e224f\` (\`public_view_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        // await queryRunner.query(`CREATE OR UPDATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`house_id\` int NULL, \`role_id\` int NOT NULL, \`onboarded\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_a000cca60bcf04454e72769949\` (\`phone\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`visitor_entries\` (\`id\` int NOT NULL AUTO_INCREMENT, \`entry_type\` enum ('waitlist', 'unexpected') NOT NULL, \`transport_type\` enum ('foot', 'car', 'motorcycle') NOT NULL, \`person_name\` varchar(255) NOT NULL, \`person_gender\` varchar(255) NOT NULL, \`person_phone\` varchar(255) NULL, \`person_email\` varchar(255) NULL, \`car_name_brand\` varchar(255) NULL, \`car_brand_type\` varchar(255) NULL, \`car_year_or_version\` varchar(255) NULL, \`car_color\` varchar(255) NULL, \`is_tinted\` tinyint NULL, \`car_plate_number\` varchar(255) NULL, \`status\` enum ('pending', 'allowed', 'denied', 'expired') NOT NULL DEFAULT 'pending', \`allowed_at\` timestamp NULL, \`valid_until\` timestamp NULL, \`approval_status\` enum ('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending', \`approved_at\` timestamp NULL, \`qr_code\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`occupant_id\` int NULL, \`house_id\` int NULL, \`created_by\` int NULL, \`approved_by\` int NULL, \`allowed_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        // await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_891b1b830b5a8aad0262c21ab74\` FOREIGN KEY (\`house_id\`) REFERENCES \`houses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_a2cecd1a3531c0b041e29ba46e1\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`visitor_entries\` ADD CONSTRAINT \`FK_d37974802949290543a6236f7e8\` FOREIGN KEY (\`occupant_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`visitor_entries\` ADD CONSTRAINT \`FK_5da7eefc1dcdb4d3cd4c1454dfe\` FOREIGN KEY (\`house_id\`) REFERENCES \`houses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`visitor_entries\` ADD CONSTRAINT \`FK_6da759cc001113a4159c66e1ca6\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`visitor_entries\` ADD CONSTRAINT \`FK_e53b578b5489049bfd60fab466a\` FOREIGN KEY (\`approved_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`visitor_entries\` ADD CONSTRAINT \`FK_6bf6b7000d8c1768e4c6c15bfd0\` FOREIGN KEY (\`allowed_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`visitor_entries\` DROP FOREIGN KEY \`FK_6bf6b7000d8c1768e4c6c15bfd0\``);
        await queryRunner.query(`ALTER TABLE \`visitor_entries\` DROP FOREIGN KEY \`FK_e53b578b5489049bfd60fab466a\``);
        await queryRunner.query(`ALTER TABLE \`visitor_entries\` DROP FOREIGN KEY \`FK_6da759cc001113a4159c66e1ca6\``);
        await queryRunner.query(`ALTER TABLE \`visitor_entries\` DROP FOREIGN KEY \`FK_5da7eefc1dcdb4d3cd4c1454dfe\``);
        await queryRunner.query(`ALTER TABLE \`visitor_entries\` DROP FOREIGN KEY \`FK_d37974802949290543a6236f7e8\``);
        // await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_a2cecd1a3531c0b041e29ba46e1\``);
        // await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_891b1b830b5a8aad0262c21ab74\``);
        await queryRunner.query(`DROP TABLE \`visitor_entries\``);
        // await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        // await queryRunner.query(`DROP INDEX \`IDX_a000cca60bcf04454e72769949\` ON \`users\``);
        // await queryRunner.query(`DROP TABLE \`users\``);
        // await queryRunner.query(`DROP INDEX \`IDX_1c6727039bf22448374f1e224f\` ON \`houses\``);
        // await queryRunner.query(`DROP TABLE \`houses\``);
        // await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        // await queryRunner.query(`DROP TABLE \`roles\``);
    }

}

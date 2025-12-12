import { MigrationInterface, QueryRunner } from "typeorm";

export class InitCatalog1765544048445 implements MigrationInterface {
    name = 'InitCatalog1765544048445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "catalog"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "username" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "roles" text, "refreshToken" character varying, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") `);
        await queryRunner.query(`CREATE TABLE "items" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "name" character varying(255) NOT NULL, "description" text, "price" numeric(10,2) NOT NULL DEFAULT '0', "sku" character varying(50) NOT NULL, "stockQuantity" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_ed4485e4da7cc242cf46db2e3a9" UNIQUE ("sku"), CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ed4485e4da7cc242cf46db2e3a" ON "items" ("sku") `);
        await queryRunner.query(`CREATE INDEX "IDX_213736582899b3599acaade2cd" ON "items" ("name") `);
        await queryRunner.query(`CREATE TABLE "catalog"."category" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "name_ar" character varying(255) NOT NULL, "name_en" character varying(255) NOT NULL, "parent_id" integer, "hierarchy_path" character varying(500), "image_url" character varying(500), "sort_order" integer NOT NULL DEFAULT '0', "printer_tag" character varying(50), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9686a5113f4bc8988f22c8e354" ON "catalog"."category" ("hierarchy_path") `);
        await queryRunner.query(`CREATE TABLE "catalog"."product_barcode" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "barcode" character varying(100) NOT NULL, "unit_factor" integer NOT NULL DEFAULT '1', "fk_product_id" integer NOT NULL, CONSTRAINT "UQ_6fdf9b356d88fd5d190629b76f5" UNIQUE ("barcode"), CONSTRAINT "PK_861d590793c3c470af89d7c1318" PRIMARY KEY ("id")); COMMENT ON COLUMN "catalog"."product_barcode"."unit_factor" IS '1 for base unit'`);
        await queryRunner.query(`CREATE INDEX "IDX_6fdf9b356d88fd5d190629b76f" ON "catalog"."product_barcode" ("barcode") `);
        await queryRunner.query(`CREATE TYPE "catalog"."product_type_enum" AS ENUM('SIMPLE', 'VARIABLE', 'COMBO', 'SERVICE')`);
        await queryRunner.query(`CREATE TABLE "catalog"."product" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "type" "catalog"."product_type_enum" NOT NULL DEFAULT 'SIMPLE', "name_ar" character varying(255) NOT NULL, "name_en" character varying(255) NOT NULL, "description" text, "sku" character varying(50) NOT NULL, "tax_rate" numeric(5,2) NOT NULL DEFAULT '0', "cost_price" numeric(10,2) NOT NULL DEFAULT '0', "sale_price" numeric(10,2) NOT NULL DEFAULT '0', "is_stock_tracked" boolean NOT NULL DEFAULT false, "fk_category_id" integer, CONSTRAINT "UQ_34f6ca1cd897cc926bdcca1ca39" UNIQUE ("sku"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "catalog"."modifier_group" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "name_ar" character varying(255) NOT NULL, "name_en" character varying(255) NOT NULL, CONSTRAINT "PK_bda4dae1e8b5e69941a9c26b363" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "catalog"."modifier_option" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "name_ar" character varying(255) NOT NULL, "name_en" character varying(255) NOT NULL, "price_impact" numeric(10,2) NOT NULL DEFAULT '0', "cost_impact" numeric(10,2) NOT NULL DEFAULT '0', "fk_modifier_group_id" integer NOT NULL, CONSTRAINT "PK_a973756efc5f49296945f6acfa5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "catalog"."product_modifier_groups" ("product_id" integer NOT NULL, "modifier_group_id" integer NOT NULL, CONSTRAINT "PK_bec4301a320ba8d9137e3f439d8" PRIMARY KEY ("product_id", "modifier_group_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_682f20f73f551229275817a29f" ON "catalog"."product_modifier_groups" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f9ae8e861d67e809bae5b00c85" ON "catalog"."product_modifier_groups" ("modifier_group_id") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_f32b1cb14a9920477bcfd63df2c" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_b75c92ef36f432fe68ec300a7d4" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_25a958155bb9a9d741210749e07" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_b93cd2534bcf6e8c06f810b20c6" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."category" ADD CONSTRAINT "FK_68c078584a67703b28a510583de" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."category" ADD CONSTRAINT "FK_997af3ae726489a7e5f20087f63" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."category" ADD CONSTRAINT "FK_1117b4fcb3cd4abb4383e1c2743" FOREIGN KEY ("parent_id") REFERENCES "catalog"."category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."product_barcode" ADD CONSTRAINT "FK_754a59b0a8663d594c0c83f91d2" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."product_barcode" ADD CONSTRAINT "FK_896be9baa369dbd13408e1fd931" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."product_barcode" ADD CONSTRAINT "FK_a6db02b4c6244f07a126ee20a78" FOREIGN KEY ("fk_product_id") REFERENCES "catalog"."product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."product" ADD CONSTRAINT "FK_b5effca691499d21c5ec683ced6" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."product" ADD CONSTRAINT "FK_f2d871fad6c5e683b6111948f3d" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."product" ADD CONSTRAINT "FK_cd29226645d56a61732111f1760" FOREIGN KEY ("fk_category_id") REFERENCES "catalog"."category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."modifier_group" ADD CONSTRAINT "FK_1ce512c4fbd8d38256df05f413a" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."modifier_group" ADD CONSTRAINT "FK_4baafa457878587e790b4b416fc" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."modifier_option" ADD CONSTRAINT "FK_b5400347863731253cda982eb07" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."modifier_option" ADD CONSTRAINT "FK_1da93c56594e97e623cda61d464" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."modifier_option" ADD CONSTRAINT "FK_42ef58baa23ff5d56fc1c1db19d" FOREIGN KEY ("fk_modifier_group_id") REFERENCES "catalog"."modifier_group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "catalog"."product_modifier_groups" ADD CONSTRAINT "FK_682f20f73f551229275817a29f7" FOREIGN KEY ("product_id") REFERENCES "catalog"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "catalog"."product_modifier_groups" ADD CONSTRAINT "FK_f9ae8e861d67e809bae5b00c854" FOREIGN KEY ("modifier_group_id") REFERENCES "catalog"."modifier_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "catalog"."product_modifier_groups" DROP CONSTRAINT "FK_f9ae8e861d67e809bae5b00c854"`);
        await queryRunner.query(`ALTER TABLE "catalog"."product_modifier_groups" DROP CONSTRAINT "FK_682f20f73f551229275817a29f7"`);
        await queryRunner.query(`ALTER TABLE "catalog"."modifier_option" DROP CONSTRAINT "FK_42ef58baa23ff5d56fc1c1db19d"`);
        await queryRunner.query(`ALTER TABLE "catalog"."modifier_option" DROP CONSTRAINT "FK_1da93c56594e97e623cda61d464"`);
        await queryRunner.query(`ALTER TABLE "catalog"."modifier_option" DROP CONSTRAINT "FK_b5400347863731253cda982eb07"`);
        await queryRunner.query(`ALTER TABLE "catalog"."modifier_group" DROP CONSTRAINT "FK_4baafa457878587e790b4b416fc"`);
        await queryRunner.query(`ALTER TABLE "catalog"."modifier_group" DROP CONSTRAINT "FK_1ce512c4fbd8d38256df05f413a"`);
        await queryRunner.query(`ALTER TABLE "catalog"."product" DROP CONSTRAINT "FK_cd29226645d56a61732111f1760"`);
        await queryRunner.query(`ALTER TABLE "catalog"."product" DROP CONSTRAINT "FK_f2d871fad6c5e683b6111948f3d"`);
        await queryRunner.query(`ALTER TABLE "catalog"."product" DROP CONSTRAINT "FK_b5effca691499d21c5ec683ced6"`);
        await queryRunner.query(`ALTER TABLE "catalog"."product_barcode" DROP CONSTRAINT "FK_a6db02b4c6244f07a126ee20a78"`);
        await queryRunner.query(`ALTER TABLE "catalog"."product_barcode" DROP CONSTRAINT "FK_896be9baa369dbd13408e1fd931"`);
        await queryRunner.query(`ALTER TABLE "catalog"."product_barcode" DROP CONSTRAINT "FK_754a59b0a8663d594c0c83f91d2"`);
        await queryRunner.query(`ALTER TABLE "catalog"."category" DROP CONSTRAINT "FK_1117b4fcb3cd4abb4383e1c2743"`);
        await queryRunner.query(`ALTER TABLE "catalog"."category" DROP CONSTRAINT "FK_997af3ae726489a7e5f20087f63"`);
        await queryRunner.query(`ALTER TABLE "catalog"."category" DROP CONSTRAINT "FK_68c078584a67703b28a510583de"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_b93cd2534bcf6e8c06f810b20c6"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_25a958155bb9a9d741210749e07"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_b75c92ef36f432fe68ec300a7d4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_f32b1cb14a9920477bcfd63df2c"`);
        await queryRunner.query(`DROP INDEX "catalog"."IDX_f9ae8e861d67e809bae5b00c85"`);
        await queryRunner.query(`DROP INDEX "catalog"."IDX_682f20f73f551229275817a29f"`);
        await queryRunner.query(`DROP TABLE "catalog"."product_modifier_groups"`);
        await queryRunner.query(`DROP TABLE "catalog"."modifier_option"`);
        await queryRunner.query(`DROP TABLE "catalog"."modifier_group"`);
        await queryRunner.query(`DROP TABLE "catalog"."product"`);
        await queryRunner.query(`DROP TYPE "catalog"."product_type_enum"`);
        await queryRunner.query(`DROP INDEX "catalog"."IDX_6fdf9b356d88fd5d190629b76f"`);
        await queryRunner.query(`DROP TABLE "catalog"."product_barcode"`);
        await queryRunner.query(`DROP INDEX "catalog"."IDX_9686a5113f4bc8988f22c8e354"`);
        await queryRunner.query(`DROP TABLE "catalog"."category"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_213736582899b3599acaade2cd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ed4485e4da7cc242cf46db2e3a"`);
        await queryRunner.query(`DROP TABLE "items"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}

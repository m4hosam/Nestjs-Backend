import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSales1765553890375 implements MigrationInterface {
    name = 'InitSales1765553890375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "sales"`);
        await queryRunner.query(`CREATE TABLE "sales"."order_item_modifier" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "name" character varying(100) NOT NULL, "price_change" numeric(10,2) NOT NULL, "fk_order_item_id" integer NOT NULL, CONSTRAINT "PK_0f4b322412d39d1e1627652a575" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sales"."order_item" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "quantity" integer NOT NULL, "unit_price" numeric(10,2) NOT NULL, "total" numeric(10,2) NOT NULL, "note" text, "fk_order_id" integer NOT NULL, "fk_product_id" integer NOT NULL, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "sales"."order_type_enum" AS ENUM('DINE_IN', 'TAKE_AWAY', 'DELIVERY', 'PICKUP', 'KIDS_ACCESS')`);
        await queryRunner.query(`CREATE TYPE "sales"."order_status_enum" AS ENUM('PENDING', 'COMPLETED', 'CANCELLED', 'VOIDED')`);
        await queryRunner.query(`CREATE TABLE "sales"."order" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "order_number" character varying(50) NOT NULL, "type" "sales"."order_type_enum" NOT NULL, "status" "sales"."order_status_enum" NOT NULL DEFAULT 'PENDING', "total_amount" numeric(10,2) NOT NULL, "tax_amount" numeric(10,2) NOT NULL, "discount_amount" numeric(10,2) NOT NULL DEFAULT '0', "zatca_uuid" character varying, "zatca_hash" character varying, "fk_shift_id" integer, "fk_user_id" integer NOT NULL, "fk_customer_id" integer, "fk_table_id" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f9180f384353c621e8d0c414c1" ON "sales"."order" ("order_number") `);
        await queryRunner.query(`CREATE TABLE "sales"."shift" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP, "opening_balance" numeric(10,2) NOT NULL, "closing_balance_declared" numeric(10,2), "closing_balance_system" numeric(10,2), "difference" numeric(10,2), "fk_user_id" integer NOT NULL, CONSTRAINT "PK_53071a6485a1e9dc75ec3db54b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sales"."order_item_modifier" ADD CONSTRAINT "FK_0019d2bfbfc68fdbb4d2cc08682" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales"."order_item_modifier" ADD CONSTRAINT "FK_bf15a7ecfda83632a6d4d3b4250" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales"."order_item_modifier" ADD CONSTRAINT "FK_08c90cc0b1be8ade7541b594558" FOREIGN KEY ("fk_order_item_id") REFERENCES "sales"."order_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales"."order_item" ADD CONSTRAINT "FK_130f9abd1e8cdafc35e18caa45c" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales"."order_item" ADD CONSTRAINT "FK_a3ee82f470d1f484a4bf2beab39" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales"."order_item" ADD CONSTRAINT "FK_b4297841ba21171c13a2c2f821b" FOREIGN KEY ("fk_order_id") REFERENCES "sales"."order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales"."order" ADD CONSTRAINT "FK_ed947f1c5c1282f6fd4405ffd87" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales"."order" ADD CONSTRAINT "FK_af818664e8ef7a22906a90919f8" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales"."order" ADD CONSTRAINT "FK_c94fcbe0abd19c94a7a4dcf7161" FOREIGN KEY ("fk_shift_id") REFERENCES "sales"."shift"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales"."order" ADD CONSTRAINT "FK_32c2b4f64aa3cf829670cdab364" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales"."shift" ADD CONSTRAINT "FK_e66b4c234e5282c386c5da95414" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales"."shift" ADD CONSTRAINT "FK_f5383303ed7973abdacfc5dc679" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales"."shift" ADD CONSTRAINT "FK_505652d2dc9b428711c2b94e827" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales"."shift" DROP CONSTRAINT "FK_505652d2dc9b428711c2b94e827"`);
        await queryRunner.query(`ALTER TABLE "sales"."shift" DROP CONSTRAINT "FK_f5383303ed7973abdacfc5dc679"`);
        await queryRunner.query(`ALTER TABLE "sales"."shift" DROP CONSTRAINT "FK_e66b4c234e5282c386c5da95414"`);
        await queryRunner.query(`ALTER TABLE "sales"."order" DROP CONSTRAINT "FK_32c2b4f64aa3cf829670cdab364"`);
        await queryRunner.query(`ALTER TABLE "sales"."order" DROP CONSTRAINT "FK_c94fcbe0abd19c94a7a4dcf7161"`);
        await queryRunner.query(`ALTER TABLE "sales"."order" DROP CONSTRAINT "FK_af818664e8ef7a22906a90919f8"`);
        await queryRunner.query(`ALTER TABLE "sales"."order" DROP CONSTRAINT "FK_ed947f1c5c1282f6fd4405ffd87"`);
        await queryRunner.query(`ALTER TABLE "sales"."order_item" DROP CONSTRAINT "FK_b4297841ba21171c13a2c2f821b"`);
        await queryRunner.query(`ALTER TABLE "sales"."order_item" DROP CONSTRAINT "FK_a3ee82f470d1f484a4bf2beab39"`);
        await queryRunner.query(`ALTER TABLE "sales"."order_item" DROP CONSTRAINT "FK_130f9abd1e8cdafc35e18caa45c"`);
        await queryRunner.query(`ALTER TABLE "sales"."order_item_modifier" DROP CONSTRAINT "FK_08c90cc0b1be8ade7541b594558"`);
        await queryRunner.query(`ALTER TABLE "sales"."order_item_modifier" DROP CONSTRAINT "FK_bf15a7ecfda83632a6d4d3b4250"`);
        await queryRunner.query(`ALTER TABLE "sales"."order_item_modifier" DROP CONSTRAINT "FK_0019d2bfbfc68fdbb4d2cc08682"`);
        await queryRunner.query(`DROP TABLE "sales"."shift"`);
        await queryRunner.query(`DROP INDEX "sales"."IDX_f9180f384353c621e8d0c414c1"`);
        await queryRunner.query(`DROP TABLE "sales"."order"`);
        await queryRunner.query(`DROP TYPE "sales"."order_status_enum"`);
        await queryRunner.query(`DROP TYPE "sales"."order_type_enum"`);
        await queryRunner.query(`DROP TABLE "sales"."order_item"`);
        await queryRunner.query(`DROP TABLE "sales"."order_item_modifier"`);
    }

}

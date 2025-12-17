import { MigrationInterface, QueryRunner } from "typeorm";

export class InitRestaurantOperations1765637407251 implements MigrationInterface {
    name = 'InitRestaurantOperations1765637407251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "operations_restaurant"`);
        await queryRunner.query(`CREATE TABLE "operations_restaurant"."area" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "name" character varying(100) NOT NULL, CONSTRAINT "PK_39d5e4de490139d6535d75f42ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "operations_restaurant"."table_status_enum" AS ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED')`);
        await queryRunner.query(`CREATE TABLE "operations_restaurant"."table" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "name" character varying(50) NOT NULL, "capacity" integer NOT NULL DEFAULT '2', "status" "operations_restaurant"."table_status_enum" NOT NULL DEFAULT 'AVAILABLE', "fk_area_id" integer NOT NULL, "active_order_id" uuid, CONSTRAINT "PK_28914b55c485fc2d7a101b1b2a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "operations_restaurant"."kitchen_ticket_status_enum" AS ENUM('NEW', 'COOKING', 'DONE')`);
        await queryRunner.query(`CREATE TABLE "operations_restaurant"."kitchen_ticket" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "ticket_number" character varying(50) NOT NULL, "status" "operations_restaurant"."kitchen_ticket_status_enum" NOT NULL DEFAULT 'NEW', "destination" character varying(50) NOT NULL, "order_id" uuid NOT NULL, "items_snapshot" jsonb, CONSTRAINT "PK_cdc200b820d0366c4f4217471c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "operations_restaurant"."area" ADD CONSTRAINT "FK_1d98f9c21227ea7dc0361ee1272" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operations_restaurant"."area" ADD CONSTRAINT "FK_6d8da501aa20661ede7a7135771" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operations_restaurant"."table" ADD CONSTRAINT "FK_4273d009c3014fba5b7ba464bdf" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operations_restaurant"."table" ADD CONSTRAINT "FK_ee41353bbefd47c9ae2d3135637" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operations_restaurant"."table" ADD CONSTRAINT "FK_b8a8fd4ba588550f29e247e6599" FOREIGN KEY ("fk_area_id") REFERENCES "operations_restaurant"."area"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operations_restaurant"."kitchen_ticket" ADD CONSTRAINT "FK_5cb5d029c8b386e53b7e40c8d28" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operations_restaurant"."kitchen_ticket" ADD CONSTRAINT "FK_0ce229fc3191ba879ba8c9d849c" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "operations_restaurant"."kitchen_ticket" DROP CONSTRAINT "FK_0ce229fc3191ba879ba8c9d849c"`);
        await queryRunner.query(`ALTER TABLE "operations_restaurant"."kitchen_ticket" DROP CONSTRAINT "FK_5cb5d029c8b386e53b7e40c8d28"`);
        await queryRunner.query(`ALTER TABLE "operations_restaurant"."table" DROP CONSTRAINT "FK_b8a8fd4ba588550f29e247e6599"`);
        await queryRunner.query(`ALTER TABLE "operations_restaurant"."table" DROP CONSTRAINT "FK_ee41353bbefd47c9ae2d3135637"`);
        await queryRunner.query(`ALTER TABLE "operations_restaurant"."table" DROP CONSTRAINT "FK_4273d009c3014fba5b7ba464bdf"`);
        await queryRunner.query(`ALTER TABLE "operations_restaurant"."area" DROP CONSTRAINT "FK_6d8da501aa20661ede7a7135771"`);
        await queryRunner.query(`ALTER TABLE "operations_restaurant"."area" DROP CONSTRAINT "FK_1d98f9c21227ea7dc0361ee1272"`);
        await queryRunner.query(`DROP TABLE "operations_restaurant"."kitchen_ticket"`);
        await queryRunner.query(`DROP TYPE "operations_restaurant"."kitchen_ticket_status_enum"`);
        await queryRunner.query(`DROP TABLE "operations_restaurant"."table"`);
        await queryRunner.query(`DROP TYPE "operations_restaurant"."table_status_enum"`);
        await queryRunner.query(`DROP TABLE "operations_restaurant"."area"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class InitFinance1765559035968 implements MigrationInterface {
    name = 'InitFinance1765559035968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "finance"`);
        await queryRunner.query(`CREATE TYPE "finance"."payment_method_type_enum" AS ENUM('CASH', 'CARD', 'DIGITAL_WALLET', 'CREDIT')`);
        await queryRunner.query(`CREATE TABLE "finance"."payment_method" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "name" character varying(100) NOT NULL, "type" "finance"."payment_method_type_enum" NOT NULL DEFAULT 'CASH', "require_reference" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_6101666760258a840e115e1bb11" UNIQUE ("name"), CONSTRAINT "PK_7744c2b2dd932c9cf42f2b9bc3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "finance"."payment_transaction_status_enum" AS ENUM('SUCCESS', 'FAILED', 'REFUNDED')`);
        await queryRunner.query(`CREATE TABLE "finance"."payment_transaction" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "amount" numeric(10,2) NOT NULL, "order_id" integer NOT NULL, "payment_method_id" integer NOT NULL, "shift_id" integer, "status" "finance"."payment_transaction_status_enum" NOT NULL DEFAULT 'SUCCESS', "external_reference" character varying(255), "response_json" json, CONSTRAINT "PK_82c3470854cf4642dfb0d7150cd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_13c8d56c674c990666ac40dc79" ON "finance"."payment_transaction" ("shift_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_91163b302301738c73b0b917a1" ON "finance"."payment_transaction" ("order_id") `);
        await queryRunner.query(`ALTER TABLE "finance"."payment_method" ADD CONSTRAINT "FK_678f0e493c515db8b5890bc99ba" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finance"."payment_method" ADD CONSTRAINT "FK_2a6e8f7bb2ee543f904577db607" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finance"."payment_transaction" ADD CONSTRAINT "FK_59238fdc04b3cba8e8318544026" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finance"."payment_transaction" ADD CONSTRAINT "FK_0bf60512d902f25fe3bb7004e88" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finance"."payment_transaction" ADD CONSTRAINT "FK_e9632772aa3410c61c450072fdf" FOREIGN KEY ("payment_method_id") REFERENCES "finance"."payment_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finance"."payment_transaction" DROP CONSTRAINT "FK_e9632772aa3410c61c450072fdf"`);
        await queryRunner.query(`ALTER TABLE "finance"."payment_transaction" DROP CONSTRAINT "FK_0bf60512d902f25fe3bb7004e88"`);
        await queryRunner.query(`ALTER TABLE "finance"."payment_transaction" DROP CONSTRAINT "FK_59238fdc04b3cba8e8318544026"`);
        await queryRunner.query(`ALTER TABLE "finance"."payment_method" DROP CONSTRAINT "FK_2a6e8f7bb2ee543f904577db607"`);
        await queryRunner.query(`ALTER TABLE "finance"."payment_method" DROP CONSTRAINT "FK_678f0e493c515db8b5890bc99ba"`);
        await queryRunner.query(`DROP INDEX "finance"."IDX_91163b302301738c73b0b917a1"`);
        await queryRunner.query(`DROP INDEX "finance"."IDX_13c8d56c674c990666ac40dc79"`);
        await queryRunner.query(`DROP TABLE "finance"."payment_transaction"`);
        await queryRunner.query(`DROP TYPE "finance"."payment_transaction_status_enum"`);
        await queryRunner.query(`DROP TABLE "finance"."payment_method"`);
        await queryRunner.query(`DROP TYPE "finance"."payment_method_type_enum"`);
    }

}

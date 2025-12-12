import { MigrationInterface, QueryRunner } from "typeorm";

export class InitInventory1765550343869 implements MigrationInterface {
    name = 'InitInventory1765550343869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "inventory"`);
        await queryRunner.query(`CREATE TYPE "inventory"."inventory_transaction_transactiontype_enum" AS ENUM('IN_PURCHASE', 'OUT_SALES', 'TRANSFER', 'WASTE', 'ADJUSTMENT', 'PRODUCTION')`);
        await queryRunner.query(`CREATE TABLE "inventory"."inventory_transaction" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "transactionType" "inventory"."inventory_transaction_transactiontype_enum" NOT NULL, "quantity" numeric(10,3) NOT NULL, "referenceType" character varying(50), "referenceId" integer, "costAtTransaction" numeric(10,2), "expiryDate" TIMESTAMP, "batchNumber" character varying(50), "fk_product_id" integer NOT NULL, "fk_warehouse_id" integer NOT NULL, CONSTRAINT "PK_f58bbe29fa78f5b0d59d840d3ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory"."warehouse" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "name" character varying(100) NOT NULL, "location" character varying(255), CONSTRAINT "PK_965abf9f99ae8c5983ae74ebde8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory"."stock" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "quantity" numeric(10,3) NOT NULL DEFAULT '0', "minLimit" numeric(10,3) NOT NULL DEFAULT '0', "maxLimit" numeric(10,3) NOT NULL DEFAULT '0', "fk_product_id" integer NOT NULL, "fk_warehouse_id" integer NOT NULL, CONSTRAINT "UQ_72a6ef3d3afa4a9e0942cf57c6b" UNIQUE ("fk_product_id", "fk_warehouse_id"), CONSTRAINT "PK_092bc1fc7d860426a1dec5aa8e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory"."product_recipe" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "updated_by" integer, "is_active" boolean NOT NULL DEFAULT true, "quantityNeeded" numeric(10,3) NOT NULL, "fk_parent_product_id" integer NOT NULL, "fk_child_product_id" integer NOT NULL, CONSTRAINT "PK_87c7fb0c98a8d4049d8417d7968" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inventory"."inventory_transaction" ADD CONSTRAINT "FK_d6ba2514069b2e478ec3d3cdecf" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory"."inventory_transaction" ADD CONSTRAINT "FK_fa80e143819c9073fbbdb296539" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory"."inventory_transaction" ADD CONSTRAINT "FK_cafc70540f384ea3368f7e41c67" FOREIGN KEY ("fk_product_id") REFERENCES "catalog"."product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory"."inventory_transaction" ADD CONSTRAINT "FK_5596d74ea96fe8a8f72ddfe1c6a" FOREIGN KEY ("fk_warehouse_id") REFERENCES "inventory"."warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory"."warehouse" ADD CONSTRAINT "FK_5383d382219ad7c80f4c8a5f79c" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory"."warehouse" ADD CONSTRAINT "FK_31c47975c5c3b7a4644b442a6a1" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory"."stock" ADD CONSTRAINT "FK_175a0976a39ad6dc3cfc3e5b478" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory"."stock" ADD CONSTRAINT "FK_98ac2ee7760a929e9a28b901308" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory"."stock" ADD CONSTRAINT "FK_20680f2a0cfe0efc239f1da32bf" FOREIGN KEY ("fk_product_id") REFERENCES "catalog"."product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory"."stock" ADD CONSTRAINT "FK_3c98a9c6b6b7719856b3b0c02f6" FOREIGN KEY ("fk_warehouse_id") REFERENCES "inventory"."warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory"."product_recipe" ADD CONSTRAINT "FK_0131ae599952fadc772f09a9ee4" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory"."product_recipe" ADD CONSTRAINT "FK_94d63563d5e849bc1f0a7fd5a5e" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory"."product_recipe" ADD CONSTRAINT "FK_e903d8e4c0e8330f9a14813d58c" FOREIGN KEY ("fk_parent_product_id") REFERENCES "catalog"."product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory"."product_recipe" ADD CONSTRAINT "FK_139faa1cb9264463121b9d4460f" FOREIGN KEY ("fk_child_product_id") REFERENCES "catalog"."product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory"."product_recipe" DROP CONSTRAINT "FK_139faa1cb9264463121b9d4460f"`);
        await queryRunner.query(`ALTER TABLE "inventory"."product_recipe" DROP CONSTRAINT "FK_e903d8e4c0e8330f9a14813d58c"`);
        await queryRunner.query(`ALTER TABLE "inventory"."product_recipe" DROP CONSTRAINT "FK_94d63563d5e849bc1f0a7fd5a5e"`);
        await queryRunner.query(`ALTER TABLE "inventory"."product_recipe" DROP CONSTRAINT "FK_0131ae599952fadc772f09a9ee4"`);
        await queryRunner.query(`ALTER TABLE "inventory"."stock" DROP CONSTRAINT "FK_3c98a9c6b6b7719856b3b0c02f6"`);
        await queryRunner.query(`ALTER TABLE "inventory"."stock" DROP CONSTRAINT "FK_20680f2a0cfe0efc239f1da32bf"`);
        await queryRunner.query(`ALTER TABLE "inventory"."stock" DROP CONSTRAINT "FK_98ac2ee7760a929e9a28b901308"`);
        await queryRunner.query(`ALTER TABLE "inventory"."stock" DROP CONSTRAINT "FK_175a0976a39ad6dc3cfc3e5b478"`);
        await queryRunner.query(`ALTER TABLE "inventory"."warehouse" DROP CONSTRAINT "FK_31c47975c5c3b7a4644b442a6a1"`);
        await queryRunner.query(`ALTER TABLE "inventory"."warehouse" DROP CONSTRAINT "FK_5383d382219ad7c80f4c8a5f79c"`);
        await queryRunner.query(`ALTER TABLE "inventory"."inventory_transaction" DROP CONSTRAINT "FK_5596d74ea96fe8a8f72ddfe1c6a"`);
        await queryRunner.query(`ALTER TABLE "inventory"."inventory_transaction" DROP CONSTRAINT "FK_cafc70540f384ea3368f7e41c67"`);
        await queryRunner.query(`ALTER TABLE "inventory"."inventory_transaction" DROP CONSTRAINT "FK_fa80e143819c9073fbbdb296539"`);
        await queryRunner.query(`ALTER TABLE "inventory"."inventory_transaction" DROP CONSTRAINT "FK_d6ba2514069b2e478ec3d3cdecf"`);
        await queryRunner.query(`DROP TABLE "inventory"."product_recipe"`);
        await queryRunner.query(`DROP TABLE "inventory"."stock"`);
        await queryRunner.query(`DROP TABLE "inventory"."warehouse"`);
        await queryRunner.query(`DROP TABLE "inventory"."inventory_transaction"`);
        await queryRunner.query(`DROP TYPE "inventory"."inventory_transaction_transactiontype_enum"`);
    }

}

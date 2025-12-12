import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { TransactionType } from '../enums/transaction-type.enum';
import { Warehouse } from './warehouse.entity';
import { Product } from '../../catalog/entities/product.entity';

@Entity({ name: 'inventory_transaction', schema: 'inventory' })
export class InventoryTransaction extends BaseTransactionEntity {
    @Column({ type: 'enum', enum: TransactionType })
    transactionType: TransactionType;

    @Column({ type: 'decimal', precision: 10, scale: 3 })
    quantity: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    referenceType: string;

    @Column({ type: 'int', nullable: true })
    referenceId: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    costAtTransaction: number;

    @Column({ type: 'timestamp', nullable: true })
    expiryDate: Date;

    @Column({ type: 'varchar', length: 50, nullable: true })
    batchNumber: string;

    @Column({ name: 'fk_product_id', type: 'int' })
    fkProductId: number;

    @ManyToOne(() => Product, { nullable: false })
    @JoinColumn({ name: 'fk_product_id' })
    product: Product;

    @Column({ name: 'fk_warehouse_id', type: 'int' })
    fkWarehouseId: number;

    @ManyToOne(() => Warehouse, (warehouse) => warehouse.transactions, { nullable: false })
    @JoinColumn({ name: 'fk_warehouse_id' })
    warehouse: Warehouse;
}

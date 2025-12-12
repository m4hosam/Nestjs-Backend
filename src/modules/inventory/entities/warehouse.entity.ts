import { Entity, Column, OneToMany } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { Stock } from './stock.entity';
import { InventoryTransaction } from './inventory-transaction.entity';

@Entity({ name: 'warehouse', schema: 'inventory' })
export class Warehouse extends BaseTransactionEntity {
    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    location: string;

    @OneToMany(() => Stock, (stock) => stock.warehouse)
    stocks: Stock[];

    @OneToMany(() => InventoryTransaction, (tx) => tx.warehouse)
    transactions: InventoryTransaction[];
}

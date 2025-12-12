import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { Warehouse } from './warehouse.entity';
import { Product } from '../../catalog/entities/product.entity';

@Entity({ name: 'stock', schema: 'inventory' })
@Unique(['fkProductId', 'fkWarehouseId'])
export class Stock extends BaseTransactionEntity {
    @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
    minLimit: number;

    @Column({ type: 'decimal', precision: 10, scale: 3, default: 0 })
    maxLimit: number;

    @Column({ name: 'fk_product_id', type: 'int' })
    fkProductId: number;

    @ManyToOne(() => Product, { nullable: false })
    @JoinColumn({ name: 'fk_product_id' })
    product: Product;

    @Column({ name: 'fk_warehouse_id', type: 'int' })
    fkWarehouseId: number;

    @ManyToOne(() => Warehouse, (warehouse) => warehouse.stocks, { nullable: false })
    @JoinColumn({ name: 'fk_warehouse_id' })
    warehouse: Warehouse;
}

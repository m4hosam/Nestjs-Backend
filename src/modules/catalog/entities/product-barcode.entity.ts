import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { Product } from './product.entity';

@Entity({ name: 'product_barcode', schema: 'catalog' })
export class ProductBarcode extends BaseTransactionEntity {
    @Column({ type: 'varchar', length: 100, unique: true })
    @Index()
    barcode: string;

    @Column({ name: 'unit_factor', type: 'int', default: 1, comment: '1 for base unit' })
    unitFactor: number;

    @Column({ name: 'fk_product_id', type: 'int' })
    productId: number;

    @ManyToOne(() => Product, (product) => product.barcodes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fk_product_id' })
    product: Product;
}

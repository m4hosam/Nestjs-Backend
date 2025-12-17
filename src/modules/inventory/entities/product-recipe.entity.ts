import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { Product } from '../../catalog/entities/product.entity';

@Entity({ name: 'product_recipe', schema: 'inventory' })
export class ProductRecipe extends BaseTransactionEntity {
    @Column({ type: 'decimal', precision: 10, scale: 3 })
    quantityNeeded: number;

    @Column({ name: 'fk_parent_product_id', type: 'int' })
    fkParentProductId: number;

    @ManyToOne(() => Product, { nullable: false })
    @JoinColumn({ name: 'fk_parent_product_id' })
    parentProduct: Product;

    @Column({ name: 'fk_child_product_id', type: 'int' })
    fkChildProductId: number;

    @ManyToOne(() => Product, { nullable: false })
    @JoinColumn({ name: 'fk_child_product_id' })
    childProduct: Product;
}

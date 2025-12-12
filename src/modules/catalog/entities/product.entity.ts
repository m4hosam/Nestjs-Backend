import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { ProductType } from '../enums/product-type.enum';
import { Category } from './category.entity';
import { ProductBarcode } from './product-barcode.entity';
import { ModifierGroup } from './modifier-group.entity';

@Entity({ name: 'product', schema: 'catalog' })
export class Product extends BaseTransactionEntity {
    @Column({ type: 'enum', enum: ProductType, default: ProductType.SIMPLE })
    type: ProductType;

    @Column({ name: 'name_ar', type: 'varchar', length: 255 })
    nameAr: string;

    @Column({ name: 'name_en', type: 'varchar', length: 255 })
    nameEn: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'varchar', length: 50, unique: true })
    sku: string;

    @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
    taxRate: number;

    @Column({ name: 'cost_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
    costPrice: number;

    @Column({ name: 'sale_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
    salePrice: number;

    @Column({ name: 'is_stock_tracked', type: 'boolean', default: false })
    isStockTracked: boolean;

    @Column({ name: 'fk_category_id', type: 'int', nullable: true })
    categoryId: number | null;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'fk_category_id' })
    category: Category | null;

    @OneToMany(() => ProductBarcode, (barcode) => barcode.product, { cascade: true })
    barcodes: ProductBarcode[];

    @ManyToMany(() => ModifierGroup, (group) => group.products)
    @JoinTable({
        name: 'product_modifier_groups',
        joinColumn: { name: 'product_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'modifier_group_id', referencedColumnName: 'id' },
        schema: 'catalog'
    })
    modifierGroups: ModifierGroup[];
}

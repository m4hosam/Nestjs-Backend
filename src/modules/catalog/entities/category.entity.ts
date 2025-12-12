import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { Product } from './product.entity';

@Entity({ name: 'category', schema: 'catalog' })
export class Category extends BaseTransactionEntity {
    @Column({ name: 'name_ar', type: 'varchar', length: 255 })
    nameAr: string;

    @Column({ name: 'name_en', type: 'varchar', length: 255 })
    nameEn: string;

    @Column({ name: 'parent_id', type: 'int', nullable: true })
    parentId: number | null;

    @ManyToOne(() => Category, (category) => category.children, { nullable: true })
    @JoinColumn({ name: 'parent_id' })
    parent: Category;

    @OneToMany(() => Category, (category) => category.parent)
    children: Category[];

    @Column({ name: 'hierarchy_path', type: 'varchar', length: 500, nullable: true })
    @Index()
    hierarchyPath: string | null; // Materialized Path: "1/5/12"

    @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
    imageUrl: string | null;

    @Column({ name: 'sort_order', type: 'int', default: 0 })
    sortOrder: number;

    @Column({ name: 'printer_tag', type: 'varchar', length: 50, nullable: true })
    printerTag: string | null;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}

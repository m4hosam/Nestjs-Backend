import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { ModifierOption } from './modifier-option.entity';
import { Product } from './product.entity';

@Entity({ name: 'modifier_group', schema: 'catalog' })
export class ModifierGroup extends BaseTransactionEntity {
    @Column({ name: 'name_ar', type: 'varchar', length: 255 })
    nameAr: string;

    @Column({ name: 'name_en', type: 'varchar', length: 255 })
    nameEn: string;

    @OneToMany(() => ModifierOption, (option) => option.modifierGroup, { cascade: true })
    options: ModifierOption[];

    @ManyToMany(() => Product, (product) => product.modifierGroups)
    products: Product[];
}

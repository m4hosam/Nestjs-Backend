import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { ModifierGroup } from './modifier-group.entity';

@Entity({ name: 'modifier_option', schema: 'catalog' })
export class ModifierOption extends BaseTransactionEntity {
    @Column({ name: 'name_ar', type: 'varchar', length: 255 })
    nameAr: string;

    @Column({ name: 'name_en', type: 'varchar', length: 255 })
    nameEn: string;

    @Column({ name: 'price_impact', type: 'decimal', precision: 10, scale: 2, default: 0 })
    priceImpact: number;

    @Column({ name: 'cost_impact', type: 'decimal', precision: 10, scale: 2, default: 0 })
    costImpact: number;

    @Column({ name: 'fk_modifier_group_id', type: 'int' })
    modifierGroupId: number;

    @ManyToOne(() => ModifierGroup, (group) => group.options, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fk_modifier_group_id' })
    modifierGroup: ModifierGroup;
}

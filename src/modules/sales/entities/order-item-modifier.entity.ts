import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'order_item_modifier', schema: 'sales' })
export class OrderItemModifier extends BaseTransactionEntity {
    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ name: 'price_change', type: 'decimal', precision: 10, scale: 2 })
    priceChange: number;

    @Column({ name: 'fk_order_item_id', type: 'int' })
    fkOrderItemId: number;

    @ManyToOne(() => OrderItem, (orderItem) => orderItem.modifiers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fk_order_item_id' })
    orderItem: OrderItem;
}

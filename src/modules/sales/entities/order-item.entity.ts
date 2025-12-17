import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { Order } from './order.entity';
import { OrderItemModifier } from './order-item-modifier.entity';

@Entity({ name: 'order_item', schema: 'sales' })
export class OrderItem extends BaseTransactionEntity {
    @Column({ type: 'int' })
    quantity: number;

    @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2 })
    unitPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @Column({ type: 'text', nullable: true })
    note: string;

    @Column({ name: 'fk_order_id', type: 'int' })
    fkOrderId: number;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'fk_order_id' })
    order: Order;

    // Ideally linked to Product Entity from Inventory Module
    @Column({ name: 'fk_product_id', type: 'int' })
    fkProductId: number;

    @OneToMany(() => OrderItemModifier, (modifier) => modifier.orderItem, { cascade: true })
    modifiers: OrderItemModifier[];
}

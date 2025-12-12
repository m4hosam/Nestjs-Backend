import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { Shift } from './shift.entity';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { OrderType, OrderStatus } from '../enums/sales.enums';

@Entity({ name: 'order', schema: 'sales' })
export class Order extends BaseTransactionEntity {
    @Index({ unique: true })
    @Column({ name: 'order_number', type: 'varchar', length: 50 })
    orderNumber: string;

    @Column({ type: 'enum', enum: OrderType })
    type: OrderType;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ name: 'tax_amount', type: 'decimal', precision: 10, scale: 2 })
    taxAmount: number;

    @Column({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
    discountAmount: number;

    @Column({ name: 'zatca_uuid', type: 'varchar', nullable: true })
    zatcaUuid: string;

    @Column({ name: 'zatca_hash', type: 'varchar', nullable: true })
    zatcaHash: string;

    @Column({ name: 'fk_shift_id', type: 'int', nullable: true })
    fkShiftId: number;

    @ManyToOne(() => Shift, (shift) => shift.orders)
    @JoinColumn({ name: 'fk_shift_id' })
    shift: Shift;

    @Column({ name: 'fk_user_id', type: 'int' })
    fkUserId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'fk_user_id' })
    user: User;

    // Assuming Customer/Table are valid entities in other modules or this one
    @Column({ name: 'fk_customer_id', type: 'int', nullable: true })
    fkCustomerId: number;

    @Column({ name: 'fk_table_id', type: 'int', nullable: true })
    fkTableId: number;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];
}

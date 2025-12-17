import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { User } from '../../users/entities/user.entity';
import { Order } from './order.entity';

@Entity({ name: 'shift', schema: 'sales' })
export class Shift extends BaseTransactionEntity {
    @Column({ name: 'start_time', type: 'timestamp' })
    startTime: Date;

    @Column({ name: 'end_time', type: 'timestamp', nullable: true })
    endTime: Date;

    @Column({ name: 'opening_balance', type: 'decimal', precision: 10, scale: 2 })
    openingBalance: number;

    @Column({ name: 'closing_balance_declared', type: 'decimal', precision: 10, scale: 2, nullable: true })
    closingBalanceDeclared: number;

    @Column({ name: 'closing_balance_system', type: 'decimal', precision: 10, scale: 2, nullable: true })
    closingBalanceSystem: number;

    @Column({ name: 'difference', type: 'decimal', precision: 10, scale: 2, nullable: true })
    difference: number;

    @Column({ name: 'fk_user_id', type: 'int', nullable: false })
    fkUserId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'fk_user_id' })
    user: User;

    @OneToMany(() => Order, (order) => order.shift)
    orders: Order[];
}

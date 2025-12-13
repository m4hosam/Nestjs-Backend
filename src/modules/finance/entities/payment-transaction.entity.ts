import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { PaymentMethod } from './payment-method.entity';

export enum PaymentStatus {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

@Entity({ name: 'payment_transaction', schema: 'finance' })
@Index(['orderId'])
@Index(['shiftId'])
export class PaymentTransaction extends BaseTransactionEntity {
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ name: 'order_id', type: 'int' })
    orderId: number; // Relation to SalesModule.Order (Loose coupling)

    @Column({ name: 'payment_method_id', type: 'int' })
    paymentMethodId: number;

    @ManyToOne(() => PaymentMethod, (method) => method.transactions)
    @JoinColumn({ name: 'payment_method_id' })
    paymentMethod: PaymentMethod;

    @Column({ name: 'shift_id', type: 'int', nullable: true })
    shiftId: number | null; // Relation to ShiftsModule.Shift (Loose coupling)

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.SUCCESS,
    })
    status: PaymentStatus;

    @Column({ name: 'external_reference', type: 'varchar', length: 255, nullable: true })
    externalReference: string | null;

    @Column({ name: 'response_json', type: 'json', nullable: true })
    responseJson: any;
}

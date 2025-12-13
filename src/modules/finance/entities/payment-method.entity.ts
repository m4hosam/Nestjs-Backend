import { Entity, Column, OneToMany } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { PaymentTransaction } from './payment-transaction.entity';

export enum PaymentMethodType {
    CASH = 'CASH',
    CARD = 'CARD',
    DIGITAL_WALLET = 'DIGITAL_WALLET',
    CREDIT = 'CREDIT',
}

@Entity({ name: 'payment_method', schema: 'finance' })
export class PaymentMethod extends BaseTransactionEntity {
    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({
        type: 'enum',
        enum: PaymentMethodType,
        default: PaymentMethodType.CASH,
    })
    type: PaymentMethodType;

    // @Column({ name: 'is_active', type: 'boolean', default: true })
    // isActive: boolean;

    @Column({ name: 'require_reference', type: 'boolean', default: false })
    requireReference: boolean;

    @OneToMany(() => PaymentTransaction, (transaction) => transaction.paymentMethod)
    transactions: PaymentTransaction[];
}

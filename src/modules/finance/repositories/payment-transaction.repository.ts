import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from '../../../common/repositories/generic.repository';
import { PaymentTransaction, PaymentStatus } from '../entities/payment-transaction.entity';

@Injectable()
export class PaymentTransactionRepository extends GenericRepository<PaymentTransaction> {
    constructor(
        @InjectRepository(PaymentTransaction)
        private readonly repo: Repository<PaymentTransaction>,
    ) {
        super(repo);
    }

    async getSumSuccessfulByOrder(orderId: number): Promise<number> {
        const result = await this.repo
            .createQueryBuilder('txn')
            .select('SUM(txn.amount)', 'total')
            .where('txn.order_id = :orderId', { orderId })
            .andWhere('txn.status = :status', { status: PaymentStatus.SUCCESS })
            .getRawOne();

        return result && result.total ? parseFloat(result.total) : 0;
    }
}

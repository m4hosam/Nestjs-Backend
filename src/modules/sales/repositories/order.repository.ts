import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from '../../../common/repositories/generic.repository';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderRepository extends GenericRepository<Order> {
    constructor(
        @InjectRepository(Order)
        private readonly repo: Repository<Order>,
    ) {
        super(repo);
    }

    async getShiftTotal(shiftId: number): Promise<number> {
        const { total } = await this.repo
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'total')
            .where('order.fkShiftId = :shiftId', { shiftId })
            .andWhere('order.status = :status', { status: 'COMPLETED' })
            .getRawOne();

        return parseFloat(total) || 0;
    }
}

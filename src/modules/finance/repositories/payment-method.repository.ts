import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from '../../../common/repositories/generic.repository';
import { PaymentMethod } from '../entities/payment-method.entity';

@Injectable()
export class PaymentMethodRepository extends GenericRepository<PaymentMethod> {
    constructor(
        @InjectRepository(PaymentMethod)
        private readonly repo: Repository<PaymentMethod>,
    ) {
        super(repo);
    }

    async findActiveMethod(id: number): Promise<PaymentMethod | null> {
        return this.repo.findOne({
            where: { id, isActive: true },
        });
    }
}

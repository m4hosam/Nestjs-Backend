import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from '../../../common/repositories/generic.repository';
import { Stock } from '../entities/stock.entity';

@Injectable()
export class StockRepository extends GenericRepository<Stock> {
    constructor(
        @InjectRepository(Stock)
        private readonly repo: Repository<Stock>,
    ) {
        super(repo);
    }

    async findByProductAndWarehouse(productId: number, warehouseId: number): Promise<Stock | null> {
        return this.repo.findOne({
            where: {
                fkProductId: productId,
                fkWarehouseId: warehouseId,
            },
        });
    }
}

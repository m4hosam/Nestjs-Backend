import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from '../../../common/repositories/generic.repository';
import { InventoryTransaction } from '../entities/inventory-transaction.entity';

@Injectable()
export class InventoryTransactionRepository extends GenericRepository<InventoryTransaction> {
    constructor(
        @InjectRepository(InventoryTransaction)
        private readonly repo: Repository<InventoryTransaction>,
    ) {
        super(repo);
    }

    async findBatchesForProduct(productId: number, warehouseId: number): Promise<InventoryTransaction[]> {
        return this.repo.find({
            where: {
                fkProductId: productId,
                fkWarehouseId: warehouseId,
                // Assuming positive quantity implies IN_PURCHASE or similar inflow
            },
            order: {
                expiryDate: 'ASC',
                createdAt: 'ASC',
            },
        });
    }
}

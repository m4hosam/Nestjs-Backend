import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from '../../../common/repositories/generic.repository';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository extends GenericRepository<Product> {
    constructor(
        @InjectRepository(Product)
        private readonly repo: Repository<Product>,
    ) {
        super(repo);
    }

    async findWithDetails(id: number): Promise<Product | null> {
        return this.repo.findOne({
            where: { id },
            relations: [
                'category',
                'barcodes',
                'modifierGroups',
                'modifierGroups.options'
            ],
        });
    }
}

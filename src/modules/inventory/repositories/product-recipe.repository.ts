import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from '../../../common/repositories/generic.repository';
import { ProductRecipe } from '../entities/product-recipe.entity';

@Injectable()
export class ProductRecipeRepository extends GenericRepository<ProductRecipe> {
    constructor(
        @InjectRepository(ProductRecipe)
        private readonly repo: Repository<ProductRecipe>,
    ) {
        super(repo);
    }

    async findByParentId(parentId: number): Promise<ProductRecipe[]> {
        return this.repo.find({
            where: { fkParentProductId: parentId },
            relations: ['childProduct'],
        });
    }
}

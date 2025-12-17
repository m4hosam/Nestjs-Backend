import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from '../../../common/repositories/generic.repository';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryRepository extends GenericRepository<Category> {
    constructor(
        @InjectRepository(Category)
        private readonly repo: Repository<Category>,
    ) {
        super(repo);
    }

    /**
     * Updates the hierarchy path for a category and all its children
     * Used when a category is moved
     */
    async updateHierarchyPaths(oldPathPrefix: string, newPathPrefix: string): Promise<void> {
        await this.repo.query(
            `UPDATE catalog.category 
       SET hierarchy_path = REGEXP_REPLACE(hierarchy_path, '^${oldPathPrefix}', '${newPathPrefix}')
       WHERE hierarchy_path LIKE '${oldPathPrefix}%'`
        );
    }
}

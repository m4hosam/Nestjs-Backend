import { Injectable } from '@nestjs/common';
import { GenericService } from '../../../common/services/generic.service';
import { Category } from '../entities/category.entity';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryCreateDto, CategoryUpdateDto, CategoryResponseDto } from '../dto/category.dto';
import { BusinessValidationException } from '../../../common/exceptions/business-validation.exception';
import { NotFoundException } from '../../../common/exceptions/not-found.exception';

@Injectable()
export class CategoryService extends GenericService<
    Category,
    CategoryCreateDto,
    CategoryUpdateDto,
    CategoryResponseDto
> {
    constructor(private readonly repo: CategoryRepository) {
        super(repo, 'Category');
    }

    toResponseDto(entity: Category): CategoryResponseDto {
        return {
            id: entity.id,
            name_ar: entity.nameAr,
            name_en: entity.nameEn,
            parent_id: entity.parentId,
            hierarchy_path: entity.hierarchyPath,
            printer_tag: entity.printerTag,
            sort_order: entity.sortOrder,
            is_active: entity.isActive,
        };
    }

    toEntity(dto: CategoryCreateDto | CategoryUpdateDto): Partial<Category> {
        return {
            nameAr: dto.name_ar,
            nameEn: dto.name_en,
            parentId: dto.parent_id ?? null,
            printerTag: dto.printer_tag ?? null,
            sortOrder: dto.sort_order,
            imageUrl: dto.image_url ?? null,
        };
    }

    async create(dto: CategoryCreateDto, userId?: number): Promise<CategoryResponseDto> {
        // 1. Basic entity creation (without path initially)
        const entity = this.toEntity(dto);
        if (userId) entity.createdBy = userId;

        // Save to generate ID
        let savedCategory = await this.repo.create(entity);

        // 2. Generate Materialized Path
        let path = `${savedCategory.id}`;
        if (dto.parent_id) {
            const parent = await this.repo.findById(dto.parent_id);
            if (!parent) {
                throw new NotFoundException({ key: 'PARENT_CATEGORY_NOT_FOUND', message: 'Parent category not found' });
            }
            const parentPath = parent.hierarchyPath ?? `${parent.id}`;
            path = `${parentPath}/${savedCategory.id}`;
        }

        // 3. Update path
        const updated = await this.repo.update(savedCategory.id, { hierarchyPath: path });
        if (!updated) throw new NotFoundException({ key: 'CATEGORY_NOT_FOUND', message: 'Category not found' });
        savedCategory = updated;

        return this.toResponseDto(savedCategory);
    }

    async update(dto: CategoryUpdateDto, userId?: number): Promise<CategoryResponseDto> {
        const category = await this.repo.findById(dto.id);
        if (!category) throw new NotFoundException({ key: 'CATEGORY_NOT_FOUND', message: 'Category not found' });

        // 1. Check for Circular Dependency if parent changed
        if (dto.parent_id !== undefined && dto.parent_id !== category.parentId) {
            if (dto.parent_id === category.id) {
                throw new BusinessValidationException({ key: 'CATEGORY_CANNOT_BE_OWN_PARENT', message: 'Category cannot be its own parent' });
            }

            if (dto.parent_id) {
                const newParent = await this.repo.findById(dto.parent_id);
                if (!newParent) throw new NotFoundException({ key: 'NEW_PARENT_NOT_FOUND', message: 'New parent not found' });

                const categoryPath = category.hierarchyPath ?? `${category.id}`;
                const newParentPath = newParent.hierarchyPath ?? `${newParent.id}`;

                // Check if new parent is a child of current category
                if (newParentPath.startsWith(categoryPath + '/')) {
                    throw new BusinessValidationException({ key: 'CIRCULAR_DEPENDENCY_DETECTED', message: 'Circular dependency detected' });
                }

                // 2. Update hierarchy paths for children
                const oldPath = categoryPath;
                const newPath = `${newParentPath}/${category.id}`;

                await this.repo.updateHierarchyPaths(oldPath, newPath);

                // Update local object for final save
                category.hierarchyPath = newPath;
            } else {
                // Moved to root
                const oldPath = category.hierarchyPath ?? `${category.id}`;
                const newPath = `${category.id}`;
                await this.repo.updateHierarchyPaths(oldPath, newPath);
                category.hierarchyPath = newPath;
            }
        }

        // Standard update
        return super.update(dto, userId);
    }
}

import { Injectable } from '@nestjs/common';
import { GenericService } from '../../../common/services/generic.service';
import { Product } from '../entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';
import { ProductCreateDto, ProductUpdateDto, ProductDetailResponseDto } from '../dto/product.dto';
import { ProductBarcode } from '../entities/product-barcode.entity';
import { ModifierGroup } from '../entities/modifier-group.entity';
import { NotFoundException } from '../../../common/exceptions/not-found.exception';

@Injectable()
export class ProductService extends GenericService<
    Product,
    ProductCreateDto,
    ProductUpdateDto,
    ProductDetailResponseDto
> {
    constructor(private readonly repo: ProductRepository) {
        super(repo, 'Product');
    }

    // Basic toResponseDto for generic lists (simplified)
    toResponseDto(entity: Product): ProductDetailResponseDto {
        return {
            id: entity.id,
            sku: entity.sku,
            names: { ar: entity.nameAr, en: entity.nameEn },
            pricing: { cost: Number(entity.costPrice), sale: Number(entity.salePrice), tax: Number(entity.taxRate) },
            category: entity.category ? {
                id: entity.category.id,
                name: entity.category.nameEn,
                path: entity.category.hierarchyPath
            } : null,
            barcodes_list: entity.barcodes ? entity.barcodes.map(b => ({ barcode: b.barcode, unit_factor: b.unitFactor })) : [],
            modifier_groups: entity.modifierGroups ? entity.modifierGroups.map(mg => ({ id: mg.id, name: mg.nameEn })) : [],
            is_active: entity.isActive
        };
    }

    // Extended Detail Mapper
    toDetailResponseDto(entity: Product): ProductDetailResponseDto {
        const dto = this.toResponseDto(entity);
        if (entity.modifierGroups) {
            dto.modifier_groups = entity.modifierGroups.map(mg => ({
                id: mg.id,
                name_ar: mg.nameAr,
                name_en: mg.nameEn,
                options: mg.options ? mg.options.map(opt => ({
                    id: opt.id,
                    name: opt.nameEn,
                    price: opt.priceImpact
                })) : []
            }));
        }
        return dto;
    }

    toEntity(dto: ProductCreateDto | ProductUpdateDto): Partial<Product> {
        const product = new Product();
        product.type = dto.type;
        product.nameAr = dto.name_ar;
        product.nameEn = dto.name_en;
        product.sku = dto.sku;
        product.description = dto.description ?? null;
        product.salePrice = dto.sale_price;
        product.costPrice = dto.cost_price;
        product.taxRate = dto.tax_rate;
        product.isStockTracked = dto.is_stock_tracked;
        product.categoryId = dto.category_id ?? null;
        return product;
    }

    async create(dto: ProductCreateDto, userId?: number): Promise<ProductDetailResponseDto> {
        // 1. Prepare base entity
        const entityData = this.toEntity(dto);
        if (userId) entityData.createdBy = userId;

        // 2. Handle Barcodes (Cascade via TypeORM works, but mapping needed)
        if (dto.barcodes && dto.barcodes.length > 0) {
            entityData.barcodes = dto.barcodes.map(b => {
                const barcode = new ProductBarcode();
                barcode.barcode = b.barcode;
                barcode.unitFactor = b.unit_factor;
                barcode.createdBy = userId;
                return barcode;
            });
        }

        // 3. Handle Modifier Groups (Many-to-Many needs explicit ID reference or object loading)
        if (dto.modifier_group_ids && dto.modifier_group_ids.length > 0) {
            entityData.modifierGroups = dto.modifier_group_ids.map(id => ({ id } as ModifierGroup));
        }

        // 4. Save
        const savedProduct = await this.repo.create(entityData);

        // 5. Reload for relations to return full detail
        const reloaded = await this.repo.findWithDetails(savedProduct.id);
        return this.toResponseDto(reloaded!);
    }

    async getProductDetails(id: number): Promise<ProductDetailResponseDto> {
        const product = await this.repo.findWithDetails(id);
        if (!product) throw new NotFoundException({ key: 'PRODUCT_NOT_FOUND', message: 'Product not found' });
        return this.toDetailResponseDto(product);
    }
}

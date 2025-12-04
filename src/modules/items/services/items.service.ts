import { Injectable } from '@nestjs/common';
import { GenericService } from '../../../services/generic/generic.service';
import { Item } from '../../../entities/items/item.entity';
import { CreateItemDto } from '../dto/create-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { ItemResponseDto } from '../dto/item-response.dto';
import { ItemRepository } from '../../../repositories/items/item.repository';
import { plainToInstance } from 'class-transformer';
import { BusinessValidationException } from '../../../common/exceptions/business-validation.exception';

@Injectable()
export class ItemsService extends GenericService<
  Item,
  CreateItemDto,
  UpdateItemDto,
  ItemResponseDto
> {
  constructor(private readonly itemRepository: ItemRepository) {
    super(itemRepository, 'Item');
  }

  toResponseDto(item: Item): ItemResponseDto {
    return plainToInstance(ItemResponseDto, item, {
      excludeExtraneousValues: true,
    });
  }

  toEntity(dto: CreateItemDto | UpdateItemDto): Partial<Item> {
    return {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      sku: dto.sku,
      stockQuantity: dto.stockQuantity,
    };
  }

  async findEntityById(id: number): Promise<Item | null> {
    return this.itemRepository.findById(id);
  }

  async create(dto: CreateItemDto, userId?: number): Promise<ItemResponseDto> {
    const existingSku = await this.itemRepository.findBySku(dto.sku);
    if (existingSku) {
      throw new BusinessValidationException('SKU_ALREADY_EXISTS');
    }

    return super.create(dto, userId);
  }

  async update(dto: UpdateItemDto, userId?: number): Promise<ItemResponseDto> {
    if (dto.sku) {
      const existingSku = await this.itemRepository.findBySku(dto.sku);
      if (existingSku && existingSku.id !== dto.id) {
        throw new BusinessValidationException('SKU_ALREADY_EXISTS');
      }
    }

    return super.update(dto, userId);
  }
}

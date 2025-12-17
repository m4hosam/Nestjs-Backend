import { Injectable } from '@nestjs/common';
import { GenericService } from '../../../common/services/generic.service';
import { Area } from '../entities/area.entity';
import { AreaRepository } from '../repositories/area.repository';
import { CreateAreaDto, UpdateAreaDto, AreaResponseDto } from '../dto/area.dto';

@Injectable()
export class AreaService extends GenericService<
    Area,
    CreateAreaDto,
    UpdateAreaDto,
    AreaResponseDto
> {
    constructor(private readonly areaRepository: AreaRepository) {
        super(areaRepository, 'Area');
    }

    toResponseDto(entity: Area): AreaResponseDto {
        return {
            id: entity.id,
            name: entity.name,
            isActive: entity.isActive,
        };
    }

    toEntity(dto: CreateAreaDto | UpdateAreaDto): Partial<Area> {
        const entity: Partial<Area> = {};
        if ('name' in dto) entity.name = dto.name;
        return entity;
    }
}

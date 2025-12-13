import { Injectable } from '@nestjs/common';
import { GenericService } from '../../../common/services/generic.service';
import { Table } from '../entities/table.entity';
import { TableRepository } from '../repositories/table.repository';
import {
    CreateTableDto,
    UpdateTableDto,
    TableResponseDto,
    AssignTableDto
} from '../dto/table.dto';
import { TableStatus } from '../enums/restaurant.enums';
import { BusinessValidationException } from '../../../common/exceptions/business-validation.exception';
import { NotFoundException } from '../../../common/exceptions/not-found.exception';

@Injectable()
export class TableService extends GenericService<
    Table,
    CreateTableDto,
    UpdateTableDto,
    TableResponseDto
> {
    constructor(private readonly tableRepository: TableRepository) {
        super(tableRepository, 'Table');
    }

    toResponseDto(entity: Table): TableResponseDto {
        return {
            id: entity.id,
            name: entity.name,
            capacity: entity.capacity,
            status: entity.status,
            areaId: entity.fkAreaId,
            activeOrderId: entity.activeOrderId,
        };
    }

    toEntity(dto: CreateTableDto | UpdateTableDto): Partial<Table> {
        const entity: Partial<Table> = {};
        if ('name' in dto) entity.name = dto.name;
        if ('capacity' in dto) entity.capacity = dto.capacity;
        if ('areaId' in dto) entity.fkAreaId = dto.areaId;
        return entity;
    }

    async assignTableToOrder(id: number, assignDto: AssignTableDto, userId?: number): Promise<TableResponseDto> {
        const table = await this.tableRepository.findById(id);

        if (!table) {
            throw new NotFoundException({ key: 'TABLE_NOT_FOUND', message: 'Table not found' });
        }

        if (table.status !== TableStatus.AVAILABLE) {
            throw new BusinessValidationException({
                key: 'TABLE_NOT_AVAILABLE',
                message: 'Table is not available'
            }, {
                currentStatus: table.status
            });
        }

        const updatedTable = await this.tableRepository.update(id, {
            status: TableStatus.OCCUPIED,
            activeOrderId: assignDto.orderId,
            updatedBy: userId
        });

        return this.toResponseDto(updatedTable as Table);
    }

    async releaseTable(id: number, userId?: number): Promise<TableResponseDto> {
        const table = await this.tableRepository.findById(id);

        if (!table) {
            throw new NotFoundException({ key: 'TABLE_NOT_FOUND', message: 'Table not found' });
        }

        const updatedTable = await this.tableRepository.update(id, {
            status: TableStatus.AVAILABLE,
            activeOrderId: null,
            updatedBy: userId
        });

        return this.toResponseDto(updatedTable as Table);
    }
}

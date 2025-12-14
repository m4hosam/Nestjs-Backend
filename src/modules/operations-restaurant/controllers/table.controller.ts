import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, Patch, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TableService } from '../services/table.service';
import { CreateTableDto, UpdateTableDto, TableResponseDto, AssignTableDto } from '../dto/table.dto';
import { BaseFilterDto } from '../../../common/dto/base-filter.dto';
import { ApiResponseWrapper } from '../../../common/decorators/api-response.decorator';
import { PaginatedResult } from '../../../common/interfaces/pagination.interface';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Restaurant Operations - Tables')
@ApiBearerAuth()
@Controller('operations/restaurant/tables')
// @UseGuards(JwtAuthGuard)
export class TableController {
    constructor(private readonly tableService: TableService) { }

    @Post()
    @ApiResponseWrapper(TableResponseDto)
    async create(@Body() createDto: CreateTableDto, @Req() req: any): Promise<TableResponseDto> {
        return this.tableService.create(createDto, req.user?.id);
    }

    @Get()
    @ApiResponseWrapper(TableResponseDto, true, true)
    async findAll(@Query() filterDto: BaseFilterDto): Promise<PaginatedResult<TableResponseDto>> {
        return this.tableService.findWithPagination(
            { page: filterDto.page, limit: filterDto.limit },
            {
                order: { [filterDto.sortBy as string]: filterDto.sortOrder },
                relations: ['area'] // Eager load area
            }
        );
    }

    @Get(':id')
    @ApiResponseWrapper(TableResponseDto)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<TableResponseDto> {
        return this.tableService.findById(id);
    }

    @Put(':id')
    @ApiResponseWrapper(TableResponseDto)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateTableDto,
        @Req() req: any
    ): Promise<TableResponseDto> {
        updateDto.id = id;
        return this.tableService.update(updateDto, req.user?.id);
    }

    @Delete(':id')
    @ApiResponseWrapper(Boolean)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.tableService.softDelete(id);
    }

    @Patch(':id/assign')
    @ApiOperation({ summary: 'Assign an order to a table (Occupied)' })
    @ApiResponseWrapper(TableResponseDto)
    async assignTable(
        @Param('id', ParseIntPipe) id: number,
        @Body() assignDto: AssignTableDto,
        @Req() req: any
    ): Promise<TableResponseDto> {
        return this.tableService.assignTableToOrder(id, assignDto, req.user?.id);
    }

    @Patch(':id/release')
    @ApiOperation({ summary: 'Release a table (Available)' })
    @ApiResponseWrapper(TableResponseDto)
    async releaseTable(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any
    ): Promise<TableResponseDto> {
        return this.tableService.releaseTable(id, req.user?.id);
    }
}

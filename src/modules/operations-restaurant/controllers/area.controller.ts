import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AreaService } from '../services/area.service';
import { CreateAreaDto, UpdateAreaDto, AreaResponseDto } from '../dto/area.dto';
import { BaseFilterDto } from '../../../common/dto/base-filter.dto';
import { ApiResponseWrapper } from '../../../common/decorators/api-response.decorator';
import { PaginatedResult } from '../../../common/interfaces/pagination.interface';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

@ApiTags('Restaurant Operations - Areas')
@ApiBearerAuth()
@Controller('operations/restaurant/areas')
@UseGuards(JwtAuthGuard)
export class AreaController {
    constructor(private readonly areaService: AreaService) { }

    @Post()
    @ApiResponseWrapper(AreaResponseDto)
    async create(@Body() createDto: CreateAreaDto, @Req() req: any): Promise<AreaResponseDto> {
        return this.areaService.create(createDto, req.user?.id);
    }

    @Get()
    @ApiResponseWrapper(AreaResponseDto, true, true)
    async findAll(@Query() filterDto: BaseFilterDto): Promise<PaginatedResult<AreaResponseDto>> {
        return this.areaService.findWithPagination(
            { page: filterDto.page, limit: filterDto.limit },
            { order: { [filterDto.sortBy as string]: filterDto.sortOrder } }
        );
    }

    @Get(':id')
    @ApiResponseWrapper(AreaResponseDto)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<AreaResponseDto> {
        return this.areaService.findById(id);
    }

    @Put(':id')
    @ApiResponseWrapper(AreaResponseDto)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateAreaDto,
        @Req() req: any
    ): Promise<AreaResponseDto> {
        updateDto.id = id;
        return this.areaService.update(updateDto, req.user?.id);
    }

    @Delete(':id')
    @ApiResponseWrapper(Boolean)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.areaService.softDelete(id);
    }
}

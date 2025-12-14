import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { CategoryCreateDto, CategoryUpdateDto, CategoryResponseDto } from '../dto/category.dto';
import { BaseFilterDto } from '../../../common/dto/base-filter.dto';
import { ApiResponseWrapper } from '../../../common/decorators/api-response.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Catalog: Categories')
@Controller('categories')
// @UseGuards(JwtAuthGuard)
export class CategoryController {
    constructor(private readonly service: CategoryService) { }

    @Post()
    @ApiResponseWrapper(CategoryResponseDto)
    async create(@Body() dto: CategoryCreateDto) {
        // TODO: Extract user ID from Request (via decorator or request object)
        const mockUserId = 1;
        return this.service.create(dto, mockUserId);
    }

    @Get()
    @Public()
    @ApiResponseWrapper(CategoryResponseDto, false, true)
    async findAll(@Query() filter: BaseFilterDto) {
        return this.service.findWithPagination(filter);
    }

    @Get(':id')
    @Public()
    @ApiResponseWrapper(CategoryResponseDto)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findById(id);
    }

    @Put(':id')
    @ApiResponseWrapper(CategoryResponseDto)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CategoryUpdateDto
    ) {
        dto.id = id;
        const mockUserId = 1;
        return this.service.update(dto, mockUserId);
    }
}

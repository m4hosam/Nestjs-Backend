import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { ProductCreateDto, ProductUpdateDto, ProductDetailResponseDto } from '../dto/product.dto';
import { BaseFilterDto } from '../../../common/dto/base-filter.dto';
import { ApiResponseWrapper } from '../../../common/decorators/api-response.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Public } from '../../../common/decorators/public.decorator';

@ApiTags('Catalog: Products')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
    constructor(private readonly service: ProductService) { }

    @Post()
    @ApiResponseWrapper(ProductDetailResponseDto)
    async create(@Body() dto: ProductCreateDto) {
        const mockUserId = 1;
        return this.service.create(dto, mockUserId);
    }

    @Get()
    @Public()
    @ApiResponseWrapper(ProductDetailResponseDto, false, true)
    async findAll(@Query() filter: BaseFilterDto) {
        return this.service.findWithPagination(filter, {
            relations: ['category', 'barcodes', 'modifierGroups']
        });
    }

    @Get(':id')
    @Public()
    @ApiResponseWrapper(ProductDetailResponseDto)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.getProductDetails(id);
    }

    @Put(':id')
    @ApiResponseWrapper(ProductDetailResponseDto)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ProductUpdateDto
    ) {
        dto.id = id;
        const mockUserId = 1;
        return this.service.update(dto, mockUserId);
    }
}

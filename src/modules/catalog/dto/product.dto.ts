import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from '../enums/product-type.enum';

export class BarcodeDto {
    @ApiProperty()
    @IsString()
    barcode: string;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    unit_factor: number;
}

export class ProductCreateDto {
    @ApiProperty({ enum: ProductType })
    @IsEnum(ProductType)
    type: ProductType;

    @ApiProperty()
    @IsString()
    name_ar: string;

    @ApiProperty()
    @IsString()
    name_en: string;

    @ApiProperty()
    @IsString()
    sku: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsNumber()
    sale_price: number;

    @ApiProperty()
    @IsNumber()
    cost_price: number;

    @ApiProperty()
    @IsNumber()
    tax_rate: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    category_id?: number;

    @ApiProperty()
    @IsBoolean()
    is_stock_tracked: boolean;

    @ApiPropertyOptional({ type: [BarcodeDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BarcodeDto)
    barcodes?: BarcodeDto[];

    @ApiPropertyOptional({ type: [Number] })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    modifier_group_ids?: number[];
}

export class ProductUpdateDto extends ProductCreateDto {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}

export class ProductDetailResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    sku: string;

    @ApiProperty()
    names: { ar: string; en: string };

    @ApiProperty()
    pricing: { cost: number; sale: number; tax: number };

    @ApiProperty({ nullable: true })
    category: { id: number; name: string; path: string | null } | null;

    @ApiProperty({ type: [BarcodeDto] })
    barcodes_list: BarcodeDto[];

    @ApiProperty()
    modifier_groups: any[];

    @ApiProperty()
    is_active: boolean;
}

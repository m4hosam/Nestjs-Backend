import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryCreateDto {
    @ApiProperty()
    @IsString()
    name_ar: string;

    @ApiProperty()
    @IsString()
    name_en: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    parent_id?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    printer_tag?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    sort_order?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    image_url?: string;
}

export class CategoryUpdateDto extends CategoryCreateDto {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}

export class CategoryResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name_ar: string;

    @ApiProperty()
    name_en: string;

    @ApiProperty({ nullable: true })
    parent_id: number | null;

    @ApiProperty()
    hierarchy_path: string | null;

    @ApiProperty({ nullable: true })
    printer_tag: string | null;

    @ApiProperty()
    sort_order: number;

    @ApiProperty()
    is_active: boolean;
}

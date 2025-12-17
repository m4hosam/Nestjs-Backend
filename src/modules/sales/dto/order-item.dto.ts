import { IsNumber, IsOptional, IsString, IsArray, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ModifierDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNumber()
    priceChange: number;
}

export class CreateOrderItemDto {
    @ApiProperty()
    @IsNumber()
    productId: number;

    @ApiProperty()
    @IsNumber()
    @Min(1)
    quantity: number;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    unitPrice: number; // In a real app, this should often come from DB to prevent tampering

    @ApiPropertyOptional({ type: [ModifierDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ModifierDto)
    modifiers?: ModifierDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    note?: string;
}

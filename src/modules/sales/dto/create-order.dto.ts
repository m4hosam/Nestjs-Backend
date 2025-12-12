import { IsEnum, IsNumber, IsOptional, ValidateNested, IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderType } from '../enums/sales.enums';
import { CreateOrderItemDto } from './order-item.dto';

export class CreateOrderDto {
    @ApiProperty({ enum: OrderType })
    @IsEnum(OrderType)
    type: OrderType;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    customerId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    tableId?: number;

    @ApiProperty({ type: [CreateOrderItemDto] })
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}

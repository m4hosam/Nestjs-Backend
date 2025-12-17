import { IsEnum, IsNumber, IsOptional, IsString, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../enums/transaction-type.enum';

export class CreateTransactionRequestDto {
    @ApiProperty()
    @IsNumber()
    warehouseId: number;

    @ApiProperty()
    @IsNumber()
    productId: number;

    @ApiProperty({ enum: TransactionType })
    @IsEnum(TransactionType)
    transactionType: TransactionType;

    @ApiProperty()
    @IsNumber()
    quantity: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    referenceType?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    referenceId?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    batchNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    expiryDate?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    costAtTransaction?: number;
}

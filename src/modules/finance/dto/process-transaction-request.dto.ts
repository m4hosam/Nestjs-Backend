import { IsInt, IsNumber, IsNotEmpty, Min, IsOptional, IsString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProcessTransactionRequestDto {
    @ApiProperty({ example: 101 })
    @IsInt()
    @IsNotEmpty()
    orderId: number;

    @ApiProperty({ example: 150.00, description: 'Total amount of the order to check completion' })
    @IsNumber()
    @Min(0)
    totalOrderAmount: number;

    @ApiProperty({ example: 1 })
    @IsInt()
    @IsNotEmpty()
    paymentMethodId: number;

    @ApiPropertyOptional({ example: 5 })
    @IsOptional()
    @IsInt()
    shiftId?: number;

    @ApiProperty({ example: 50.00 })
    @IsNumber()
    @Min(0.01)
    amount: number;

    @ApiPropertyOptional({ example: 'TXN-12345' })
    @IsOptional()
    @IsString()
    externalReference?: string;

    @ApiPropertyOptional({ description: 'Raw response from payment gateway' })
    @IsOptional()
    @IsObject()
    gatewayResponse?: any;
}

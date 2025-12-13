import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethodType } from '../entities/payment-method.entity';

export class CreatePaymentMethodDto {
    @ApiProperty({ example: 'Visa Credit' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: PaymentMethodType, example: PaymentMethodType.CARD })
    @IsEnum(PaymentMethodType)
    @IsNotEmpty()
    type: PaymentMethodType;

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    requireReference?: boolean;
}

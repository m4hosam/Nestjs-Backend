import { PartialType } from '@nestjs/swagger';
import { CreatePaymentMethodDto } from './create-payment-method.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePaymentMethodDto extends PartialType(CreatePaymentMethodDto) {
    @IsInt()
    @IsNotEmpty()
    id: number;
}

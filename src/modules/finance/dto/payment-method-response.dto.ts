import { PaymentMethodType } from '../entities/payment-method.entity';

export class PaymentMethodResponseDto {
    id: number;
    name: string;
    type: PaymentMethodType;
    isActive: boolean;
    requireReference: boolean;
    createdAt: Date;
    updatedAt: Date;
}

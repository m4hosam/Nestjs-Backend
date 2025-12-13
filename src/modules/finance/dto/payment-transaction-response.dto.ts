import { PaymentStatus } from '../entities/payment-transaction.entity';

export class PaymentTransactionResponseDto {
    id: number;
    amount: number;
    orderId: number;
    paymentMethodId: number;
    shiftId: number | null;
    status: PaymentStatus;
    externalReference: string | null;
    responseJson: any;
    createdAt: Date;
    isOrderCompleted?: boolean; // Flag to indicate if this payment completed the order
}

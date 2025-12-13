import { Injectable, Logger } from '@nestjs/common';
import { GenericService } from '../../../common/services/generic.service';
import { PaymentTransaction, PaymentStatus } from '../entities/payment-transaction.entity';
import { ProcessTransactionRequestDto } from '../dto/process-transaction-request.dto';
import { PaymentTransactionResponseDto } from '../dto/payment-transaction-response.dto';
import { PaymentTransactionRepository } from '../repositories/payment-transaction.repository';
import { PaymentMethodRepository } from '../repositories/payment-method.repository';
import { BusinessValidationException } from '../../../common/exceptions/business-validation.exception';
import { NotFoundException } from '../../../common/exceptions/not-found.exception';
import { OrderService } from '../../sales/services/order.service';

@Injectable()
export class PaymentTransactionService extends GenericService<
    PaymentTransaction,
    ProcessTransactionRequestDto,
    any, // Update not typically supported for Transactions
    PaymentTransactionResponseDto
> {
    private readonly logger = new Logger(PaymentTransactionService.name);

    constructor(
        private readonly repo: PaymentTransactionRepository,
        private readonly methodRepo: PaymentMethodRepository,
        private readonly orderService: OrderService,
    ) {
        super(repo, 'PaymentTransaction');
    }

    // Generic Abstract Implementations
    toResponseDto(entity: PaymentTransaction): PaymentTransactionResponseDto {
        const dto = new PaymentTransactionResponseDto();
        dto.id = entity.id;
        dto.amount = entity.amount;
        dto.orderId = entity.orderId;
        dto.paymentMethodId = entity.paymentMethodId;
        dto.shiftId = entity.shiftId;
        dto.status = entity.status;
        dto.externalReference = entity.externalReference;
        dto.responseJson = entity.responseJson;
        dto.createdAt = entity.createdAt;
        return dto;
    }

    toEntity(dto: ProcessTransactionRequestDto): Partial<PaymentTransaction> {
        const entity = new PaymentTransaction();
        entity.amount = dto.amount;
        entity.orderId = dto.orderId;
        entity.paymentMethodId = dto.paymentMethodId;
        entity.shiftId = dto.shiftId ?? null;
        entity.externalReference = dto.externalReference ?? null;
        entity.responseJson = dto.gatewayResponse;
        return entity;
    }

    /**
     * Main business logic for processing payments
     */
    async processPayment(
        dto: ProcessTransactionRequestDto,
        userId: number,
    ): Promise<PaymentTransactionResponseDto> {
        // 1. Validate if PaymentMethod is active
        const paymentMethod = await this.methodRepo.findActiveMethod(dto.paymentMethodId);
        if (!paymentMethod) {
            throw new NotFoundException({ key: 'PAYMENT_METHOD_NOT_ACTIVE_OR_FOUND', message: 'Payment method not found or inactive' });
        }

        // 2. Validate References
        if (paymentMethod.requireReference && !dto.externalReference) {
            throw new BusinessValidationException({ key: 'EXTERNAL_REFERENCE_REQUIRED', message: 'External reference is required for this payment method' });
        }

        // 3. Prepare Transaction
        const transactionData = this.toEntity(dto);
        transactionData.createdBy = userId;
        // Assume Success for this logic flow (real gateway integration would happen here)
        transactionData.status = PaymentStatus.SUCCESS;

        // Persist
        const savedTransaction = await this.repo.create(transactionData);

        // 4. Calculate total successful transactions
        const totalPaid = await this.repo.getSumSuccessfulByOrder(dto.orderId);

        // 5. Check Completion
        let isOrderCompleted = false;
        if (totalPaid >= dto.totalOrderAmount) {
            isOrderCompleted = true;
            await this.triggerOrderCompletion(dto.orderId, userId);
        }

        // Return response with completion flag
        const response = this.toResponseDto(savedTransaction);
        response.isOrderCompleted = isOrderCompleted;
        return response;
    }

    /**
     * Trigger Order Completion
     */
    private async triggerOrderCompletion(orderId: number, userId: number): Promise<void> {
        this.logger.log(`[EVENT] Order ${orderId} fully paid.`);

        // Inject SalesService (OrderService)
        await this.orderService.completeOrder(orderId, userId);
        this.logger.log(`-> OrderService.completeOrder(${orderId}) called`);
    }
}

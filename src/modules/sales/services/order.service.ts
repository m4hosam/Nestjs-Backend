import { Injectable } from '@nestjs/common';
import { GenericService } from '../../../common/services/generic.service';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderItemModifier } from '../entities/order-item-modifier.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';
import { ManagerAuthDto } from '../dto/manager-auth.dto';
import { OrderRepository } from '../repositories/order.repository';
import { ShiftRepository } from '../repositories/shift.repository';
import { BusinessValidationException } from '../../../common/exceptions/business-validation.exception';
import { NotFoundException } from '../../../common/exceptions/not-found.exception';
import { OrderStatus, OrderType } from '../enums/sales.enums';
import { InventoryTransactionService } from '../../inventory/services/inventory-transaction.service';
import { CreateTransactionRequestDto } from '../../inventory/dto/create-transaction.dto';
import { TransactionType } from '../../inventory/enums/transaction-type.enum';

@Injectable()
export class OrderService extends GenericService<Order, CreateOrderDto, any, OrderResponseDto> {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly shiftRepository: ShiftRepository,
        private readonly inventoryService: InventoryTransactionService,
    ) {
        super(orderRepository, 'Order');
    }

    toResponseDto(entity: Order): OrderResponseDto {
        return new OrderResponseDto(entity);
    }

    toEntity(dto: CreateOrderDto): Partial<Order> {
        return {
            type: dto.type,
            fkCustomerId: dto.customerId,
            fkTableId: dto.tableId,
        };
    }

    private generateOrderNumber(): string {
        // Simple implementation: timestamp + random. 
        // Production should use Redis or DB sequence for sequential format like ORD-YYYYMMDD-0001
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `ORD-${date}-${random}`;
    }

    async createOrder(dto: CreateOrderDto, userId: number): Promise<OrderResponseDto> {
        // 1. Validate Active Shift
        const activeShift = await this.shiftRepository.findActiveShiftByUser(userId);
        if (!activeShift) {
            throw new BusinessValidationException({ key: 'NO_ACTIVE_SHIFT', message: 'No active shift found for user' });
        }

        // 2. Calculate Totals & Build Items
        let subTotal = 0;
        const orderItems: Partial<OrderItem>[] = [];

        for (const itemDto of dto.items) {
            let itemTotal = itemDto.quantity * itemDto.unitPrice;
            const modifiers: Partial<OrderItemModifier>[] = [];

            if (itemDto.modifiers) {
                for (const mod of itemDto.modifiers) {
                    itemTotal += mod.priceChange * itemDto.quantity;
                    modifiers.push({
                        name: mod.name,
                        priceChange: mod.priceChange,
                    });
                }
            }

            subTotal += itemTotal;

            orderItems.push({
                quantity: itemDto.quantity,
                unitPrice: itemDto.unitPrice,
                total: itemTotal,
                note: itemDto.note,
                fkProductId: itemDto.productId,
                modifiers: modifiers as any, // TypeORM cascade will handle this
            });
        }

        const taxRate = 0.15; // standard VAT
        const taxAmount = subTotal * taxRate;
        const totalAmount = subTotal + taxAmount;

        // 3. Construct Order
        const orderData: Partial<Order> = {
            orderNumber: this.generateOrderNumber(),
            type: dto.type,
            status: OrderStatus.PENDING,
            totalAmount,
            taxAmount,
            discountAmount: 0,
            fkShiftId: activeShift.id,
            fkUserId: userId,
            createdBy: userId,
            fkCustomerId: dto.customerId,
            fkTableId: dto.tableId,
            items: orderItems as any,
        };

        const createdOrder = await this.orderRepository.create(orderData);
        return this.toResponseDto(createdOrder);
    }

    async completeOrder(orderId: number, userId: number): Promise<OrderResponseDto> {
        const order = await this.orderRepository.findById(orderId, { relations: ['items'] });
        if (!order) throw new NotFoundException({ key: 'ORDER_NOT_FOUND', message: 'Order not found' });

        if (order.status !== OrderStatus.PENDING) {
            throw new BusinessValidationException({ key: 'ORDER_NOT_PENDING', message: 'Order cannot be completed' });
        }

        // Deduct stock (OUT_SALES)
        for (const item of order.items) {
            const deductionDto: CreateTransactionRequestDto = {
                warehouseId: 1, // Hardcoded Main Warehouse
                productId: item.fkProductId,
                transactionType: TransactionType.OUT_SALES,
                quantity: item.quantity,
                referenceType: 'Order',
                referenceId: order.id
            };
            await this.inventoryService.processSalesDeduction(deductionDto, userId);
        }

        // QR Generation Logic Check
        if (order.type === OrderType.KIDS_ACCESS) {
            // Logic for QR Code generation would go here
            // order.zatcaHash = 'generated_hash';
        }

        await this.orderRepository.update(orderId, {
            status: OrderStatus.COMPLETED,
            updatedBy: userId
        });

        const updatedOrder = await this.orderRepository.findById(orderId);
        return this.toResponseDto(updatedOrder!);
    }

    async voidOrder(orderId: number, managerDto: ManagerAuthDto, userId: number): Promise<OrderResponseDto> {
        // 1. Verify Manager PIN
        // In a real app, verify against a hashed PIN stored in User or Config
        if (managerDto.managerPin !== '1234') { // Mock PIN
            throw new BusinessValidationException({ key: 'INVALID_PIN', message: 'Invalid manager PIN' });
        }

        const order = await this.orderRepository.findById(orderId);
        if (!order) throw new NotFoundException({ key: 'ORDER_NOT_FOUND', message: 'Order not found' });

        if (order.status === OrderStatus.VOIDED) {
            throw new BusinessValidationException({ key: 'ORDER_ALREADY_VOIDED', message: 'Order already voided' });
        }

        const previousStatus = order.status;

        // Update Status
        await this.orderRepository.update(orderId, {
            status: OrderStatus.VOIDED,
            updatedBy: userId
        });

        const updatedOrder = await this.orderRepository.findById(orderId);
        return this.toResponseDto(updatedOrder!);
    }

    async applyDiscount(orderId: number, discountAmount: number, managerDto: ManagerAuthDto, userId: number): Promise<OrderResponseDto> {
        // 1. Verify Manager PIN
        if (managerDto.managerPin !== '1234') {
            throw new BusinessValidationException({ key: 'INVALID_PIN', message: 'Invalid manager PIN' });
        }

        const order = await this.orderRepository.findById(orderId);
        if (!order) throw new NotFoundException({ key: 'ORDER_NOT_FOUND', message: 'Order not found' });

        if (order.status !== OrderStatus.PENDING) {
            throw new BusinessValidationException({ key: 'ORDER_PROCESSED', message: 'Cannot discount processed order' });
        }

        const newTotal = Number(order.totalAmount) - discountAmount;

        if (newTotal < 0) {
            throw new BusinessValidationException({ key: 'DISCOUNT_TOO_HIGH', message: 'Discount exceeds total amount' });
        }

        await this.orderRepository.update(orderId, {
            discountAmount: discountAmount,
            totalAmount: newTotal,
            updatedBy: userId
        });

        const updatedOrder = await this.orderRepository.findById(orderId);
        return this.toResponseDto(updatedOrder!);
    }
}

import { Order } from '../entities/order.entity';
import { OrderType, OrderStatus } from '../enums/sales.enums';

export class OrderResponseDto {
    id: number;
    orderNumber: string;
    type: OrderType;
    status: OrderStatus;
    totalAmount: number;
    taxAmount: number;
    discountAmount: number;
    shiftId?: number;
    userId: number;
    createdAt: Date;

    constructor(entity: Order) {
        this.id = entity.id;
        this.orderNumber = entity.orderNumber;
        this.type = entity.type;
        this.status = entity.status;
        this.totalAmount = parseFloat(entity.totalAmount?.toString() || '0');
        this.taxAmount = parseFloat(entity.taxAmount?.toString() || '0');
        this.discountAmount = parseFloat(entity.discountAmount?.toString() || '0');
        this.shiftId = entity.fkShiftId;
        this.userId = entity.fkUserId;
        this.createdAt = entity.createdAt;
    }
}

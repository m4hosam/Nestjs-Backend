import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './entities/shift.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemModifier } from './entities/order-item-modifier.entity';
import { ShiftController } from './controllers/shift.controller';
import { OrderController } from './controllers/order.controller';
import { ShiftService } from './services/shift.service';
import { OrderService } from './services/order.service';
import { ShiftRepository } from './repositories/shift.repository';
import { OrderRepository } from './repositories/order.repository';
import { InventoryModule } from '../inventory/inventory.module'; // Import InventoryModule

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Shift,
            Order,
            OrderItem,
            OrderItemModifier
        ]),
        InventoryModule // Required for OrderService injection
    ],
    controllers: [ShiftController, OrderController],
    providers: [
        ShiftService,
        OrderService,
        ShiftRepository,
        OrderRepository
    ],
    exports: [ShiftService, OrderService]
})
export class SalesModule { }

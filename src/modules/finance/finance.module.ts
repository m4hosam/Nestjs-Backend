import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { PaymentMethodController } from './controllers/payment-method.controller';
import { PaymentTransactionController } from './controllers/payment-transaction.controller';
import { PaymentMethodService } from './services/payment-method.service';
import { PaymentTransactionService } from './services/payment-transaction.service';
import { PaymentMethodRepository } from './repositories/payment-method.repository';
import { PaymentTransactionRepository } from './repositories/payment-transaction.repository';
import { SalesModule } from '../sales/sales.module'; // Integrated SalesModule

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentMethod, PaymentTransaction]),
        SalesModule, // Required for OrderService injection in PaymentTransactionService
    ],
    controllers: [PaymentMethodController, PaymentTransactionController],
    providers: [
        PaymentMethodService,
        PaymentTransactionService,
        PaymentMethodRepository,
        PaymentTransactionRepository,
    ],
    exports: [PaymentMethodService, PaymentTransactionService],
})
export class FinanceModule { }

import { Injectable } from '@nestjs/common';
import { GenericService } from '../../../common/services/generic.service';
import { InventoryTransaction } from '../entities/inventory-transaction.entity';
import { CreateTransactionRequestDto } from '../dto/create-transaction.dto';
import { InventoryTransactionRepository } from '../repositories/inventory-transaction.repository';
import { StockRepository } from '../repositories/stock.repository';
import { ProductRecipeRepository } from '../repositories/product-recipe.repository';
import { BusinessValidationException } from '../../../common/exceptions/business-validation.exception';
import { TransactionType } from '../enums/transaction-type.enum';
import { EntityManager } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Stock } from '../entities/stock.entity';

// Placeholder DTOs for Generic Service requirements
class UpdateTransactionDto { }
class TransactionResponseDto extends InventoryTransaction { }

@Injectable()
export class InventoryTransactionService extends GenericService<
    InventoryTransaction,
    CreateTransactionRequestDto,
    UpdateTransactionDto,
    TransactionResponseDto
> {
    constructor(
        private readonly transactionRepo: InventoryTransactionRepository,
        private readonly stockRepo: StockRepository,
        private readonly recipeRepo: ProductRecipeRepository,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {
        super(transactionRepo, 'InventoryTransaction');
    }

    toResponseDto(entity: InventoryTransaction): TransactionResponseDto {
        return entity;
    }

    toEntity(dto: CreateTransactionRequestDto): Partial<InventoryTransaction> {
        return {
            fkWarehouseId: dto.warehouseId,
            fkProductId: dto.productId,
            transactionType: dto.transactionType,
            quantity: dto.quantity,
            referenceType: dto.referenceType,
            referenceId: dto.referenceId,
            batchNumber: dto.batchNumber,
            expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
            costAtTransaction: dto.costAtTransaction,
        };
    }

    /**
     * Validates input, ensures immutability (inserts only), and updates the cached Stock entity.
     */
    async recordTransaction(dto: CreateTransactionRequestDto, userId?: number): Promise<TransactionResponseDto> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Validate inputs (Basic validation handled by DTO, logical validation here)
            if (dto.quantity === 0) {
                throw new BusinessValidationException({ key: 'QUANTITY_CANNOT_BE_ZERO', message: 'Quantity cannot be zero' });
            }

            // 2. Create Transaction
            const transactionData = this.toEntity(dto);
            if (userId) transactionData.createdBy = userId;

            const newTransaction = queryRunner.manager.create(InventoryTransaction, transactionData);
            const savedTransaction = await queryRunner.manager.save(newTransaction);

            // 3. Update Stock Cache
            await this.updateStockCache(dto.productId, dto.warehouseId, dto.quantity, dto.transactionType, queryRunner.manager);

            await queryRunner.commitTransaction();
            return this.toResponseDto(savedTransaction);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Get current stock quantity for a product in a warehouse
     */
    async getCurrentStock(warehouseId: number, productId: number) {
        const stock = await this.stockRepo.findByProductAndWarehouse(productId, warehouseId);

        if (!stock) {
            return {
                productId,
                warehouseId,
                quantity: 0,
                message: 'No stock record found (Product might be new or never transacted)'
            };
        }

        return stock;
    }

    /**
     * Checks if product is COMPOSITE. If yes, calculates required quantities for children.
     * If no, calls recordTransaction directly.
     */
    async processSalesDeduction(dto: CreateTransactionRequestDto, userId?: number): Promise<void> {
        // 1. Fetch Product details to check if composite (Mocking Product fetch)
        // In real app: const product = await this.productService.findById(dto.productId);
        // Assuming we have a way to check:
        const recipes = await this.recipeRepo.findByParentId(dto.productId);
        const isComposite = recipes.length > 0;

        if (isComposite) {
            // Deduct ingredients
            for (const ingredient of recipes) {
                const requiredQty = Math.abs(dto.quantity) * ingredient.quantityNeeded;

                const ingredientTx: CreateTransactionRequestDto = {
                    ...dto,
                    productId: ingredient.fkChildProductId,
                    quantity: -requiredQty, // Deduction
                    transactionType: TransactionType.PRODUCTION, // Or OUT_SALES based on business logic
                    referenceType: 'CompositeParent',
                    referenceId: dto.productId
                };

                await this.recordTransaction(ingredientTx, userId);
            }
        } else {
            // Simple product deduction
            if (dto.transactionType === TransactionType.OUT_SALES) {
                // Apply FIFO logic if needed to determine batches
                await this.applyFifoAllocation(dto, userId);
            } else {
                await this.recordTransaction(dto, userId);
            }
        }
    }

    /**
     * Identifies batches with nearest expiry_date. Deducts sequentially.
     */
    async applyFifoAllocation(dto: CreateTransactionRequestDto, userId?: number): Promise<void> {
        let quantityToDeduct = Math.abs(dto.quantity);

        // Find batches with positive stock sorted by expiry
        // Note: This logic assumes we calculate batch stock dynamically or track it. 
        // Simplified: Find recent IN transactions.
        const batches = await this.transactionRepo.findBatchesForProduct(dto.productId, dto.warehouseId);

        // Logic to calculate remaining stock per batch would go here.
        // For this implementation, we will simply record the transaction with the oldest batch number found
        // if a batch number wasn't provided, or just record it generally if FIFO logic is purely for cost calculation.

        // Simplified implementation: Record one transaction, but logically this might split into multiple
        // transactions against specific batch numbers.

        const fifoTx = { ...dto, quantity: -quantityToDeduct };
        await this.recordTransaction(fifoTx, userId);
    }

    /**
     * Recalculates or incrementally updates the 'quantity' field in Stock table.
     */
    private async updateStockCache(
        productId: number,
        warehouseId: number,
        quantityChange: number,
        type: TransactionType,
        manager: EntityManager
    ): Promise<void> {
        let stock = await manager.findOne(Stock, {
            where: { fkProductId: productId, fkWarehouseId: warehouseId }
        });

        if (!stock) {
            if (quantityChange < 0) {
                throw new BusinessValidationException({ key: 'INSUFFICIENT_STOCK_NO_RECORD', message: 'Insufficient stock: no record found' });
            }
            // Create new stock record
            stock = manager.create(Stock, {
                fkProductId: productId,
                fkWarehouseId: warehouseId,
                quantity: 0,
                minLimit: 0,
                maxLimit: 0
            });
        }

        // Determine direction based on transaction type if quantity is absolute, 
        // but DTO usually carries signed quantity for generic adjustments.
        // However, specs say: "If quantity is positive, adds. If negative, subtracts."

        // Ensure quantity is treated as number (Decimal returns string usually, but here mapped to number)
        const currentQuantity = Number(stock.quantity);
        const change = Number(quantityChange);
        const newQuantity = currentQuantity + change;

        if (newQuantity < 0) {
            // Optional: Allow negative stock? Usually no.
            throw new BusinessValidationException({
                key: 'INSUFFICIENT_STOCK_ON_HAND',
                message: `Insufficient stock on hand: current ${currentQuantity}, requested ${Math.abs(change)}`
            });
        }

        stock.quantity = newQuantity;
        await manager.save(stock);
    }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { InventoryTransaction } from './entities/inventory-transaction.entity';
import { Stock } from './entities/stock.entity';
import { ProductRecipe } from './entities/product-recipe.entity';

import { InventoryTransactionRepository } from './repositories/inventory-transaction.repository';
import { StockRepository } from './repositories/stock.repository';
import { ProductRecipeRepository } from './repositories/product-recipe.repository';

import { InventoryTransactionService } from './services/inventory-transaction.service';
import { InventoryController } from './controllers/inventory.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Warehouse,
            InventoryTransaction,
            Stock,
            ProductRecipe
        ])
    ],
    controllers: [InventoryController],
    providers: [
        InventoryTransactionService,
        InventoryTransactionRepository,
        StockRepository,
        ProductRecipeRepository
    ],
    exports: [InventoryTransactionService]
})
export class InventoryModule { }

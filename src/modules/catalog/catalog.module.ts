import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { ProductBarcode } from './entities/product-barcode.entity';
import { ModifierGroup } from './entities/modifier-group.entity';
import { ModifierOption } from './entities/modifier-option.entity';

// Repositories
import { CategoryRepository } from './repositories/category.repository';
import { ProductRepository } from './repositories/product.repository';

// Services
import { CategoryService } from './services/category.service';
import { ProductService } from './services/product.service';

// Controllers
import { CategoryController } from './controllers/category.controller';
import { ProductController } from './controllers/product.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Category,
            Product,
            ProductBarcode,
            ModifierGroup,
            ModifierOption
        ])
    ],
    controllers: [
        CategoryController,
        ProductController
    ],
    providers: [
        CategoryRepository,
        ProductRepository,
        CategoryService,
        ProductService
    ],
    exports: [
        CategoryService,
        ProductService
    ]
})
export class CatalogModule { }

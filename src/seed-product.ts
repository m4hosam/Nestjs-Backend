import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Product } from './modules/catalog/entities/product.entity';
import { ProductType } from './modules/catalog/enums/product-type.enum';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);

    console.log('☕ Connecting to create Sample Product...');

    const productRepo = dataSource.getRepository(Product);

    const sku = 'ESPRESSO-001';
    const exists = await productRepo.findOne({ where: { sku } });

    if (exists) {
        console.log(`⚠️ Product with SKU ${sku} already exists.`);
    } else {
        const product = productRepo.create({
            type: ProductType.SIMPLE,
            nameEn: 'Espresso Beans',
            nameAr: 'حبوب إسبريسو',
            sku: sku,
            description: 'Premium Arabica beans',
            costPrice: 50.00,
            salePrice: 120.00,
            taxRate: 15.00,
            isStockTracked: true,
            createdBy: 1 // Admin ID
        });

        await productRepo.save(product);
        console.log('✅ Product "Espresso Beans" Created! ID:', product.id);
    }

    await app.close();
}

bootstrap();

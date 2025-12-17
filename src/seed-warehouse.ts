import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Warehouse } from './modules/inventory/entities/warehouse.entity';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);

    console.log('🏭 Connecting to create Main Warehouse...');

    const warehouseRepo = dataSource.getRepository(Warehouse);

    // Check if exists
    const exists = await warehouseRepo.findOne({ where: { name: 'Main Warehouse' } });
    if (exists) {
        console.log('⚠️ Main Warehouse already exists.');
    } else {
        const wh = warehouseRepo.create({
            name: 'Main Warehouse',
            location: 'HQ',
            // isDefault: true, // Removed as it does not exist in the entity
            createdBy: 1 // Admin ID
        });
        await warehouseRepo.save(wh);
        console.log('✅ Main Warehouse Created! ID: 1');
    }

    await app.close();
}

bootstrap();

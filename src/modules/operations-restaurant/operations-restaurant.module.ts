import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Area } from './entities/area.entity';
import { Table } from './entities/table.entity';
import { KitchenTicket } from './entities/kitchen-ticket.entity';

// Repositories
import { AreaRepository } from './repositories/area.repository';
import { TableRepository } from './repositories/table.repository';
import { KitchenTicketRepository } from './repositories/kitchen-ticket.repository';

// Services
import { AreaService } from './services/area.service';
import { TableService } from './services/table.service';
import { KitchenTicketService } from './services/kitchen-ticket.service';

// Controllers
import { AreaController } from './controllers/area.controller';
import { TableController } from './controllers/table.controller';
import { KitchenTicketController } from './controllers/kitchen-ticket.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Area, Table, KitchenTicket]),
    ],
    controllers: [
        AreaController,
        TableController,
        KitchenTicketController
    ],
    providers: [
        AreaRepository,
        TableRepository,
        KitchenTicketRepository,
        AreaService,
        TableService,
        KitchenTicketService,
    ],
    exports: [
        AreaService,
        TableService,
        KitchenTicketService
    ],
})
export class OperationsRestaurantModule { }

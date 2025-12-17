import { Injectable } from '@nestjs/common';
import { GenericService } from '../../../common/services/generic.service';
import { KitchenTicket } from '../entities/kitchen-ticket.entity';
import { KitchenTicketRepository } from '../repositories/kitchen-ticket.repository';
import {
    CreateKitchenTicketDto,
    UpdateKitchenTicketDto,
    KitchenTicketResponseDto
} from '../dto/kitchen-ticket.dto';

// Interface simulating the external Order structure
interface ExternalOrder {
    id: string; // UUID
    orderNumber: string;
    items: Array<{
        id: string;
        name: string;
        quantity: number;
        category: {
            printer_tag: string; // 'KITCHEN', 'BAR', etc.
        };
    }>;
}

@Injectable()
export class KitchenTicketService extends GenericService<
    KitchenTicket,
    CreateKitchenTicketDto,
    UpdateKitchenTicketDto,
    KitchenTicketResponseDto
> {
    constructor(private readonly kitchenTicketRepository: KitchenTicketRepository) {
        super(kitchenTicketRepository, 'KitchenTicket');
    }

    toResponseDto(entity: KitchenTicket): KitchenTicketResponseDto {
        return {
            id: entity.id,
            ticketNumber: entity.ticketNumber,
            status: entity.status,
            destination: entity.destination,
            orderId: entity.orderId,
        };
    }

    toEntity(dto: CreateKitchenTicketDto | UpdateKitchenTicketDto): Partial<KitchenTicket> {
        const entity: Partial<KitchenTicket> = {};
        if ('ticketNumber' in dto) entity.ticketNumber = dto.ticketNumber;
        if ('destination' in dto) entity.destination = dto.destination;
        if ('orderId' in dto) entity.orderId = dto.orderId;
        if ('status' in dto) entity.status = dto.status;
        if ('itemsSnapshot' in dto) entity.items_snapshot = dto.itemsSnapshot;
        return entity;
    }

    async routeOrderItemsToKot(order: ExternalOrder, userId?: number): Promise<KitchenTicketResponseDto[]> {
        // Group items by printer_tag
        const itemsByDestination = new Map<string, any[]>();

        for (const item of order.items) {
            const destination = item.category?.printer_tag || 'DEFAULT';
            if (!itemsByDestination.has(destination)) {
                itemsByDestination.set(destination, []);
            }
            itemsByDestination.get(destination)!.push(item);
        }

        const createdTickets: KitchenTicketResponseDto[] = [];

        // Create a ticket for each destination group
        for (const [destination, items] of itemsByDestination) {
            const ticketNumber = `${order.orderNumber}-${destination.substring(0, 3)}-${Date.now().toString().slice(-4)}`;

            const createDto: CreateKitchenTicketDto = {
                orderId: order.id,
                destination: destination,
                ticketNumber: ticketNumber,
                itemsSnapshot: items
            };

            const ticket = await this.create(createDto, userId);
            createdTickets.push(ticket);
        }

        return createdTickets;
    }
}

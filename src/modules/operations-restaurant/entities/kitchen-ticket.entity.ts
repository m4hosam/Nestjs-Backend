import { Entity, Column } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { KitchenTicketStatus } from '../enums/restaurant.enums';

@Entity({ name: 'kitchen_ticket', schema: 'operations_restaurant' })
export class KitchenTicket extends BaseTransactionEntity {
    @Column({ name: 'ticket_number', type: 'varchar', length: 50, nullable: false })
    ticketNumber: string;

    @Column({
        type: 'enum',
        enum: KitchenTicketStatus,
        default: KitchenTicketStatus.NEW,
    })
    status: KitchenTicketStatus;

    @Column({ type: 'varchar', length: 50, nullable: false })
    destination: string; // e.g., 'KITCHEN', 'BAR'

    @Column({ name: 'order_id', type: 'uuid', nullable: false })
    orderId: string; // Refers to Sales Module

    @Column({ type: 'jsonb', nullable: true })
    items_snapshot: any; // Stores the items belonging to this ticket
}

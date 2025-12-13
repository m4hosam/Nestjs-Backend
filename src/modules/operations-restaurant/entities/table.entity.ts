import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { Area } from './area.entity';
import { TableStatus } from '../enums/restaurant.enums';

@Entity({ name: 'table', schema: 'operations_restaurant' })
export class Table extends BaseTransactionEntity {
    @Column({ type: 'varchar', length: 50, nullable: false })
    name: string;

    @Column({ type: 'int', nullable: false, default: 2 })
    capacity: number;

    @Column({
        type: 'enum',
        enum: TableStatus,
        default: TableStatus.AVAILABLE,
    })
    status: TableStatus;

    @Column({ name: 'fk_area_id', type: 'int', nullable: false })
    fkAreaId: number;

    @ManyToOne(() => Area, (area) => area.tables, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'fk_area_id' })
    area: Area;

    // Stores the active Order ID if occupied (Refers to Sales Module)
    @Column({ name: 'active_order_id', type: 'uuid', nullable: true })
    activeOrderId: string | null;
}

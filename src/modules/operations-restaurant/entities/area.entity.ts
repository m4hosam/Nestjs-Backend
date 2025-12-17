import { Entity, Column, OneToMany } from 'typeorm';
import { BaseTransactionEntity } from '../../../common/entities/base-transaction.entity';
import { Table } from './table.entity';

@Entity({ name: 'area', schema: 'operations_restaurant' })
export class Area extends BaseTransactionEntity {
    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @OneToMany(() => Table, (table) => table.area)
    tables: Table[];
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from '../../../common/repositories/generic.repository';
import { Table } from '../entities/table.entity';

@Injectable()
export class TableRepository extends GenericRepository<Table> {
    constructor(
        @InjectRepository(Table)
        private readonly repo: Repository<Table>,
    ) {
        super(repo);
    }
}

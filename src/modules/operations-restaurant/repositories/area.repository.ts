import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from '../../../common/repositories/generic.repository';
import { Area } from '../entities/area.entity';

@Injectable()
export class AreaRepository extends GenericRepository<Area> {
    constructor(
        @InjectRepository(Area)
        private readonly repo: Repository<Area>,
    ) {
        super(repo);
    }
}

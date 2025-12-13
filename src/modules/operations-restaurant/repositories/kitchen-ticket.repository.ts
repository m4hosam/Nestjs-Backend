import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericRepository } from '../../../common/repositories/generic.repository';
import { KitchenTicket } from '../entities/kitchen-ticket.entity';

@Injectable()
export class KitchenTicketRepository extends GenericRepository<KitchenTicket> {
    constructor(
        @InjectRepository(KitchenTicket)
        private readonly repo: Repository<KitchenTicket>,
    ) {
        super(repo);
    }
}

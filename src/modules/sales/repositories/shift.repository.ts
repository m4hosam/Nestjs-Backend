import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { GenericRepository } from '../../../common/repositories/generic.repository';
import { Shift } from '../entities/shift.entity';

@Injectable()
export class ShiftRepository extends GenericRepository<Shift> {
    constructor(
        @InjectRepository(Shift)
        private readonly repo: Repository<Shift>,
    ) {
        super(repo);
    }

    async findActiveShiftByUser(userId: number): Promise<Shift | null> {
        return this.repo.findOne({
            where: {
                fkUserId: userId,
                endTime: IsNull(),
                isActive: true,
            },
        });
    }
}

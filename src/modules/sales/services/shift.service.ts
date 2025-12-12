import { Injectable } from '@nestjs/common';
import { GenericService } from '../../../common/services/generic.service';
import { Shift } from '../entities/shift.entity';
import { CreateShiftDto } from '../dto/create-shift.dto';
import { CloseShiftDto } from '../dto/close-shift.dto';
import { ShiftResponseDto } from '../dto/shift-response.dto';
import { ShiftRepository } from '../repositories/shift.repository';
import { OrderRepository } from '../repositories/order.repository';
import { BusinessValidationException } from '../../../common/exceptions/business-validation.exception';
import { NotFoundException } from '../../../common/exceptions/not-found.exception';

@Injectable()
export class ShiftService extends GenericService<Shift, CreateShiftDto, any, ShiftResponseDto> {
    constructor(
        private readonly shiftRepository: ShiftRepository,
        private readonly orderRepository: OrderRepository,
    ) {
        super(shiftRepository, 'Shift');
    }

    toResponseDto(entity: Shift): ShiftResponseDto {
        return new ShiftResponseDto(entity);
    }

    toEntity(dto: CreateShiftDto): Partial<Shift> {
        return {
            openingBalance: dto.openingBalance,
        };
    }

    async openShift(dto: CreateShiftDto, userId: number): Promise<ShiftResponseDto> {
        // Validate if user already has an active shift
        const existingShift = await this.shiftRepository.findActiveShiftByUser(userId);
        if (existingShift) {
            throw new BusinessValidationException({ key: 'USER_HAS_ACTIVE_SHIFT', message: 'User already has an active shift' });
        }

        const shiftData: Partial<Shift> = {
            openingBalance: dto.openingBalance,
            startTime: new Date(),
            fkUserId: userId,
            createdBy: userId,
            isActive: true,
        };

        const newShift = await this.shiftRepository.create(shiftData);
        return this.toResponseDto(newShift);
    }

    async closeShift(dto: CloseShiftDto, userId: number): Promise<ShiftResponseDto> {
        const shift = await this.shiftRepository.findById(dto.shiftId);

        if (!shift) {
            throw new NotFoundException({ key: 'SHIFT_NOT_FOUND', message: 'Shift not found' });
        }

        if (!shift.isActive || shift.endTime) {
            throw new BusinessValidationException({ key: 'SHIFT_ALREADY_CLOSED', message: 'Shift is already closed' });
        }

        // Check permissions if needed (e.g. only owner can close)
        if (shift.fkUserId !== userId) {
            // In a real scenario, managers might close others' shifts, but for now strict check
            // throw new ForbiddenException(); 
        }

        // Calculate system balance based on completed orders
        const salesTotal = await this.orderRepository.getShiftTotal(shift.id);
        const closingBalanceSystem = Number(shift.openingBalance) + salesTotal;
        const difference = dto.closingBalanceDeclared - closingBalanceSystem;

        const updateData: Partial<Shift> = {
            endTime: new Date(),
            closingBalanceDeclared: dto.closingBalanceDeclared,
            closingBalanceSystem: closingBalanceSystem,
            difference: difference,
            isActive: false, // Soft close
            updatedBy: userId,
        };

        // We use repo directly for specific update logic logic beyond generic
        await this.shiftRepository.update(shift.id, updateData);
        const updatedShift = await this.shiftRepository.findById(shift.id);

        return this.toResponseDto(updatedShift!);
    }
}

import { Shift } from '../entities/shift.entity';

export class ShiftResponseDto {
    id: number;
    startTime: Date;
    endTime?: Date;
    openingBalance: number;
    closingBalanceDeclared?: number;
    closingBalanceSystem?: number;
    difference?: number;
    isActive: boolean;
    userId: number;

    constructor(entity: Shift) {
        this.id = entity.id;
        this.startTime = entity.startTime;
        this.endTime = entity.endTime;
        this.openingBalance = parseFloat(entity.openingBalance?.toString() || '0');
        this.closingBalanceDeclared = entity.closingBalanceDeclared ? parseFloat(entity.closingBalanceDeclared.toString()) : undefined;
        this.closingBalanceSystem = entity.closingBalanceSystem ? parseFloat(entity.closingBalanceSystem.toString()) : undefined;
        this.difference = entity.difference ? parseFloat(entity.difference.toString()) : undefined;
        this.isActive = entity.isActive;
        this.userId = entity.fkUserId;
    }
}

import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TableStatus } from '../enums/restaurant.enums';

export class CreateTableDto {
    @ApiProperty({ example: 'T-01' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 4 })
    @IsNotEmpty()
    @IsNumber()
    capacity: number;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    areaId: number;
}

export class UpdateTableDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    capacity?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    areaId?: number;
}

export class TableStatusUpdateDto {
    @ApiProperty({ enum: TableStatus })
    @IsNotEmpty()
    @IsEnum(TableStatus)
    status: TableStatus;
}

export class AssignTableDto {
    @ApiProperty({ description: 'ID of the Order from Sales module' })
    @IsNotEmpty()
    @IsUUID()
    orderId: string;
}

export class TableResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    capacity: number;

    @ApiProperty({ enum: TableStatus })
    status: TableStatus;

    @ApiProperty()
    areaId: number;

    @ApiProperty({ nullable: true })
    activeOrderId: string | null;
}

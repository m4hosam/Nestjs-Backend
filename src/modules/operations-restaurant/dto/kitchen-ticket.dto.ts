import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsUUID, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { KitchenTicketStatus } from '../enums/restaurant.enums';

export class CreateKitchenTicketDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    ticketNumber: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    destination: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    orderId: string;

    @ApiProperty()
    @IsOptional()
    @IsObject()
    itemsSnapshot?: any;
}

export class UpdateKitchenTicketDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiPropertyOptional({ enum: KitchenTicketStatus })
    @IsOptional()
    @IsEnum(KitchenTicketStatus)
    status?: KitchenTicketStatus;
}

export class KitchenTicketResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    ticketNumber: string;

    @ApiProperty({ enum: KitchenTicketStatus })
    status: KitchenTicketStatus;

    @ApiProperty()
    destination: string;

    @ApiProperty()
    orderId: string;
}

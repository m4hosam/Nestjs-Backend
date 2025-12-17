import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAreaDto {
    @ApiProperty({ example: 'Main Hall' })
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class UpdateAreaDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @ApiPropertyOptional({ example: 'Main Hall' })
    @IsOptional()
    @IsString()
    name?: string;
}

export class AreaResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    isActive: boolean;
}

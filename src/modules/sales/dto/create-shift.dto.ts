import { IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShiftDto {
    @ApiProperty({ description: 'Opening balance for the shift' })
    @IsNumber()
    @Min(0)
    openingBalance: number;

    @IsOptional()
    @IsNumber()
    userId?: number;
}

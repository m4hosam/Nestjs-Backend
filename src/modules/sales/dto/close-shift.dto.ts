import { IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CloseShiftDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    shiftId: number;

    @ApiProperty({ description: 'Declared cash amount by user' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    closingBalanceDeclared: number;
}

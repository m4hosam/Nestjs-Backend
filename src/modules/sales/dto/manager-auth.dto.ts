import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ManagerAuthDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    managerPin: string;
}

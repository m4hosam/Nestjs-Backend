import { IsArray, IsNumber, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class IngredientDto {
    @ApiProperty()
    @IsNumber()
    childProductId: number;

    @ApiProperty()
    @IsNumber()
    @Min(0.001)
    quantityNeeded: number;
}

export class RecipeDefinitionDto {
    @ApiProperty()
    @IsNumber()
    parentProductId: number;

    @ApiProperty({ type: [IngredientDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IngredientDto)
    ingredients: IngredientDto[];
}

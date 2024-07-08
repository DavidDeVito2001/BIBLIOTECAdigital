/**@fileoverview archivo contiene una class con atributos opcionales que se exportan */

// Validamos que las variables sean del tipo string, number y que no esten vacias
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProfileDTO{

    @ApiProperty()
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    age?:number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    tel?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    adrress?: string;
}
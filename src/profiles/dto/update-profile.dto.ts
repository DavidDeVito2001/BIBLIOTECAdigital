/**@fileoverview archivo contiene una class con atributos opcionales que se exportan */

// Validamos que las variables sean del tipo string, number y que no esten vacias
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProfileDTO{

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsNumber()
    age?:number;

    @IsOptional()
    @IsString()
    tel?: string;

    @IsOptional()
    @IsString()
    adrress?: string;
}
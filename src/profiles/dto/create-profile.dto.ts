/**@fileoverview archivo contiene una class con atributos que se exportan */

// Validamos que las variables sean del tipo string, number y que no esten vacias
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProfileDTO{

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsNumber()
    age:number;

    @IsNotEmpty()
    @IsString()
    tel: string;

    @IsNotEmpty()
    @IsString()
    adrress: string;
}
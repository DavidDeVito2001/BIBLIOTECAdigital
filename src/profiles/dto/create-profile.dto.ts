/**@fileoverview archivo contiene una class con atributos que se exportan */

// Validamos que las variables sean del tipo string, number y que no esten vacias
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProfileDTO{

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    age:number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    tel: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    adrress: string;
}
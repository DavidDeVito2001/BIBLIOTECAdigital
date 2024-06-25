/** @fileoverview Este archivo contiene una clase con atributos que se exporta */

import { ROLES } from "../../constants/roles";

//Revisamos si las variables no esten vacias, se string, email o enum
import { IsNotEmpty, IsEmail, IsEnum, IsString, IsOptional } from 'class-validator';

export class CreateUserDTO {

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsEnum(ROLES)
    rol?: ROLES; //Por default esta en 'BASIC'
}

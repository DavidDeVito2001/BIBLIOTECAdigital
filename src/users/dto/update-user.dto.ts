/** @fileoverview Este archivo contiene una clase con atributos opcionales que se exporta */

import { ROLES } from "../../constants/roles";

// Validamos que las variables sean opcionales y del tipo string, email o enum
import { IsEmail, IsEnum, IsString, IsOptional } from 'class-validator';

export class UpdateUserDTO {

    @IsOptional()
    @IsString()
    readonly username?: string;

    @IsOptional()
    @IsEmail()
    readonly email?: string;

    @IsOptional()
    @IsString()
    readonly password?: string;

    @IsOptional()
    @IsEnum(ROLES)
    readonly rol?: ROLES;
}

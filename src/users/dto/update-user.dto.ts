/** @fileoverview Este archivo contiene una clase con atributos opcionales que se exporta */

import { ApiProperty } from "@nestjs/swagger";
import { ROLES } from "../../constants/roles";

// Validamos que las variables sean opcionales y del tipo string, email o enum
import { IsEmail, IsEnum, IsString, IsOptional } from 'class-validator';

export class UpdateUserDTO {

    @ApiProperty()
    @IsOptional()
    @IsString()
    readonly username?: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    readonly email?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    readonly password?: string;

    @ApiProperty({ enum: ['BASIC', 'ADMIN']})
    @IsOptional()
    @IsEnum(ROLES)
    readonly rol?: ROLES;
}

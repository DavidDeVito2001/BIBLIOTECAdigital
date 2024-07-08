/** @fileoverview Este archivo contiene una clase con atributos que se exporta */

import { ApiProperty } from "@nestjs/swagger";
import { ROLES } from "../../constants/roles";

//Revisamos si las variables no esten vacias, se string, email o enum
import { IsNotEmpty, IsEmail, IsEnum, IsString, IsOptional } from 'class-validator';

export class CreateUserDTO {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ 
        enum: ['BASIC', 'ADMIN'],
        default: 'BASIC'
    })
    @IsOptional()
    @IsEnum(ROLES)
    rol?: ROLES; //Por default esta en 'BASIC'
}

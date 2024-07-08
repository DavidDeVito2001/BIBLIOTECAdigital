/** @fileoverview Este archivo contiene una clase con atributos que se exportan */

// Validamos que las variables sean del tipo date, number y que no estén vacías
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateLoanDTO {

    @ApiProperty({description: 'Fecha en la que se piensa devolver.'})
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    loan_return: Date; 

    @ApiProperty({description: 'Id del user que pide el préstamo.'})
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @ApiProperty({description: 'Id de la copy que se solicita.'})
    @IsNotEmpty()
    @IsNumber()
    copyId: number;

}
 
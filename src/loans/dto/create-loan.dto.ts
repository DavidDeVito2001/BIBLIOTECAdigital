/** @fileoverview Este archivo contiene una clase con atributos que se exportan */

// Validamos que las variables sean del tipo date, number y que no estén vacías
import { IsDate, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateLoanDTO {
    
    @IsNotEmpty()
    @IsDate()
    loan_return: Date; 

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    copyId: number;

}
 
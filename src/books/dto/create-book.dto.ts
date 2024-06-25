/**@fileoverview archivo contiene una class con atributos que se exportan */

//Se valida que las variables no sean void y que si sean string
import { IsNotEmpty, IsNumber, IsString, isNumber } from "class-validator";

export class CreateBookDTO{

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    publication_year: number;

    @IsNotEmpty()
    isbn: string;

    @IsNotEmpty()
    @IsString()
    author: string;

    @IsNotEmpty()
    @IsString()
    category: string;

    @IsNotEmpty()
    @IsString()
    image_url: string;
}
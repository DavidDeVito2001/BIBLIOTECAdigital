/**@fileoverview archivo contiene una class con atributos que se exportan */

//Se valida que las variables no sean void y que si sean string
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, isNumber } from "class-validator";

export class CreateBookDTO{

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    publication_year: number;

    @ApiProperty()
    @IsNotEmpty()
    isbn: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    author: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    category: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    image_url: string;
}
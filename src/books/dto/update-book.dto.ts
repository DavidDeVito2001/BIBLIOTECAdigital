/** @fileoverview Este archivo contiene una clase con atributos opcionales que se exportan */

// Se valida que las variables sean opcionales, si algunas son strings o numbers
import { IsNumber, IsString, IsOptional } from "class-validator";

export class UpdateBookDTO {
    
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsNumber()
    publication_year?: number;
    
    @IsOptional()
    @IsString()
    isbn?: string;
    
    @IsOptional()
    @IsString()
    author?: string;
    
    @IsOptional()
    @IsString()
    category?: string;
    
    @IsOptional()
    @IsString()
    image_url?: string;
}
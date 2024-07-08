/** @fileoverview Este archivo contiene una clase con atributos opcionales que se exportan */

// Se valida que las variables sean opcionales, si algunas son strings o numbers
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsOptional } from "class-validator";

export class UpdateBookDTO {
    
    @ApiProperty() 
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    publication_year?: number;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    isbn?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    author?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    category?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    image_url?: string;
}
/**@fileoverview archivo contiene una class con atributos opcionales que se exportan */

// Se valida que las variables sean opcionales, si algunas son strings o numbers
import { IsNumber, IsOptional, IsBoolean } from "class-validator";


export class UpdateCopyDTO{
    
    @IsOptional()
    @IsBoolean()
    available?:boolean;

    @IsOptional()
    @IsNumber()
    copyNumber?:number;    
}
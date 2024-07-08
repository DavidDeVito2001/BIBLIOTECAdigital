/**@fileoverview archivo contiene una class con atributos opcionales que se exportan */

// Se valida que las variables sean opcionales, si algunas son strings o numbers
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsBoolean } from "class-validator";


export class UpdateCopyDTO{
    
    @ApiProperty({
        description:'Si la copy esta disponible para el préstamo',
        default: true
    })
    @IsOptional()
    @IsBoolean()
    available?:boolean;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    copyNumber?:number;    
}
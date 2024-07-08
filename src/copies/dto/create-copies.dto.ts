/**@fileoverview archivo contiene una class con atributos que se exportan */

// Se valida que las variables que sean boolean o number
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsBoolean, IsNotEmpty, IsOptional } from "class-validator";


export class CreateCopyDTO{

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    available?:boolean; //por default esta en true por eso es opcional

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    copyNumber:number;
    
}
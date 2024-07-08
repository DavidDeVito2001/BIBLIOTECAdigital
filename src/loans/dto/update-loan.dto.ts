/**@fileoverview se encarga de exportar una class con atributos que sirven para la actualización del loan*/

// Validamos que las variables sean del tipo date, number y opcionales
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsBoolean, IsOptional } from 'class-validator';


export class UpdateLoanDTO{

    @ApiProperty({description: 'Fecha en la que se piensa devolver.'})
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    loan_return?: Date;

    @ApiProperty({description: 'Día real de devolución.'})
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    real_day_return?: Date;

    @ApiProperty({
        description: 'Booleano que representa la devolución de la copy.',
        default: false
    })
    @IsOptional()
    @IsBoolean()
    is_returned?: boolean;

}
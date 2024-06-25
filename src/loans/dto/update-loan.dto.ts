/**@fileoverview se encarga de exportar una class con atributos que sirven para la actualización del loan*/

// Validamos que las variables sean del tipo date, number y opcionales
import { IsDate, IsBoolean, IsOptional } from 'class-validator';


export class UpdateLoanDTO{

    @IsOptional()
    @IsDate()
    loan_return?: Date;

    @IsOptional()
    @IsDate()
    real_day_return?: Date;

    @IsOptional()
    @IsBoolean()
    is_returned?: boolean;

}
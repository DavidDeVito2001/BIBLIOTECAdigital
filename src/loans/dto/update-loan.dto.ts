/**@fileoverview se encarga de exportar una class con atributos que sirven para la actualización del loan*/

export class UpdateLoanDTO{
    loan_return?: Date;
    real_day_return?: Date;
    is_returned?: boolean;
}
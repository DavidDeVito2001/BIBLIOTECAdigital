/**
 * @fileoverview Archivo que contiene una interfaz que define las propiedades
 * que debe tener el objeto en donde la implemente
 */

export interface ILoan{
    id:number; //identificador
    loan_date:Date; //Cuando lo pide
    loan_return:Date; //Cuando lo devuelve "2024-07-01T00:00:00Z"
    real_day_return: Date|null;   //Cuando verdaderamente lo devolvió por default null
    is_returned: boolean;    //Si ha sido devuelto por default false
}

/**
 * @fileoverview integra las variables:
 * @type {strig} idUser 
 * @type {string} rolUser
 * a la interfaz Request de Express
*/


declare namespace Express{
    interface Request{
        idUser:string,
        roleUser: string
    }
}
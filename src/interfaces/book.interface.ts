/**
 * @fileoverview Archivo que contiene una interfaz que define las propiedades
 * que debe tener el objeto en donde la implemente
 */

export interface IBook{
    title: string;
    publication_year: number;
    isbn:string;
    author:string;
    category:string;
    image_url:string;
}
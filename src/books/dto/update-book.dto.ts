/**@fileoverview archivo contiene una class con atributos opcionales que se exportan */

export class UpdateBookDTO{
    title?: string;
    publication_year?: number;
    isbn?: number;
    author?: string;
    category?: string;
    image_url?: string;
}
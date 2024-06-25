/**
 * @fileoverview Este archivo define la entidad BooksEntity que representa la tabla de 'books' en la base de datos MySQL.
 *
 * La entidad BooksEntity incluye las siguientes propiedades:
 *  - id: identificador heredado de la clase BaseEntity.
 *  - createAt: fecha de creación heredada de la clase BaseEntity.
 *  - updateAt: fecha de creación heredada de la clase BaseEntity.
 *  - title: título del libro.
 *  - publication_year: año en el que se publico el libro.
 *  - isbn: identificador único que poseen los libros de forma estandarizada.
 *  - category: categoría del libro.
 *  - image_url: URL de la imagen del libro.
 * 
 */


import { IBook } from "../../interfaces/book.interface";
import { BaseEntity } from "../../config/base.entity";
import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { CopiesEntity } from "../../copies/entities/copies.entity";

/**
 * Entidad que representa en la BD la tabla 'books'
 * Hereda de la class abstracta BaseEntity implementa la interfaz IBook
 */

@Entity('books')
export class BooksEntity extends BaseEntity implements IBook{

    @Column()
    title: string;

    @Column()
    publication_year: number;
    

    @Column()
    isbn:string;
    
    @Column()
    author:string;

    @Column()
    category:string;

    @Column()
    image_url: string;

    //Relación de un book para muchas copies
    @OneToMany(()=>CopiesEntity, copies => copies.book)
    @JoinColumn()
    copies: CopiesEntity[]
}

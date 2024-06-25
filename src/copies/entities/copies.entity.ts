/**
 * @fileoverview Este archivo define la entidad CopiesEntity que representa la tabla de 'copies' en la base de datos MySQL.
 *
 * La entidad CopiesEntity incluye las siguientes propiedades:
 *  - id: identificador heredado de la clase BaseEntity.
 *  - createAt: fecha de creación heredada de la clase BaseEntity.
 *  - updateAt: fecha de creación heredada de la clase BaseEntity.
 *  - available: booleano que representa la disponibilidad del libro
 *  - copyNumber: que número de copia del libro es
 *  - bookId: identificador del libro asociado  
 */


import { LoansEntity } from "../../loans/entities/loans.entity";
import { BooksEntity } from "../../books/entities/books.entity";
import { BaseEntity } from "../../config/base.entity";
import { ICopy } from "../../interfaces/copy.interfaces";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

/**
 * Entidad que representa en la BD la tabla 'copies'
 * Hereda de la class abstracta BaseEntity implementa la interfaz ICopy
 */

@Entity('copies')
export class CopiesEntity extends BaseEntity implements ICopy {
    
    @Column({
        type: 'boolean',
        name: 'available',
        default: true
    })
    available: boolean;

    @Column()
    copyNumber: number;

    //Relación de muchas copies para un book
    @ManyToOne(()=>BooksEntity, book => book.copies)
    book: BooksEntity;

    @Column()
    bookId:number;

    //Relación de una sola copy para muchos loans 
    @OneToMany(()=>LoansEntity, loans => loans.copy)
    loans: LoansEntity;

}
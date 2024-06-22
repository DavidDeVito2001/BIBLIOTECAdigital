import { LoansEntity } from "../../loans/entities/loans.entity";
import { BooksEntity } from "../../books/entities/books.entity";
import { BaseEntity } from "../../config/base.entity";
import { ICopy } from "../../interfaces/copy.interfaces";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity('copies')
export class CopiesEntity extends BaseEntity implements ICopy {
    
    @Column()
    available: boolean;

    @Column()
    copyNumber: number;


    @ManyToOne(()=>BooksEntity, book => book.copies)
    book: BooksEntity;

    @Column()
    bookId:number;

    @OneToMany(()=>LoansEntity, loans => loans.copy)
    loans: LoansEntity;

}
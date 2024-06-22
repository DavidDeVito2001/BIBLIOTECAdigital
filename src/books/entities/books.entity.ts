import { IBook } from "../../interfaces/book.interface";
import { BaseEntity } from "../../config/base.entity";
import { Column, Entity, JoinColumn, OneToMany } from "typeorm";
import { CopiesEntity } from "../../copies/entities/copies.entity";


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

    @OneToMany(()=>CopiesEntity, copies => copies.book)
    @JoinColumn()
    copies: CopiesEntity[]
}

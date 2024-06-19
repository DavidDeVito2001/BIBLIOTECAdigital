import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CopiesEntity } from '../../copies/entities/copies.entity';
import { Repository } from 'typeorm';
import { CreateCopyDTO } from '../../copies/dto/create-copies.dto';
import { BooksEntity } from '../../books/entities/books.entity';

@Injectable()
export class CopiesService {
    constructor(
        //Inyectamos nuestra entidad CopiesEntity a un repositorio de TypeORM
        @InjectRepository(CopiesEntity) private copiesRepository:Repository<CopiesEntity>,
        //Inyectamos nuestra entidad BooksEntity a un repositorio de TypeORM
        @InjectRepository(BooksEntity) private readonly booksRepository: Repository<BooksEntity>
    ){}

    async createCopy(bookId: number, createCopyDto: CreateCopyDTO): Promise<CopiesEntity> {
        const foundBook = await this.booksRepository.findOne({ where: { id: bookId} });
    
        if (!foundBook) {
          throw new HttpException('Book No Existe', HttpStatus.NOT_FOUND);
        }
    
        const newCopy = this.copiesRepository.create(createCopyDto);
        newCopy.bookId = bookId //Asociar Id del libro a la copy
        newCopy.book = foundBook;  // Asociar la copia al libro encontrado
    
        const savedCopy = await this.copiesRepository.save(newCopy);
    
        return savedCopy;
      }

}

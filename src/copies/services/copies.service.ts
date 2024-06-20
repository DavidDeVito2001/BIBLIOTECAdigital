import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CopiesEntity } from '../../copies/entities/copies.entity';
import { Repository } from 'typeorm';
import { CreateCopyDTO } from '../../copies/dto/create-copies.dto';
import { BooksEntity } from '../../books/entities/books.entity';
import { UpdateCopyDTO } from '../../copies/dto/update-copies.dto';

@Injectable()
export class CopiesService {
    constructor(
        //Inyectamos nuestra entidad CopiesEntity a un repositorio de TypeORM
        @InjectRepository(CopiesEntity) private copiesRepository:Repository<CopiesEntity>,
        //Inyectamos nuestra entidad BooksEntity a un repositorio de TypeORM
        @InjectRepository(BooksEntity) private readonly booksRepository: Repository<BooksEntity>
    ){}

    /**Esta función se utiliza para traer un book con todas la copies asociadas
     * @param {number} bookId - id del libro al que se lo busca asociar
     * @returns {BooksEntity}
     */
    public async getCopiesByBookId(bookId:number):Promise<BooksEntity>{
      //Se busca un libro por su id y lo relaciona con copies(argumento relacional en BookEntity)
      const foundBook = await this.booksRepository.findOne({
        where:{
          id: bookId
        }, relations:['copies']
      })
      //Si el book no es encontrado se lanza un error - NOT_FOUND
      if(!foundBook){
        throw new HttpException('Book No Existe', HttpStatus.NOT_FOUND)
      }

      //Se retorna el libro con todas las copies asociadas
      return foundBook;
    }

    /**Es un función para crear una copy
     * @param {number} bookId - id del libro al que se lo busca asociar
     * @param {CreateCopyDTO} copy - datos con la estructura de la copy
     * @returns {CopiesEntity}
     */
    public async createCopy(bookId: number, copy: CreateCopyDTO): Promise<CopiesEntity> {
        //Se busca si el libre existe
        const foundBook = await this.booksRepository.findOne({ where: { id: bookId} });
        
        //Si el libro no existe se lanza un error - NOT_FOUND
        if (!foundBook) {
          throw new HttpException('Book No Existe', HttpStatus.NOT_FOUND);
        }
        //Sino se crea la copy
        const newCopy = this.copiesRepository.create(copy);
        newCopy.bookId = bookId //Asociar Id del libro a la copy
        newCopy.book = foundBook;  // Asociar la copia al libro encontrado
        
        //Se guarda la copy creada
        const savedCopy = await this.copiesRepository.save(newCopy);
        //y se retorna
        return savedCopy;
      }

    /**Función que se encarga de eliminar copy según el id 
     * @param {number} id - id de la copy 
     * */  
    public async deleteCopy(id:number){
        //Se elimina la copy según el id
        const copyDelete = await this.copiesRepository.delete(id)
        //Si no se elimino la row affected es igual a 0, eso quiere decir que no se encontro o no existe
        if(copyDelete.affected === 0){
          throw new HttpException('Copy No Existe', HttpStatus.NOT_FOUND)
        }
        //Si se encontro se devuelve eliminada
        return copyDelete;
      }

    /**Esta función sirve para actualizar la copy según el id
     * @param {number} id - identificador de la copy
     * @param {UpdateCopyDTO} copy - estructura con los datos que se quieren actualizar de la copy
     * @returns {Promise<CopiesEntity>}
     */  
    public async updateCopy(id:number, copy:UpdateCopyDTO):Promise<CopiesEntity>{
      //Se busca una copy según el id
      const copyFound = await this.copiesRepository.findOne({
        where:{
          id
        }
      });
      //Si no se encuentra la copy se lanza un error - NOT_FOUND
      if(!copyFound){
        throw new HttpException('Copy No Existe', HttpStatus.NOT_FOUND);
      }
      //Sino: Se le asigna a la copyFound los atributos nuevos de la copy
      const copyUpdate = Object.assign(copyFound, copy);
      //Se guarda y se retorna la copy actualizada
      return await this.copiesRepository.save(copyUpdate);
    }


}   

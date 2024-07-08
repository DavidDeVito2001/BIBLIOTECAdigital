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
    @InjectRepository(CopiesEntity)
    private copiesRepository: Repository<CopiesEntity>,
    //Inyectamos nuestra entidad BooksEntity a un repositorio de TypeORM
    @InjectRepository(BooksEntity)
    private readonly booksRepository: Repository<BooksEntity>,
  ) {}

  /**Esta función se utiliza para traer un book con todas la copies asociadas
   * @param {number} bookId - id del libro al que se lo busca asociar
   * @returns {BooksEntity}
   */
  public async getCopiesByBookId(bookId: number): Promise<BooksEntity> {
    //Se busca un libro por su id y lo relaciona con copies(argumento relacional en BookEntity)
    const foundBook = await this.booksRepository.findOne({
      where: {
        id: bookId,
      },
      relations: ['copies'],
    });
    //Si el book no es encontrado se lanza un error - NOT_FOUND
    if (!foundBook) {
      throw new HttpException('Book No Existe', HttpStatus.NOT_FOUND);
    }

    //Se retorna el libro con todas las copies asociadas
    return foundBook;
  }

  /**Es un función para crear una copy
   * @param {number} bookId - id del libro al que se lo busca asociar
   * @param {CreateCopyDTO} copy - datos con la estructura de la copy
   * @returns {CopiesEntity}
   */
  public async createCopy(
    bookId: number,
    copy: CreateCopyDTO,
  ): Promise<CopiesEntity> {
    //Se busca si el libre existe
    const foundBook = await this.booksRepository.findOne({
      where: { id: bookId },
    });

    //Si el libro no existe se lanza un error - NOT_FOUND
    if (!foundBook) {
      throw new HttpException('Book No Encontrado.', HttpStatus.NOT_FOUND);
    }

    // Verificar si ya existe una copia con el mismo copyNumber para el libro dado
    const existenteCopy = await this.copiesRepository.findOne({
      where: { bookId, copyNumber: copy.copyNumber },
    });

    if (existenteCopy) {
      throw new HttpException(
        'Copy con ese número ya existe para este libro.',
        HttpStatus.CONFLICT,
      );
    }

    //Sino se crea la copy
    const newCopy = this.copiesRepository.create(copy);
    newCopy.bookId = bookId; //Asociar Id del libro a la copy
    newCopy.book = foundBook; // Asociar la copia al libro encontrado

    //Se guarda la copy creada
    const savedCopy = await this.copiesRepository.save(newCopy);
    //y se retorna
    return savedCopy;
  }

  /**Función que se encarga de eliminar copy según el id
   * @param {number} id - id de la copy
   * */
  public async deleteCopy(id: number) {
    try {
      const copyDelete = await this.copiesRepository.delete(id);
      if (copyDelete.affected === 0) {
        throw new HttpException('Copy No Encontrada', HttpStatus.NOT_FOUND);
      }
      return copyDelete;
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new HttpException(
          'No se puede eliminar la copy porque tiene préstamos asociados!',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        console.error('Error al eliminar la copia:', error.message);
        throw error; // Asegurarse de que otras excepciones sean lanzadas de nuevo
      }
    }
  }

  /**Esta función sirve para actualizar la copy según el id
   * @param {number} id - identificador de la copy
   * @param {UpdateCopyDTO} copy - estructura con los datos que se quieren actualizar de la copy
   * @returns {Promise<CopiesEntity>}
   */
  public async updateCopy(
    id: number,
    copy: UpdateCopyDTO,
  ): Promise<CopiesEntity> {
    //Se busca una copy según el id
    const copyFound = await this.copiesRepository.findOne({
      where: {
        id,
      },
    });
    //Si no se encuentra la copy se lanza un error - NOT_FOUND
    if (!copyFound) {
      throw new HttpException('Copy No Encontrada.', HttpStatus.NOT_FOUND);
    }
    //Sino: Se le asigna a la copyFound los atributos nuevos de la copy
    const copyUpdate = Object.assign(copyFound, copy);
    //Se guarda y se retorna la copy actualizada
    return await this.copiesRepository.save(copyUpdate);
  }
}


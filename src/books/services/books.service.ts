import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDTO } from '../../books/dto/create-book.dto';
import { BooksEntity } from '../../books/entities/books.entity';
import { Repository } from 'typeorm';
import { UpdateBookDTO } from '../../books/dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    //Se inyecta la entidad BooksEntity en un repositorio de TypeOrm
    @InjectRepository(BooksEntity)
    private booksRepository: Repository<BooksEntity>,
  ) {}

  /**
   * Función que se encarga de obetener todos los libros de la tabla "books"
   * @param {any} params - Parametro opcional para ordenar libros o limitar sin alterar los datos de forma permanente
   * @returns {BooksEntity[]} retorna una lista de books
   */
  public async getBooks(params: any): Promise<BooksEntity[]> {
    return await this.booksRepository.find();
  }

  /**
   * Función que se encarga de retornar un book por su id
   * @param {number} id - id de book que se busca
   * @returns {BooksEntity} retorna el book encontrado
   */
  public async getBook(id: number): Promise<BooksEntity> {
    //Busca un book según el id
    const bookFound = await this.booksRepository.findOne({
      where: {
        id,
      },
    });

    //Si el book no fue encontrado se retorna un error: NOT_FOUND
    if (!bookFound) {
      throw new HttpException('Book No Encontrado', HttpStatus.NOT_FOUND);
    }

    //Sino se retorna el book obetenido
    return bookFound;
  }

  /**
   * Función que se encarga de crear un book
   * @param {CreateBookDTO} book - parametro que se introduce en el cuerpo de una solictud con la estructura y datos del book
   * @returns {BooksEntity[]} retorna una lista de books
   */
  public async createBook(book: CreateBookDTO): Promise<BooksEntity> {
    //Buscar si existe un book con un isbn igual en la bd
    const bookFound = await this.booksRepository.findOne({
      where: { isbn: book.isbn },
    });

    //Si book es encontrado, entonces error: book ya existe
    if (bookFound) {
      throw new HttpException('Book Ya Existe', HttpStatus.CONFLICT);
    }

    //Sino: guardar libro en bd
    return await this.booksRepository.save(book);
  }

  /**
   * Función que se encarga de eliminar un book
   * @param {number} id - id de book que se busca eliminar
   */
  public async deleteBook(id: number): Promise<void> {
    try {
      // Busca el book por ID
      const bookFound = await this.booksRepository.findOne({
        where: { id },
        relations: ['copies'],
      });

      // Si el book no se encuentra, lanza un error
      if (!bookFound) {
        throw new HttpException('Book No Encontrado', HttpStatus.NOT_FOUND);
      }

      // Elimina el usuario, el perfil asociado se elimina automáticamente por CASCADE
      await this.booksRepository.remove(bookFound);
    } catch (error) {
      // captamos el error y si el elemento no se puede eliminar por tener datos asociados se advierte
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new HttpException(
          'No se puede eliminar el book porque tiene copies asociadas!',
          HttpStatus.BAD_REQUEST,
        );
        // Aquí puedes mostrar un mensaje al usuario o realizar otra acción
      } else {
        console.error('Error al eliminar el libro:', error.message);
        throw error; // Lanzar nuevamente el error para que pueda ser capturado en las pruebas
      }
    }
  }

  /**
   * Función que se encarga de actualizar un book
   * @param {number} id - id del libro a encontrar
   * @param {UpdateBookDTO} book - parametro que se introduce en el cuerpo de una solictud con la estructura y datos del book
   * @returns {BooksEntity[]} retorna una lista de books
   */
  public async updateBook(
    id: number,
    book: UpdateBookDTO,
  ): Promise<BooksEntity> {
    //Se busca al book por el id
    const bookFound = await this.booksRepository.findOne({ where: { id } });

    //Si el book no se encuentra se retorna error: NOT_FOUND
    if (!bookFound) {
      throw new HttpException('Book No Existe', HttpStatus.NOT_FOUND);
    }

    //Sino se asigna el contenido de book a bookFound
    const updateBook = Object.assign(bookFound, book);
    //Se devuelve el libro actualizado
    return this.booksRepository.save(updateBook);
  }
}

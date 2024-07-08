import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BooksEntity } from '../../books/entities/books.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateBookDTO } from '../../books/dto/create-book.dto';
import { UpdateBookDTO } from 'books/dto/update-book.dto';

describe('BooksService', () => {
  let service: BooksService;
  let booksRepository: Repository<BooksEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(BooksEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    booksRepository = module.get<Repository<BooksEntity>>(
      getRepositoryToken(BooksEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBooks', () => {
    it('Debería retornar una lista de books', async () => {
      //Se crea una lista de obejtos representando a bookEntity
      const books = [{ id: 1 }] as BooksEntity[];

      //Se espía la función find y se simula el valor books
      jest.spyOn(booksRepository, 'find').mockResolvedValue(books);

      //Se espera que service.getBooks(params) se igual a books
      expect(await service.getBooks({})).toBe(books);

      //Se espera que booksRepository.find sea llamado una vez
      expect(booksRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('getBook', () => {
    it('Debería retornar un book según el id', async () => {
      const id: number = 1;
      //Se crea un book
      const bookFound = { id: id } as BooksEntity;

      //Se espía la función findOne y se simula el valor de bookFound
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(bookFound);

      //Se espera que service.getBook(id) sea igual a bookFound
      expect(await service.getBook(id)).toBe(bookFound);
      //Se espera que booksRepository.findOne se llamado con el id
      expect(booksRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('Debería lanzar una exepción si el book no se encuentra', async () => {
      const id: number = 1;

      //Se espía la función findOne y se simula el valor null(simulando que no ha sido encontrado).
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(null);

      //Se espera que service.getBook(id) rechace la promesa y lanze una exepción, un msm y un status
      await expect(service.getBook(id)).rejects.toThrow(HttpException);
      await expect(service.getBook(id)).rejects.toThrow('Book No Encontrado');
      await expect(service.getBook(id)).rejects.toHaveProperty(
        'status',
        HttpStatus.NOT_FOUND,
      );
    });
  });

  describe('createBook', () => {
    it('Debería lanzar una exepción si el book ya exite', async () => {
      const createBook: CreateBookDTO = {
        title: 'La metamorfosis',
        publication_year: 1915,
        isbn: '9783966378819',
        author: 'Franz Kafka',
        category: 'Absurdo',
        image_url:
          'https://books.google.com.ar/books/content?id=f9GvxTOq7CgC&pg=PP1&img=1&zoom=3&hl=en&bul=1&sig=ACfU3U0Ya5Kcvmk7GkaD1Rf0OEc44IcA-Q&w=1280',
      };
      //Se combinan las propiedades del id y el create book
      const bookFound = { id: 1, ...createBook } as BooksEntity;

      //S espía la función findOne y se simula el valor  bookFound
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(bookFound);

      //Se espera que service.createBook(createBook) rechace la pormesa y lanze una exepción, un msm y un status
      await expect(service.createBook(createBook)).rejects.toThrow(
        HttpException,
      );
      await expect(service.createBook(createBook)).rejects.toThrow(
        'Book Ya Existe',
      );
      await expect(service.createBook(createBook)).rejects.toHaveProperty(
        'status',
        HttpStatus.CONFLICT,
      );
    });

    it('Debería crear un book', async () => {
      //Se crea un dto con los datos del book
      const createBook: CreateBookDTO = {
        title: 'La metamorfosis',
        publication_year: 1915,
        isbn: '9783966378819',
        author: 'Franz Kafka',
        category: 'Absurdo',
        image_url:
          'https://books.google.com.ar/books/content?id=f9GvxTOq7CgC&pg=PP1&img=1&zoom=3&hl=en&bul=1&sig=ACfU3U0Ya5Kcvmk7GkaD1Rf0OEc44IcA-Q&w=1280',
      };
      //Se combinan las propiedades del id y el create book
      const newBook = { id: 1, ...createBook } as BooksEntity;

      //Se espía la función findOne y si simula su valor null, simulando que no hay un libro igual
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(null);
      //Se espía la función save y se simula el valor de newBook
      jest.spyOn(booksRepository, 'save').mockResolvedValue(newBook);

      //Se espera que service.createBook(createBook) sea igual a newBook
      expect(await service.createBook(createBook)).toBe(newBook);
      expect(booksRepository.save).toHaveBeenCalledWith(createBook);
    });
  });

  describe('deleteBook', () => {
    it('debería lanzar un error si el libro no se encuentra', async () => {
      //Se espía la función findOne y se simula el valor null
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(null);

      //Se espera que service.deleteBook(1) rechace la promise y lanze una exepción, un msm y el status
      await expect(service.deleteBook(1)).rejects.toThrow(HttpException);
      await expect(service.deleteBook(1)).rejects.toThrow('Book No Encontrado');
      await expect(service.deleteBook(1)).rejects.toHaveProperty(
        'status',
        HttpStatus.NOT_FOUND,
      );
    });

    it('debería eliminar el libro si se encuentra', async () => {
      //Se crea un book
      const bookFound = { id: 1, copies: [] } as BooksEntity;

      //Se espía la función findOne y se simula el valor del bookFound
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(bookFound);
      //Se espía la función remove y se simula el valor null
      const removeSpy = jest
        .spyOn(booksRepository, 'remove')
        .mockResolvedValue(null);

      //Se espera que service.deleteBook(1) sea undefined
      await expect(service.deleteBook(1)).resolves.toBeUndefined();
      //Se espera quebooks Repository.remove sea llamado con bookFound
      expect(booksRepository.remove).toHaveBeenCalledWith(bookFound);
    });

    it('debería manejar el error de referencia (ER_ROW_IS_REFERENCED_2)', async () => {
      const book = { id: 1, copies: [] } as BooksEntity;
      jest.spyOn(booksRepository, 'findOne').mockResolvedValueOnce(book);
      const error = new Error();
      (error as any).code = 'ER_ROW_IS_REFERENCED_2';
      jest.spyOn(booksRepository, 'remove').mockRejectedValueOnce(error);

      await expect(service.deleteBook(1)).rejects.toThrow(
        new HttpException(
          'No se puede eliminar el book porque tiene copies asociadas!',
          HttpStatus.BAD_REQUEST,
        ),
      );

      expect(booksRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['copies'],
      });
      expect(booksRepository.remove).toHaveBeenCalledWith(book);
    });

    it('debería manejar otros errores', async () => {
      //Se crea un book
      const bookFound = { id: 1, copies: [] } as BooksEntity;
      //Se alamacena el error
      const error = new Error('Other error');

      //Se espía la función findOne y se simula el valor de bookFound
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(bookFound);
      //Se espía la función de remove y se simula el valor de error
      jest.spyOn(booksRepository, 'remove').mockRejectedValue(error);
      //Se espía la función de error y se simula una función vacia
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      //Se espera que service.deleteBook(1) rechace la promise y lanze el error
      await expect(service.deleteBook(1)).rejects.toThrow(error);
      //Se espera que consoleErrorSpy sea llamado con el mensaje de errors
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error al eliminar el libro:',
        error.message,
      );
    });
  });

  describe('updateBook', () => {
    it('Debería lanzar una excepción si el libro no existe', async () => {
      const id = 1;
      //Se crea la actualización del book
      const updateBookDTO: UpdateBookDTO = {
        title: 'El principe',
      };

      //Se espía la función findOne y se simula el valor null
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(null);

      //Se espera que service.updateBook(id, updateBookDTO) se rechace la promise y se lanze una exepción, un msm y un status
      await expect(service.updateBook(id, updateBookDTO)).rejects.toThrow(
        HttpException,
      );
      await expect(service.updateBook(id, updateBookDTO)).rejects.toThrow(
        'Book No Existe',
      );
      await expect(
        service.updateBook(id, updateBookDTO),
      ).rejects.toHaveProperty('status', HttpStatus.NOT_FOUND);
    });

    it('Debería actualizar un libro correctamente cuando se encuentra', async () => {
      const id = 1;
      //Se crea el book
      const bookFound = { id: 1, title: 'El principito' } as BooksEntity;
      //Se crea la actualización del book
      const updateBookDTO: UpdateBookDTO = {
        title: 'El principe',
      };
      //Se crea una variable y se unen las propiedades de bookFound, updateBookDT
      const updatedBook = { ...bookFound, ...updateBookDTO };

      //Se espía la función findOne y se simula el valor bookFound
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(bookFound);
      //Se espía la función save y se simula el valor de updateBook
      jest.spyOn(booksRepository, 'save').mockResolvedValue(updatedBook);

      //Se espera que service.updateBook(id, updateBookDTO sea igual updatedBook
      expect(await service.updateBook(id, updateBookDTO)).toBe(updatedBook);
      expect(booksRepository.save).toHaveBeenCalledWith(updatedBook);
    });
  });
});

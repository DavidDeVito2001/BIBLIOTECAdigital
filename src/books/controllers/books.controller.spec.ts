import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from '../../books/services/books.service';
import { CreateBookDTO } from '../../books/dto/create-book.dto';
import { UpdateBookDTO } from '../../books/dto/update-book.dto';
import { BooksEntity } from '../../books/entities/books.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            //Se usan las funciones simuladas:
            getBooks: jest.fn(),
            getBook: jest.fn(),
            createBook: jest.fn(),
            deleteBook: jest.fn(),
            updateBook: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(AuthGuard) //Se anula los valores de AuthGuard y se cambian por true
    .useValue(true)
    .overrideGuard(RolesGuard) //Se anula los valores de RolesGuard y se cambian por true
    .useValue(true)
    .compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getBooks', () => {
    it('Debería retornar una lista de books', async () => {
      //Se declara una lista [instancia de BooksEntity]
      const result = [new BooksEntity()];

      //Se espía la función getBooks y se simula el resultado de result
      jest.spyOn(service, 'getBooks').mockResolvedValue(result);

      //Se espera que controller.getBooks({} as any)) sea igual a result
      expect(await controller.getBooks({} as any)).toBe(result);
    });
  });

  describe('getBook', () => {
    it('Debería retornar un libro según su id', async () => {
      //Instanciamos la entidad BooksEnitity
      const result = new BooksEntity();
      
      //Se edspía la función getBook y se simula el resultado de result
      jest.spyOn(service, 'getBook').mockResolvedValue(result);

      //Se espera que controller.getBook(1) sea igual a result
      expect(await controller.getBook(1)).toBe(result);
    });

    it('Debería lanzar una exepción si el book no es encontrado', async () => {
      //Se espía la función getBook y se simula el rechazo de una Promise y se lanza una Exepción
      jest.spyOn(service, 'getBook').mockRejectedValue(new HttpException('Book not found', HttpStatus.NOT_FOUND));
      
      //Se espera que (controller.getBook(1) rechace la Promise y lanza una exepción
      await expect(controller.getBook(1)).rejects.toThrow(HttpException);
    });
  });

  describe('createBook', () => {
    it('Debería crear un nuevo book', async () => {
      //Se crea una instancia de CreateBookDTO
      const dto = new CreateBookDTO();
      //Se crea una instancia de BooksEntity
      const result = new BooksEntity();

      //Se espía la función createBook y se simula el valor result
      jest.spyOn(service, 'createBook').mockResolvedValue(result);

      //Se espera que controller.createBook(dto) sea igual result
      expect(await controller.createBook(dto)).toBe(result);
    });

    it('Debería lanzar una exepción si el book ya existe', async () => {
      //Creamos una instancia del dto
      const dto = new CreateBookDTO();
      //Se espía la función createBook y se simula un rechazo del valor y un lanzamiento de una exepción
      jest.spyOn(service, 'createBook').mockRejectedValue(new HttpException('Book Ya Existe', HttpStatus.CONFLICT));

      await expect(controller.createBook(dto)).rejects.toThrow(HttpException);
    });
  });

  describe('deleteBook', () => {
    it('Debería eliminar un book según el id', async () => {
      //Se espía la función deleteBook y se simula el valor undefined
      jest.spyOn(service, 'deleteBook').mockResolvedValue(undefined);

      //Se espera que controller.deleteBook(1) sea igual a undefined
      expect(await controller.deleteBook(1)).toBe(undefined);
    });

    it('Debería lanzar una expeción si el book no existe', async () => {
      //Se espía la función deleteBook y se simula el rechazo de la promise con un lanzamiento de exepción
      jest.spyOn(service, 'deleteBook').mockRejectedValue(new HttpException('Book not found', HttpStatus.NOT_FOUND));

      //Se espera que controller.deleteBook(1) rechaze la promise y lanze una exepción
      await expect(controller.deleteBook(1)).rejects.toThrow(HttpException);
    });
  });
  
  describe('updateBook', () => {
    it('Debería actualizar el book según el id', async () => {
      //Se instancia el dto
      const dto = new UpdateBookDTO();
      //Se instancia la entidad
      const result = new BooksEntity();

      //Se espía la función updateBook y se simula el valor result
      jest.spyOn(service, 'updateBook').mockResolvedValue(result);

      //Se espera que controller.updatebook(1, dto) sea igual a result
      expect(await controller.updatebook(1, dto)).toBe(result);
    });

    it('Debería lanzar una expeción si el book no existe', async () => {
      //Se instancia el dto
      const dto = new UpdateBookDTO();
      //Se espía la función updateBook de service y se simula el rechazo de la promise y el lanzamiento de la exepción
      jest.spyOn(service, 'updateBook').mockRejectedValue(new HttpException('Book not found', HttpStatus.NOT_FOUND));

      await expect(controller.updatebook(1, dto)).rejects.toThrow(HttpException);
    });
  });
});

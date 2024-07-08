import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { CopiesService } from './copies.service';
import { CopiesEntity } from '../../copies/entities/copies.entity';
import { BooksEntity } from '../../books/entities/books.entity';
import { CreateCopyDTO } from '../../copies/dto/create-copies.dto';
import { UpdateCopyDTO } from '../../copies/dto/update-copies.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CopiesService', () => {
  let service: CopiesService;
  let copiesRepository: Repository<CopiesEntity>;
  let booksRepository: Repository<BooksEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CopiesService,
        {
          provide: getRepositoryToken(CopiesEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BooksEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CopiesService>(CopiesService);
    copiesRepository = module.get<Repository<CopiesEntity>>(getRepositoryToken(CopiesEntity));
    booksRepository = module.get<Repository<BooksEntity>>(getRepositoryToken(BooksEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCopiesByBookId', () => {
    it('Debería retornar un book con sus copies asociadas', async () => {
      const bookId = 1;
      //Es una instancia de la entidad que representa un book
      const foundBook = new BooksEntity();
      //El id del book encontrado es igual al bookId
      foundBook.id = bookId;
      //La propiedad copies es igual una lista de copias [instancia de CopiesEntity]
      foundBook.copies = [new CopiesEntity()];

      //Se espía la función findOne de booksRepository y simula el valor de foundBook
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(foundBook);

      //Se espera que service.getCopiesByBookId(bookId) sea igual a foundBook
      expect(await service.getCopiesByBookId(bookId)).toBe(foundBook);
      //Se espera que booksRepository.findOne sea llamado con bookId y contenga relaciones de 'copies'
      expect(booksRepository.findOne).toHaveBeenCalledWith({
        where: { id: bookId },
        relations: ['copies'],
      });
    });
    
    it('Debería lanzar una exepción si el book no fue encontrado', async () => {
      const bookId = 1;
      //Se espía la función findOne y se simula el valor null.(Porque no fue encontrado)
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(null);
      
      //Se espera que service.getCopiesByBookId(bookId) rechace la promesa y devuelva una exepción, un msm y un status
      await expect(service.getCopiesByBookId(bookId)).rejects.toThrow(HttpException);
      await expect(service.getCopiesByBookId(bookId)).rejects.toThrow('Book No Existe');
      await expect(service.getCopiesByBookId(bookId)).rejects.toHaveProperty('status', HttpStatus.NOT_FOUND);
    });
  });

  describe('createCopy', () => {
    it('Debería lanzar un error si el libro no existe al intentar crear la copia', async () => {
      const bookId = 1;
      const createCopyDto: CreateCopyDTO = { copyNumber: 1 };
  
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(null);
  
      await expect(service.createCopy(bookId, createCopyDto)).rejects.toThrow(
        new HttpException('Book No Encontrado.', HttpStatus.NOT_FOUND),
      );
  
      expect(booksRepository.findOne).toHaveBeenCalledWith({ where: { id: bookId } });
      
    });
  
    it('Debería lanzar un error si ya existe una copia con el mismo número para el libro dado', async () => {
      const bookId = 1;
      const createCopyDto: CreateCopyDTO = { copyNumber: 1 };
      const foundBook = new BooksEntity();
      foundBook.id = bookId;
      const existingCopy = new CopiesEntity();
      existingCopy.bookId = bookId;
      existingCopy.copyNumber = createCopyDto.copyNumber;
  
      jest.spyOn(booksRepository, 'findOne').mockResolvedValue(foundBook);
      jest.spyOn(copiesRepository, 'findOne').mockResolvedValue(existingCopy);
  
      await expect(service.createCopy(bookId, createCopyDto)).rejects.toThrow(
        new HttpException('Copy con ese número ya existe para este libro.', HttpStatus.CONFLICT),
      );
  
      expect(booksRepository.findOne).toHaveBeenCalledWith({ where: { id: bookId } });
      expect(copiesRepository.findOne).toHaveBeenCalledWith({ where: { bookId, copyNumber: createCopyDto.copyNumber } });
      
    });
  });
  
  
  describe('deleteCopy', () => {
    it('Debería eliminar la copy y retornar un resultado', async () => {
      const bookId = 1;
    const createCopyDto: CreateCopyDTO = { copyNumber: 1 };
    const foundBook = new BooksEntity();
    foundBook.id = bookId;
    const newCopy = new CopiesEntity();
    newCopy.copyNumber = createCopyDto.copyNumber;

    jest.spyOn(booksRepository, 'findOne').mockResolvedValue(foundBook);
    jest.spyOn(copiesRepository, 'findOne').mockResolvedValue(null); // Simulamos que no existe una copia previa
    jest.spyOn(copiesRepository, 'create').mockReturnValue(newCopy);
    jest.spyOn(copiesRepository, 'save').mockResolvedValue(newCopy);

    const result = await service.createCopy(bookId, createCopyDto);

    expect(result).toEqual(newCopy);
    expect(booksRepository.findOne).toHaveBeenCalledWith({ where: { id: bookId } });
    expect(copiesRepository.findOne).toHaveBeenCalledWith({ where: { bookId, copyNumber: createCopyDto.copyNumber } });
    expect(copiesRepository.create).toHaveBeenCalledWith(createCopyDto);
    expect(copiesRepository.save).toHaveBeenCalledWith({ ...newCopy, bookId: bookId, book: foundBook });
    });
  
    it('Debería lanzar una exepción si la copy no es encontrada', async () => {
      const id = 1;
      //Resultado de la eliminación
      const deleteResult: DeleteResult = { affected: 0, raw: {} };
      
      //Se espía la función delete y se simula el resultado de deleteResult
      jest.spyOn(copiesRepository, 'delete').mockResolvedValue(deleteResult);
      
      //Se espera que service.deleteCopy(id) rechace la promesa y lanze una exepción, un msm y un status
      await expect(service.deleteCopy(id)).rejects.toThrow(HttpException);
      await expect(service.deleteCopy(id)).rejects.toThrow('Copy No Encontrada');
      await expect(service.deleteCopy(id)).rejects.toHaveProperty('status', HttpStatus.NOT_FOUND);
    });
  
    it('Debería manejar foreign key constraint error', async () => {
      const id = 1;
    const error = new Error('Some foreign key constraint error');
    (error as any).code = 'ER_ROW_IS_REFERENCED_2';

    jest.spyOn(copiesRepository, 'delete').mockRejectedValue(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(service.deleteCopy(id)).rejects.toThrow(
      new HttpException('No se puede eliminar la copy porque tiene préstamos asociados!', HttpStatus.BAD_REQUEST),
    );

    expect(copiesRepository.delete).toHaveBeenCalledWith(id);
    consoleSpy.mockRestore();
  });
}); 

  describe('updateCopy', () => {
    it('Debería actualizar y retornar una copy según el id', async () => {
      const id = 1;
      //Creamos la copy
      const updateCopyDto: UpdateCopyDTO = { copyNumber: 123 };
      //Intanciamos el copiesEntity
      const copyFound = new CopiesEntity();
      //La copy actualizada y combina las propiedades de copyFound y updateCopyDto
      const updatedCopy = { ...copyFound, ...updateCopyDto };

      //Se espía la función findOne y se simula la copyFound
      jest.spyOn(copiesRepository, 'findOne').mockResolvedValue(copyFound);
      //Se espía la función save y se simula el resultado updateCopy
      jest.spyOn(copiesRepository, 'save').mockResolvedValue(updatedCopy);

      //Se espera que service.updateCopy(id, updateCopyDto) sea igual a updatedCopy
      expect(await service.updateCopy(id, updateCopyDto)).toBe(updatedCopy);
      //Se espera que copiesRepository.findOne se llame con el parametro id
      expect(copiesRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      //Se espera que copiesRepository.save sea llamado con el parametro updatedCopy
      expect(copiesRepository.save).toHaveBeenCalledWith(updatedCopy);
    });

    it('Debería lanzar una exepción si la copy no es encontrada', async () => {
      const id = 1;
      //Se crea una copy
      const updateCopyDto: UpdateCopyDTO = { copyNumber: 123 };

      //Se espía la función fiondOne y se simula el resultado null
      jest.spyOn(copiesRepository, 'findOne').mockResolvedValue(null);

      //Se espera que service.updateCopy(id, updateCopyDto) rechace la promesa y lanze una exepción, un msm y un status
      await expect(service.updateCopy(id, updateCopyDto)).rejects.toThrow(HttpException);
      await expect(service.updateCopy(id, updateCopyDto)).rejects.toThrow('Copy No Encontrada.');
      await expect(service.updateCopy(id, updateCopyDto)).rejects.toHaveProperty('status', HttpStatus.NOT_FOUND);
    });
  });
});

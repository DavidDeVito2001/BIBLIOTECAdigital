import { Test, TestingModule } from '@nestjs/testing';
import { CopiesController } from './copies.controller';
import { CopiesService } from '../../copies/services/copies.service';
import { CreateCopyDTO } from '../../copies/dto/create-copies.dto';
import { UpdateCopyDTO } from '../../copies/dto/update-copies.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { BooksEntity } from '../../books/entities/books.entity';
import { CopiesEntity } from '../../copies/entities/copies.entity';

describe('CopiesController', () => {
  let controller: CopiesController;
  let service: CopiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CopiesController],
      providers: [
        {
          provide: CopiesService,
          useValue: {
            //Simulación de funciones
            getCopiesByBookId: jest.fn(),
            createCopy: jest.fn(),
            deleteCopy: jest.fn(),
            updateCopy: jest.fn(),
          },
        },
      ],
    })
    .overrideGuard(AuthGuard) //Anulamos el AuthGuard y lo dejamos en true
    .useValue(true)
    .overrideGuard(RolesGuard) //Anulamos el RolesGuard y lo dejamos en trye
    .useValue(true)
    .compile();

    controller = module.get<CopiesController>(CopiesController);
    service = module.get<CopiesService>(CopiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCopiesByBookId', () => {
    it('Debería retornar un book según el id', async () => {
      const bookId = 1;
      //Creamos un result que es un book
      const result = new BooksEntity();
      //Espía la función getCopiesById de service y simula el valor result
      jest.spyOn(service, 'getCopiesByBookId').mockResolvedValue(result);
      //Se espera que controller.getCopiesByBookId(bookId) sea igual a result
      expect(await controller.getCopiesByBookId(bookId)).toBe(result);
      //Se espera que service.getCopiesByBookId sea llamado con bookId
      expect(service.getCopiesByBookId).toHaveBeenCalledWith(bookId);
    });
  });

  describe('createCopy', () => {
    it('Debería crear y retornar una copy', async () => {
      const bookId = 1;
      //Creamos una copy
      const createCopyDto: CreateCopyDTO = { copyNumber: 123 };
      //Creamos una instancia de la entidad copiesEntity
      const result = new CopiesEntity();
      //Se espía la función createCopy de service y se simula el resultado result
      jest.spyOn(service, 'createCopy').mockResolvedValue(result);

      //Se espera que controller.createCopy(bookId, createCopyDto) sea igual a result
      expect(await controller.createCopy(bookId, createCopyDto)).toBe(result);
      //Se espera que service.createCopy sea llamado con bookId, createCopyDto
      expect(service.createCopy).toHaveBeenCalledWith(bookId, createCopyDto);
    });
  });

  describe('deleteCopy', () => {
    it('Debería eliminar una copy según el id', async () => {
      const id = 1;
      //Se espía la función deleteCopy de service y se simula el resultado undefined
      jest.spyOn(service, 'deleteCopy').mockResolvedValue(undefined);

      //Se espera que controller.deleteCopy(id) sea undefined
      expect(await controller.deleteCopy(id)).toBeUndefined();
      //Se espera que service.deleteCopy sea llamado con id
      expect(service.deleteCopy).toHaveBeenCalledWith(id);
    });
  });

  describe('updateCopy', () => {
    it('Debería actualizar y retornar la copy segpun el id', async () => {
      const id = 1;
      //Se crea la copy con los datos para actualizar
      const updateCopyDto: UpdateCopyDTO = { available: true, copyNumber: 123 };
      //Se instancia la entidad CopiesEntity()
      const result = new CopiesEntity();
      //Se espía la función updateCopy de service y se simula el resultado result
      jest.spyOn(service, 'updateCopy').mockResolvedValue(result);

      //Se espera que controller.updateCopy(id, updateCopyDto) sea igual a result
      expect(await controller.updateCopy(id, updateCopyDto)).toBe(result);
      //Se espera que service.updateCopy sea llamado con id, updateCopyDto
      expect(service.updateCopy).toHaveBeenCalledWith(id, updateCopyDto);
    });
  });
});

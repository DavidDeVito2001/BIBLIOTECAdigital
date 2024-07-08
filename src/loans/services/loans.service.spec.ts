import { Test, TestingModule } from '@nestjs/testing';
import { LoansService } from './loans.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoansEntity } from '../../loans/entities/loans.entity';
import { CopiesEntity } from '../../copies/entities/copies.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateLoanDTO } from '../dto/create-loan.dto';
import { UpdateLoanDTO } from '../dto/update-loan.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('LoansService', () => {
  let service: LoansService;
  let loansRepository: Repository<LoansEntity>;
  let copiesRepository: Repository<CopiesEntity>;
  let usersRepository: Repository<UsersEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoansService,
        {
          provide: getRepositoryToken(LoansEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CopiesEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UsersEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LoansService>(LoansService);
    loansRepository = module.get<Repository<LoansEntity>>(getRepositoryToken(LoansEntity));
    copiesRepository = module.get<Repository<CopiesEntity>>(getRepositoryToken(CopiesEntity));
    usersRepository = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity));
  });

  describe('getLoans', () => {
    it('Debería retornar una lista de loans', async () => {
      const params = {};
      //Lista de objeto con un id que representa una LoansEntity
      const result = [{ id: 1 }] as LoansEntity[];
      //Se espía la funcion find del objeto y simula con valor del result
      jest.spyOn(loansRepository, 'find').mockResolvedValue(result);
      //Se espera que getLoans sea igual a result
      expect(await service.getLoans(params)).toBe(result);
      //Se espera que loansRepository.find se llame con los argumentos necesarios
      expect(loansRepository.find).toHaveBeenCalledWith(params);
    });
  });

  describe('getLoan', () => {
    it('Debería retornar un loan', async () => {
      const loanId = 1;
      //Se crea resultado que un objeto con un id que representa un loansEntity
      const result = { id: loanId } as LoansEntity;
      //Se espía la funcion findOne del objeto y simula la devolución del result
      jest.spyOn(loansRepository, 'findOne').mockResolvedValue(result);
      //Se espera que getLoan(loanId) sea igual al result
      expect(await service.getLoan(loanId)).toBe(result);
      //Se verifica que se esten llamando con los parametros necesarios
      expect(loansRepository.findOne).toHaveBeenCalledWith({ where: { id: loanId } });
    });

    it('Debería lanzar una exepción si el loan no es encontrado', async () => {
      const loanId = 1;
      //Se espía la funcion findOne del obejto(loansRepository) y se simula un valor null
      jest.spyOn(loansRepository, 'findOne').mockResolvedValue(null);
      //Se espera que getLoan(loanId) rechaze la promesa y lanze una exepción
      await expect(service.getLoan(loanId)).rejects.toThrow(HttpException);
      await expect(service.getLoan(loanId)).rejects.toThrow('Loan No Encontrado');
      await expect(service.getLoan(loanId)).rejects.toHaveProperty('status', HttpStatus.NOT_FOUND);
    });
  });

  describe('createLoans', () => {
    it('Debería crear un Loan', async () => {
      //Variable con el loan creado
      const createLoanDto: CreateLoanDTO = {
        loan_return: new Date(),
        userId: 1,
        copyId: 1,
      };
      //User encontrado, con el mismo valor de id que tiene el createLoanDto representando un UsersEntity
      const userFound = { id: createLoanDto.userId } as UsersEntity;
      //La copy encontrada con el mismo valor de copyId que tiene el createLoanDto representando un copiesEntity
      const copyFound = { id: createLoanDto.copyId, available: true } as CopiesEntity;
      //El loan con el id y los valores de createLoanDto representando un LoansEntity
      const newLoan = { id: 1, ...createLoanDto } as LoansEntity;

      //Se espía la función findOne y se simula el valor de userFound
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(userFound);
      //Se espía la función findOne y se simula el valor de copyFound
      jest.spyOn(copiesRepository, 'findOne').mockResolvedValue(copyFound);
      //Se espía la función save y se simula el valor de copyFound, esto se hace porque cambia la propiedad 'available'
      jest.spyOn(copiesRepository, 'save').mockResolvedValue(copyFound);
      //Se espía la función save y se simula el valor de newLoan
      jest.spyOn(loansRepository, 'save').mockResolvedValue(newLoan);

      //Se espera que createLoans(createLoanDto)sea igual a newLoan
      expect(await service.createLoans(createLoanDto)).toBe(newLoan);
      //Se espera que usersRepository.findOne sea llamado con los valores:
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: createLoanDto.userId } });
      //Se espera que copiesRepository.findOne sea llamado con los valores:
      expect(copiesRepository.findOne).toHaveBeenCalledWith({ where: { id: createLoanDto.copyId } });
      //Se espera que copiesRepository.save se guardado con los valores copyFound, available: false
      expect(copiesRepository.save).toHaveBeenCalledWith({ ...copyFound, available: false });
      //Se espera que loansRepository.save que sea llamado y contengan user: userFound, copy: copyFound,
      expect(loansRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        user: userFound,
        copy: copyFound,
      }));
    });

    it('Debería enviar una exepción si el user no es encontrado', async () => {
      //Se crea un loan
      const createLoanDto: CreateLoanDTO = {
        loan_return: new Date(),
        userId: 1,
        copyId: 1,
      };
      //Se espía la función findOne y se simula el valor null(Como si no lo hubieran encontrado)
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);
      //Se espera que service.createLoans(createLoanDto) rechace la promesa y envie una exepción, un msm y un status
      await expect(service.createLoans(createLoanDto)).rejects.toThrow(HttpException);
      await expect(service.createLoans(createLoanDto)).rejects.toThrow('User No Encontrado');
      await expect(service.createLoans(createLoanDto)).rejects.toHaveProperty('status', HttpStatus.NOT_FOUND);
    });

    it('Debería lanzar una exepción si la copy no es encontrada', async () => {
      //Se crea el loan
      const createLoanDto: CreateLoanDTO = {
        loan_return: new Date(),
        userId: 1,
        copyId: 1,
      };
      //Se crea el userFound representando un UsersEntity
      const userFound = { id: createLoanDto.userId } as UsersEntity;
      //Se espía la función findOne del obejeto usersRepository y se simula el valor userFound. (Como si lo hubiera encontrado)
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(userFound);
      //Se espía la función findOne del objeto copiesRepository y se simula el valor null. (Como si no lo hubiera encontrado)
      jest.spyOn(copiesRepository, 'findOne').mockResolvedValue(null);

      //Se espera que (service.createLoans(createLoanDto) rechaze la Promesa y lanze una Exepción, un msm y un status
      await expect(service.createLoans(createLoanDto)).rejects.toThrow(HttpException);
      await expect(service.createLoans(createLoanDto)).rejects.toThrow('Copy No Encontrada');
      await expect(service.createLoans(createLoanDto)).rejects.toHaveProperty('status', HttpStatus.NOT_FOUND);
    });

    it('Debería lanzar una exepción si la copy no esta disponible', async () => {
      //Se crea un loan
      const createLoanDto: CreateLoanDTO = {
        loan_return: new Date(),
        userId: 1,
        copyId: 1,
      };
      //Se crea un userFound
      const userFound = { id: createLoanDto.userId } as UsersEntity;
      //Se crea una copyFound pero con la propiedad 'available' en false(No disponible)
      const copyFound = { id: createLoanDto.copyId, available: false } as CopiesEntity;

      //Se espía la función FindOne de usersRepository y se simula el valor de userFound
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(userFound);
      //Se esppía la función findOne del copiesRepository y se simula el valor copyFound
      jest.spyOn(copiesRepository, 'findOne').mockResolvedValue(copyFound);

      //Se espera que service.createLoans(createLoanDto rechaze el valor y lanze una exepción, un msm y un status
      await expect(service.createLoans(createLoanDto)).rejects.toThrow(HttpException);
      await expect(service.createLoans(createLoanDto)).rejects.toThrow('Lo siento, la copia no está disponible');
      await expect(service.createLoans(createLoanDto)).rejects.toHaveProperty('status', HttpStatus.CONFLICT);
    });
  });

  describe('deleteLoan', () => {
    it('Debería eliminar un loan', async () => {
      const loanId = 1;
      //Se crean un loan encontrado
      const foundLoan = { id: loanId, copyId: 1 } as LoansEntity;
      //Creamos una copyFound con la propiedad 'available' en false
      const copyFound = { id: foundLoan.copyId, available: false } as CopiesEntity;

      //Se espía la función findOne de loansRepository y se simula el valor foundLoan
      jest.spyOn(loansRepository, 'findOne').mockResolvedValue(foundLoan);
      //Se espía la función findOne del copiesRepository y se simula el valor copyFound
      jest.spyOn(copiesRepository, 'findOne').mockResolvedValue(copyFound);
      //Se espía la función save de copiesRepository y se simula el valor copyFound. Lo guardamos porque una vez eliminado cambiaria la disponibilidad
      jest.spyOn(copiesRepository, 'save').mockResolvedValue(copyFound);
      //Se espía la función remove del loansRepository y se simula el valor undefined.(Como si los hubieran eliminado)
      jest.spyOn(loansRepository, 'remove').mockResolvedValue(undefined);

      //Se inializa la función y se le pasa el loanId
      await service.deleteLoan(loanId);

      //Se espera que loansRepository.findOne se llame con el loanId
      expect(loansRepository.findOne).toHaveBeenCalledWith({ where: { id: loanId } });
      //Se espera que copiesRepository.findOne se llame con el foundLoan.copyId
      expect(copiesRepository.findOne).toHaveBeenCalledWith({ where: { id: foundLoan.copyId } });
      //Se espera copiesRepository.save se llame con  ...copyFound, available: true
      expect(copiesRepository.save).toHaveBeenCalledWith({ ...copyFound, available: true });
      //Se espera que loansRepository.remove se llame con foundLoan
      expect(loansRepository.remove).toHaveBeenCalledWith(foundLoan);
    });

    it('Debería lanzar una exepción si el loan no es encontrado', async () => {
      const loanId = 1;
      //Se espía la función finOne y se simula el valor null (No encontrado)
      jest.spyOn(loansRepository, 'findOne').mockResolvedValue(null);
      //Se espera que service.deleteLoan(loanId) rechaze la promesa y envie una exepción, msm y un status
      await expect(service.deleteLoan(loanId)).rejects.toThrow(HttpException);
      await expect(service.deleteLoan(loanId)).rejects.toThrow('Loan No Encontrado');
      await expect(service.deleteLoan(loanId)).rejects.toHaveProperty('status', HttpStatus.NOT_FOUND);
    });
  });

  describe('updateLoan', () => {
    it('Debería actualizar el Loan', async () => {
      const loanId = 1;
      //Se crea el Loan con los datos para actualizar
      const updateLoanDto: UpdateLoanDTO = {
        loan_return: new Date(),
        real_day_return: new Date(),
        is_returned: true,
      };
      //Se crea un loanFound con el id representando LoansEntity
      const loanFound = { id: loanId } as LoansEntity;
      //Se crea un updatedLoan con los datos del loan ya actualizado
      const updatedLoan = { ...loanFound, ...updateLoanDto } as LoansEntity;

      //Se espía la función findOne y se simula el valor de loanFound
      jest.spyOn(loansRepository, 'findOne').mockResolvedValue(loanFound);
      //Se espía la función save y se simula el valor de updatedLoan
      jest.spyOn(loansRepository, 'save').mockResolvedValue(updatedLoan);

      //Se espera que service.updateLoan(loanId, updateLoanDto sea igual a updatedLoan
      expect(await service.updateLoan(loanId, updateLoanDto)).toBe(updatedLoan);
      //Se espera que loansRepository.findOne sean llamado con el loanId
      expect(loansRepository.findOne).toHaveBeenCalledWith({ where: { id: loanId } });
      //Se espera que loansRepository.save sea llamado y contenga el updateLoanDto
      expect(loansRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateLoanDto));
    });

    it('Debería lanzar una exepción si el loan no es encontrado', async () => {
      const loanId = 1;
      //Se crea el loan con las actualizaciones
      const updateLoanDto: UpdateLoanDTO = {
        loan_return: new Date(),
        real_day_return: new Date(),
        is_returned: true,
      };
      //Se espía la función findOne del loansRepository y se simula el valor null(no encontrado)
      jest.spyOn(loansRepository, 'findOne').mockResolvedValue(null);

      //Se espera que service.updateLoan(loanId, updateLoanDto rechaze la promesa y lanza una exepción, msm y un status
      await expect(service.updateLoan(loanId, updateLoanDto)).rejects.toThrow(HttpException);
      await expect(service.updateLoan(loanId, updateLoanDto)).rejects.toThrow('Loan No Existe');
      await expect(service.updateLoan(loanId, updateLoanDto)).rejects.toHaveProperty('status', HttpStatus.NOT_FOUND);
    });
  });
});

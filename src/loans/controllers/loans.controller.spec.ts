import { Test, TestingModule } from '@nestjs/testing';
import { LoansController } from './loans.controller';
import { LoansService } from '../../loans/services/loans.service';
import { CreateLoanDTO } from '../../loans/dto/create-loan.dto';
import { UpdateLoanDTO } from '../../loans/dto/update-loan.dto';
import { LoansEntity } from '../../loans/entities/loans.entity';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('LoansController', () => {
  let controller: LoansController;
  let service: LoansService;

  //Simulación de LoansServices con sus funciones
  const mockLoansService = {
    getLoans: jest.fn(),
    getLoan: jest.fn(),
    createLoans: jest.fn(),
    deleteLoan: jest.fn(),
    updateLoan: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoansController],
      providers: [
        {
          provide: LoansService,
          useValue: mockLoansService,
        },
      ],
    })
    .overrideGuard(AuthGuard)//Se anula el AuthGuard por true
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(RolesGuard)//Se anula el RolesGuard por true
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<LoansController>(LoansController);
    service = module.get<LoansService>(LoansService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLoans', () => {
    it('Debería retornar una lista de loans', async () => {
      //Se crea una lista de loans como LoansEntity []
      const result = [{ id: 1, loan_return: new Date(), userId: 1, copyId: 1 }] as LoansEntity[];
      //Se espía el comportamiento de getLoan y devuelve el valor result
      jest.spyOn(service, 'getLoans').mockResolvedValue(result);  
      //Lo que se espera de de getLoans, que tiene que se como result
      expect(await controller.getLoans({ query: {} } as Request)).toBe(result);
    });
  });

  describe('getLoan', () => {
    it('Debería retornar un loan según su id', async () => {
      //Se crea un loan con id 1 como un LoansEntity
      const result = { id: 1, loan_return: new Date(), userId: 1, copyId: 1 } as LoansEntity;
      //Se configura el espía para que devuelva el result
      jest.spyOn(service, 'getLoan').mockResolvedValue(result);
      //Se espera que el getLoan(id) sea igual a result
      expect(await controller.getLoan(1)).toBe(result);
    });

    it('Debería lanzar un error si el loan no es encontrado', async () => {
      //Se configura el espía de getLoan y se devuelve un error de 'Loan not Found'
      jest.spyOn(service, 'getLoan').mockRejectedValue(new HttpException('Loan not found', HttpStatus.NOT_FOUND));
      //Lo que se espera del getLoan(id) con el rechazo de la promesa y su lanzamiento de error
      await expect(controller.getLoan(1)).rejects.toThrow(HttpException);
    });
  });

  describe('createLoans', () => {
    it('Debería crear un loan', async () => {
      //Se crea un loan
      const loanDto: CreateLoanDTO = { loan_return: new Date(), userId: 1, copyId: 1 };
      //Se crea el resultado que el id y el contenido de loanDto como si fuera un LoansEntity
      const result = { id: 1, ...loanDto } as LoansEntity;
      //Se espía el la función createLoans del objeto y se simula el resultado result
      jest.spyOn(service, 'createLoans').mockResolvedValue(result);
      //Lo que se espera del createLoans(LoanDto) que debe ser igual a result
      expect(await controller.createLoans(loanDto)).toBe(result);
    });

    it('Debería lanzar un error si el user no es encontrado', async () => {
      //Se crea el loan 
      const loanDto: CreateLoanDTO = { loan_return: new Date(), userId: 1, copyId: 1 };
      //Se espia la función createLoans del obejeto y se simula el rechazo del valor lanzando un User Not Found
      jest.spyOn(service, 'createLoans').mockRejectedValue(new HttpException('User not found', HttpStatus.NOT_FOUND));
      //Lo que se espera del valor del createLoans(LoanDto) y el rechazo con el lanzamiento de la exepción
      await expect(controller.createLoans(loanDto)).rejects.toThrow(HttpException);
    });
  });

  describe('deleteLoan', () => {
    it('Debería elminar un loan', async () => {
      //Se espía la función deleteLoan del objeto y se simula el valor undefined
      jest.spyOn(service, 'deleteLoan').mockResolvedValue(undefined);
      //Lo que se espera que haga la función delteLoan(id) que tiene que ser igual a undefined
      expect(await controller.deleteLoan(1)).toBeUndefined();
    });

    it('Debería lanzar un error si el loan no es encontrado', async () => {
      //Se espía la función deleteLoan del objeto y se simula el valor de una expeption Loan Not Found
      jest.spyOn(service, 'deleteLoan').mockRejectedValue(new HttpException('Loan not found', HttpStatus.NOT_FOUND));
      //Lo que se espera del deleteLoan(id) y el rechazo y lanzamiento de un error
      await expect(controller.deleteLoan(1)).rejects.toThrow(HttpException);
    });
  });

  describe('updateLoan', () => {
    it('Debería actualizar al loan según el id', async () => {
      const loanId = 1;
      //Se crea el loan con la datos actualizados
      const updateLoanDto: UpdateLoanDTO = {
        loan_return: new Date(),
        real_day_return: new Date(),
        is_returned: true,
      };
      //Se crea el resultado con el id y los datos actualizados
      const result = { id: loanId, ...updateLoanDto } as LoansEntity;
      //Se espía la función updateLoan del objeto y se simula el valor result
      jest.spyOn(service, 'updateLoan').mockResolvedValue(result);
      //Lo que se espera del updateLoan con el id y updateLoan, que tiene que ser igual resultado
      expect(await controller.updateLoan(loanId, updateLoanDto)).toBe(result);
      expect(service.updateLoan).toHaveBeenCalledWith(loanId, updateLoanDto);
    });
    
    it('Debería crear un error si el loan no es encontrado', async () => {
      //Se crea el loan
      const loanDto: UpdateLoanDTO = { loan_return: new Date() };
      //Se espía la función updateLoan del objeto(service) y se simula el rechazo del valor con la exeption Loan Not Found
      jest.spyOn(service, 'updateLoan').mockRejectedValue(new HttpException('Loan not found', HttpStatus.NOT_FOUND));

      await expect(controller.updateLoan(1, loanDto)).rejects.toThrow(HttpException);
    });
  });
});

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoansEntity } from '../../loans/entities/loans.entity';
import { Repository } from 'typeorm';
import { CopiesEntity } from '../../copies/entities/copies.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { CreateLoanDTO } from '../../loans/dto/create-loan.dto';
import { UpdateLoanDTO } from '../../loans/dto/update-loan.dto';

@Injectable()
export class LoansService {
    constructor(
        @InjectRepository(LoansEntity) private loansRepository: Repository<LoansEntity>,
        @InjectRepository(CopiesEntity) private copiesRepository: Repository<CopiesEntity>,
        @InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>
    ){}

    /**
     * Función que se encarga de traer todos los loans
     * @param {Request} params - Utilizado para ordenar la lista de loans sin modificarlas de forma permanente
     * @returns {LoansEntity[]} - La lista con todos los loans
     */
    public async getLoans(params:any):Promise<LoansEntity[]>{
        return this.loansRepository.find(params);
    }

    /**
     * Esta función sirve para obtener un loan según el id
     * @param {number} id - id de loan que se quiere consultar 
     * @returns {LoansEntity} - devuelve el loan encontrado
     */
    public async getLoan(id:number):Promise<LoansEntity>{
        //Se busca el loan
        const loanFound = await this.loansRepository.findOne({where:{id}});
        //Si no se encuentra se retorna un error - NOT_FOUND
        if(!loanFound){
            throw new HttpException('Loan No Encontrado', HttpStatus.NOT_FOUND);
        }
        //Sino se devuelve el loan encontrado
        return loanFound;

    }

    /**
     * Esta función se encarga de crear un préstamo que tenga asociada la copy alquilada y el user el cual la alquilo
     * @param {CreateLoanDTO} loan - Clase con la estructura inicil que necesita el préstamo 
     * @returns {LoansEntity}
     */
    public async createLoans(loan: CreateLoanDTO):Promise<LoansEntity> {
        //Se ocupa la destructuración de JS para adquirir las propiedades de loan
        const { userId, copyId, loan_return } = loan;
        
        //Buscamos el usuario según el userId proporcionado
        const userFound = await this.usersRepository.findOne({ where: { id: userId } });
        //Si no se encuentra lanzamos un error
        if (!userFound) {
          throw new HttpException('User No Encontrado', HttpStatus.NOT_FOUND);
        }
        //Buscamos la copy según el userId proporcionado
        const copyFound = await this.copiesRepository.findOne({ where: { id: copyId } });
        //Si no se encuentra lanzamos un error
        if (!copyFound) {
          throw new HttpException('Copy No Encontrada', HttpStatus.NOT_FOUND);
        }
        //Si no se encuentra disponible lanzamos un error
        if (!copyFound.available) {
          throw new HttpException('Lo siento, la copia no está disponible', HttpStatus.CONFLICT);
        }
    
        // Actualizamos la disponibilidad de la copy
        copyFound.available = false;
        await this.copiesRepository.save(copyFound);
    
        // Creamos la entidad
        const newLoan = new LoansEntity();
        newLoan.loan_return = new Date(loan_return); 
    
        //Se le asigna el user y la copy a la entiedad Loan
        newLoan.user = userFound;
        newLoan.copy = copyFound;
    
        return this.loansRepository.save(newLoan);
      }

    /**
     * Función que se encarga de eliminar un loan
     * @param {number} id - id del loan que se quiere eliminar  
     */  
    public async deleteLoan(id:number):Promise<void>{
      //Se busca el loan por el id
      const foundLoan = await this.loansRepository.findOne({where:{id}});

      //Si el loan no existe se lanza un error - NOT_FOUND
      if(!foundLoan){
        throw new HttpException('Loan No Encontrado', HttpStatus.NOT_FOUND)
      }
      //Se busca la copy según el copyId del loan encontrado
      const copy = await this.copiesRepository.findOne({where:{id:foundLoan.copyId}})
      //Si existe
      if(copy){
        //Se habilita la disponibilidad de la copy
        copy.available = true;
        //Se guarda los cambios
        await this.copiesRepository.save(copy);
      }
      //Se elimina el loan
      await this.loansRepository.remove(foundLoan)

    }

    /**
     * Función que se utiliza para actualizar un loan segpun el id
     * @param {number} id - Para actualizar el loan según el id
     * @param {UpdateLoanDTO} loan - con los atributos necesarios para la actualización
     * @returns {Promise<LoansEntity>} - loan actualizado
     */
    public async updateLoan(id:number, loan: UpdateLoanDTO):Promise<LoansEntity & UpdateLoanDTO>{
      //Se busca loan según el id
      const loanFound = await this.loansRepository.findOne({where:{id}});
      //Si loan no se encuentra se lanza un error - NOT_FOUND
      if(!loanFound){
        throw new HttpException('Loan No Existe', HttpStatus.NOT_FOUND);
      }
      //Se le asigna al loanFound los datos de loan
      const updateLoan = Object.assign(loanFound, loan);
      //Se guarda y se retorna el loan
      return this.loansRepository.save(updateLoan);

    }

}

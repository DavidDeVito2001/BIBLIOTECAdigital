import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from 'users/dto/create-user.dto';
import { UpdateUserDTO } from 'users/dto/update-user.dto';
import { UsersEntity } from 'users/entities/users.entity'; 

require('dotenv').config();

@Injectable()
export class UsersService {
    constructor(
        //importamos nuestras entidad UsersEntity y los convertimos en un repositorio de TypeORM
        @InjectRepository( UsersEntity ) private usersRepository: Repository<UsersEntity>
    ){}


    /**Función que se encarga de obtener todos los usuarios
     * @return {UsersEntity[]}
     * @param {any} params  usa por si se quiere ordenar de alguna forma sin afectar los datos de forma absoluta
    */
    public async getUsers(params:any):Promise<UsersEntity[]>{
      return await this.usersRepository.find();
    }

    /**Función para obtener un usuario específico 
     * @param {number} id 
     * @returns {UsersEntity} - retorna un usuario según el id
    */
    public async getUser(id:number):Promise<UsersEntity>{
      //Se buscar el user según el id
      const userFound = await this.usersRepository.findOne({
        where:{
          id
        }
      });

      //Si el user no es encontrado: NOT_FOUND
      if(!userFound){
        throw new HttpException('User No Existe', HttpStatus.NOT_FOUND);
      }
      //Sino: se devuelve el user encontrado
      return userFound;

    }

    /**Función que se encarga de cargar el usuario a la base de datos
    * @param {CreateUserDTO} user*/
    public async registerUser(user:CreateUserDTO):Promise<UsersEntity>{

        /**@Type {boolean} Si username se encuentra en la bd  */
        const userFound = await this.usersRepository.findOne({
            where: {
              username: user.username,
            },
          });
          
          //Si userFound: Usuario ya existe
          if (userFound) {
            throw new HttpException('User Ya Existe', HttpStatus.CONFLICT);
        }
          //Sino: se guarda el user en la bd
          return await this.usersRepository.save(user);
    }

    /**Función que se encarga de eliminar a un usuario según su id 
     * @param {number} id - Con el que se busca el user
    */
    public async deleteUser(id:number){
      const eliminado = await this.usersRepository.delete(id);
      
      if(eliminado.affected === 0){
        throw new HttpException('User No Encontrado', HttpStatus.NOT_FOUND)
      }

      return eliminado;
    }

    /**Función que se encarga de actualizar los usuarios según el id 
     * @param {number} id - Utilizado para encontrar el usuario
     * @param {UpdateUserDTO} user - class que tiene los atributos necesarios
     * @returns {Promise<UsersEntity>}
    */
    public async updateUser(id:number, user:UpdateUserDTO):Promise<UsersEntity>{
      //Se busca el user según el id
      const userFound = await this.usersRepository.findOne({
        where:{
          id
        }
      });

      //Si user no es encontrado se devuelve un msm de error
      if(!userFound){
        throw new HttpException('User No Encontrado', HttpStatus.NOT_FOUND)
      }

      //Se le asigna los datos del user al userFound
      const userUpdate = Object.assign(userFound, user);
      //Se retorna el user actualizado
      return await this.usersRepository.save(userUpdate);
    }

}







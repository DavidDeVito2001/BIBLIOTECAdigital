import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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
    
    //Funciones del CRUD

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
        },
        relations:['profile', 'loans']
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
        //Se hashea el password
        user.password = await bcrypt.hash(user.password, 10);
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
    public async deleteUser(id: number): Promise<void> {
      try{
        // Busca el usuario por ID
      const userFound = await this.usersRepository.findOne({
        where: { id },
        relations: ['profile'],
    });

    // Si el usuario no se encuentra, lanza un error
    if (!userFound) {
        throw new HttpException('User No Encontrado', HttpStatus.NOT_FOUND);
    }

    // Elimina el usuario, el perfil asociado se elimina automáticamente por CASCADE
    await this.usersRepository.remove(userFound);
      }catch (error) {
        // captamos el error y si el elemento no se puede eliminar por tener datos asociados se advierte
        if(error.code==='ER_ROW_IS_REFERENCED_2'){
          console.error('No se puede eliminar el usuario porque tiene prestamos asociados!')
        }else{
          console.error('Error al eliminar la copia:', error.message)
        }
        
      }
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
      //Por si actualiza el password hacemos que se hashee
      userUpdate.password = await bcrypt.hash(user.password, 10);
      //Se retorna el user actualizado
      return await this.usersRepository.save(userUpdate);
    }

    //Funciones para la autenticación

    /**
     * Función que se utiliza para traer los valos de las propiedades: email o username, y password, con ayuda del objeto clave valor
     * @param {object} keyValue - Se manda un objeto con dos propiedades de clave - valor
     * @returns {Promise<UsersEntity|undefined>}
     */
    public async findBy({key, value}:{key:string, value:any}):Promise<UsersEntity|undefined>{

      const user: UsersEntity = await this.usersRepository
      .createQueryBuilder('user') //Se inicia la construcción de una consulta para la UsersEntity(user)
      .addSelect('user.password') 
      .where({[key]:value})// Se utliza el la condición 'where', permite usar el valor de key como propiedad
      .getOne();//Se ejecuta la consulta construida

      return user; //Si esta todo bien se devuelve el user
    }


}







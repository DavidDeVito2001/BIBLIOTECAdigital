import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from 'users/dto/create-user.dto';
import { UsersEntity } from 'users/entities/users.entity'; 

require('dotenv').config();

@Injectable()
export class UsersService {
    constructor(
        //importamos nuestras entidad UsersEntity y los convertimos en un repositorio de TypeORM
        @InjectRepository( UsersEntity ) private usersRepository: Repository<UsersEntity>
    ){}

    public async registerUser(user:CreateUserDTO):Promise<UsersEntity>{
        const userFound = await this.usersRepository.findOne({
            where: {
              username: user.username,
            },
          });
      
          if (userFound) {
            throw new HttpException('User Ya Existe', HttpStatus.CONFLICT);
        }
      
          return await this.usersRepository.save(user);
    }
}







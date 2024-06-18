import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { CreateUserDTO } from '../../users/dto/create-user.dto';
import { UsersEntity } from '../../users/entities/users.entity';
import { UsersService } from '../../users/services/users.service';
import { Request } from 'express';
import { UpdateUserDTO } from 'users/dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}
    
    //Maneja la solicitud get para obtener todos los usuarios
    @Get()
    getUsers(@Req() request: Request){
      return this.usersService.getUsers(request.query);
    }

    //Maneja la solicitud get para obtener un usuario según el id
    @Get(':id')
    getUser(@Param('id', ParseIntPipe) id: number){
      return this.usersService.getUser(id); 
    }

    //Maneja solicitud post para registrar un nuevo usuario
    @Post()
    registerUser(@Body() newUser: CreateUserDTO): Promise<UsersEntity> {     
        return this.usersService.registerUser(newUser);
    }

    //Maneja la solicitud delete para eliminar un usuario según el id
    @Delete(':id')
    deleteUser(@Param('id',ParseIntPipe) id:number){
      return this.usersService.deleteUser(id);
    }

    //Maneja la solicitud patch para poder actualizar el usuario según el id
    @Patch(':id')
    updateUser(
      @Param('id', ParseIntPipe) id:number,
      @Body() user: UpdateUserDTO
    ){
    return this.usersService.updateUser(id, user);
    }


}

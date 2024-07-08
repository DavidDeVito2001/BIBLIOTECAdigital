import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from '../../users/dto/create-user.dto';
import { UsersEntity } from '../../users/entities/users.entity';
import { UsersService } from '../../users/services/users.service';
import { Request } from 'express';
import { UpdateUserDTO } from '../../users/dto/update-user.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { PublicAccess } from '../../auth/decorators/public.decorator';
import { AdminAccess } from '../../auth/decorators/admin.decorator';
import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

//Tag para swagger
@ApiTags('Users')
@Controller('users')//ruta
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService){}
    
    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
      name: 'biblioteca_token',
      description: 'Token de autenticación para la biblioteca',
      required: true
    })
    @ApiOperation({
      summary: 'Obtener lista de users',
      description: 'Este endpoint solo puede ser accedido por administradores.',
    })
    @ApiResponse({
      status: 200,
      description: 'Listas users encontrado y obtenido exitosamente',
    })
    @ApiResponse({
      status: 401,
      description: 'No tenes permisos para esta operación',
    })
    //ruta solo Admins
    @AdminAccess()
    //Maneja la solicitud get para obtener todos los usuarios
    @Get()
    getUsers(@Req() request: Request){
      return this.usersService.getUsers(request.query);
    }
    
    //indico parametros para swagger
    @ApiParam({
      name: 'id',
      description: 'ID del user'
    })
    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
      name: 'biblioteca_token',
      description: 'Token de autenticación para la biblioteca',
      required: true
    })
    @ApiOperation({
      summary: 'Obtener user por ID',
      description: 'Este endpoint solo puede ser accedido por administradores.',
    })
    @ApiResponse({
      status: 200,
      description: 'User encontrado y obtenido exitosamente',
    })
    @ApiResponse({
      status: 404,
      description: 'User no encontrado',
    })
    @ApiResponse({
      status: 401,
      description: 'No tenes permisos para esta operación',
    })
    //ruta solo Admins
    @AdminAccess()
    //Maneja la solicitud get para obtener un usuario según el id
    @Get(':id')
    getUser(@Param('id', ParseIntPipe) id: number){
      return this.usersService.getUser(id); 
    }

    @ApiOperation({
      summary: 'Registrar user',
      description: 'Este endpoint es público.',
    })
    //Maneja solicitud post para registrar un nuevo usuario
    @PublicAccess()
    @Post()
    registerUser(@Body() newUser: CreateUserDTO): Promise<UsersEntity> {     
        return this.usersService.registerUser(newUser);
    }

    
    //indico parametros para swagger
    @ApiParam({
      name: 'id',
      description: 'ID del user'
    })
    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
      name: 'biblioteca_token',
      description: 'Token de autenticación para la biblioteca',
      required: true
    })
    @ApiOperation({
      summary: 'Eliminar user por ID',
      description: 'Este endpoint solo puede ser accedido por administradores.',
    })
    @ApiResponse({
      status: 200,
      description: 'User encontrado y eliminado exitosamente',
    })
    @ApiResponse({
      status: 404,
      description: 'User no encontrado',
    })
    @ApiResponse({
      status: 401,
      description: 'No tenes permisos para esta operación',
    })
    //ruta solo Admins
    @AdminAccess()
    //Maneja la solicitud delete para eliminar un usuario según el id
    @Delete(':id')
    deleteUser(@Param('id',ParseIntPipe) id:number){
      return this.usersService.deleteUser(id);
    }

    //indico parametros para swagger
    @ApiParam({
      name: 'id',
      description: 'ID del user'
    })
    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
      name: 'biblioteca_token',
      description: 'Token de autenticación para la biblioteca',
      required: true
    })
    @ApiOperation({
      summary: 'Obtener user por ID para actualizar sus datos',
      description: 'Este endpoint solo puede ser accedido por administradores.',
    })
    @ApiResponse({
      status: 200,
      description: 'User encontrado y devuelto exitosamente',
    })
    @ApiResponse({
      status: 404,
      description: 'User no encontrado',
    })
    @ApiResponse({
      status: 401,
      description: 'No tenes permisos para esta operación',
    })
    //ruta solo Admins
    @AdminAccess()
    //Maneja la solicitud patch para poder actualizar el usuario según el id
    @Patch(':id')
    updateUser(
      @Param('id', ParseIntPipe) id:number,
      @Body() user: UpdateUserDTO
    ){
    return this.usersService.updateUser(id, user);
    }


}

import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateProfileDTO } from '../../profiles/dto/create-profile.dto';
import { ProfilesService } from '../../profiles/services/profiles.service';
import { UpdateProfileDTO } from '../../profiles/dto/update-profile.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';


//Tag para swagger
@ApiTags('Profile_users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class ProfilesController {
    constructor(
        private profilesService: ProfilesService,
    ){}

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
        summary: 'Crear profile según el ID del user.',
        description: 'Este endpoint solo puede ser accedido por users básicos y administradores.',
      })
    @ApiResponse({
        status: 200,
        description: 'User y profile encontrados. Profile creado exitosamente.',
      })
    @ApiResponse({
        status: 404,
        description: 'User no encontrado.',
      })
    @ApiResponse({
        status: 409,
        description: 'Ya existe un profile para este user.',
      })
    @ApiResponse({
        status: 401,
        description: 'No tenes permisos para esta operación.',
      })
    //ruta para basics y admins
    @Roles('BASIC')
    //Maneja solicitud POST para crear un perfil para un usuario específico.
    @Post('/profiles/:id')
    async createProfile(
        @Param('id', ParseIntPipe) id: number,
        @Body() profile: CreateProfileDTO
    ){
        return await this.profilesService.createProfile(id, profile);
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
        summary: 'Obtener profile según el ID del user para actualizar los datos de su profile',
        description: 'Este endpoint solo puede ser accedido por users básicos y administradores.',
      })
    @ApiResponse({
        status: 200,
        description: 'User y profile encontrados. Profile actualizado exitosamente.',
      })
    @ApiResponse({
        status: 404,
        description: 'User no encontrado.'
      })
    @ApiResponse({
        status: 400, //No me deja repetir status sino seria 404
        description: 'Profile no encotrado para este usuario.(404)',
      })
    @ApiResponse({
        status: 401,
        description: 'No tenes permisos para esta operación.',
      })
    //ruta para basics y admins
     @Roles('BASIC')
    //Maneja solicitud Patch para actualizar el perfil, se actualiza según el id del usuario
    @Patch('/profiles/:id')
    async updateProfileByUserId(
        @Param('id',ParseIntPipe) idUser:number,
        @Body()profile: UpdateProfileDTO
    ){
        return this.profilesService.updateProfileByUserId(idUser, profile);
    }
}

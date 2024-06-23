import { Body, Controller, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateProfileDTO } from '../../profiles/dto/create-profile.dto';
import { ProfilesService } from '../../profiles/services/profiles.service';
import { UpdateProfileDTO } from '../../profiles/dto/update-profile.dto';
import { Roles } from 'auth/decorators/roles.decorator';
import { AuthGuard } from 'auth/guards/auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class ProfilesController {
    constructor(
        private profilesService: ProfilesService,
    ){}
    //ruta para basics y admins
    @Roles('BASIC')
    //Maneja solicitud POST para crear un perfil para un usuario específico.
    @Post(':id/profiles')
    async createProfile(
        @Param('id', ParseIntPipe) id: number,
        @Body() profile: CreateProfileDTO
    ){
        return await this.profilesService.createProfile(id, profile);
    }

    //ruta para basics y admins
     @Roles('BASIC')
    //Maneja solicitud Patch para actualizar el perfil, se actualiza según el id del usuario
    @Patch(':id/profiles')
    async updateProfileByUserId(
        @Param('id',ParseIntPipe) idUser:number,
        @Body()profile: UpdateProfileDTO
    ){
        return this.profilesService.updateProfileByUserId(idUser, profile);
    }
}

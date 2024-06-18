import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateProfileDTO } from '../../profiles/dto/create-profile.dto';
import { ProfilesService } from '../../profiles/services/profiles.service';

@Controller('users')
export class ProfilesController {
    constructor(
        private profilesService: ProfilesService,
    ){}

    /**
     * Maneja solicitud POST para crear un perfil para un usuario específico.
     * @param {number} id - El ID del usuario.
     * @param {CreateProfileDTO} profile - Los datos del perfil a crear.
     */
    @Post(':id/profiles')
    async createProfile(
        @Param('id', ParseIntPipe) id: number,
        @Body() profile: CreateProfileDTO
    ){
        // Llama al servicio para registrar el perfil del usuario
        return await this.profilesService.createProfile(id, profile);
    }
}

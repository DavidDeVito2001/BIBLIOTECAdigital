import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../entities/profiles.entity';
import { CreateProfileDTO } from '../dto/create-profile.dto';
import { UsersEntity } from '../../users/entities/users.entity';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
        @InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>
    ) {}

    /**
     * Función que se encarga de cargar el usuario a la base de datos.
     * @param {number} id - El ID del usuario.
     * @param {CreateProfileDTO} profile - El perfil del usuario a crear.
     * @returns {Promise<UsersEntity>} - La entidad del usuario actualizada.
     * @throws {HttpException} - Lanza una excepción si el usuario no existe o ya tiene un perfil.
     */
    public async createProfile(id: number, profile: CreateProfileDTO): Promise<UsersEntity> {
        // Busca el usuario en la base de datos
        const userFound = await this.usersRepository.findOne({
            where: { id },
        });
        
        // Si el usuario no es encontrado, lanza una excepción con el estado NOT_FOUND
        if (!userFound) {
            throw new HttpException('User No Existe', HttpStatus.NOT_FOUND);
        }

        // Si el usuario es encontrado pero ya tiene un profileId, lanza una excepción con el estado CONFLICT
        if (userFound.profileId) {
            throw new HttpException('Profile ya existe', HttpStatus.CONFLICT);
        }

        // Crea un nuevo perfil utilizando los datos proporcionados
        const newProfile = this.profileRepository.create(profile);
        // Guarda el nuevo perfil en el repositorio
        const savedProfile = await this.profileRepository.save(newProfile);
        
        // Asocia el perfil guardado al usuario encontrado
        userFound.profile = savedProfile;

        // Guarda y retorna la entidad del usuario actualizada
        return this.usersRepository.save(userFound);
    }
}

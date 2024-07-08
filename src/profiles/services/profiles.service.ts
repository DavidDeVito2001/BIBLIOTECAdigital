import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../entities/profiles.entity';
import { CreateProfileDTO } from '../dto/create-profile.dto';
import { UsersEntity } from '../../users/entities/users.entity';
import { UpdateProfileDTO } from '../../profiles/dto/update-profile.dto';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
        @InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>
    ) {}

    /**
     * Función que se encarga de cargar el profile a la base de datos y asociarlo con un user.
     * @param {number} id - El ID del usuario.
     * @param {CreateProfileDTO} profile - El perfil del usuario a crear.
     * @returns {Promise<UsersEntity>} - La entidad del usuario actualizada.
     */
    public async createProfile(id: number, profile: CreateProfileDTO): Promise<UsersEntity> {
        // Busca el usuario en la base de datos
        const userFound = await this.usersRepository.findOne({
            where: { id },
        });
        
        // Si el usuario no es encontrado, lanza una excepción con el estado NOT_FOUND
        if (!userFound) {
            throw new HttpException('User No Encontrado', HttpStatus.NOT_FOUND);
        }

        // Si el usuario es encontrado pero ya tiene un profileId, lanza una excepción con el estado CONFLICT
        if (userFound.profileId) {
            throw new HttpException('Profile ya existe', HttpStatus.CONFLICT);
        }
        
        
        // Crea un nuevo perfil utilizando los datos proporcionados
        const newProfile = this.profileRepository.create(profile);
        //el id entrado por parametro es el nuevo userId
        newProfile.userId = id
        // Guarda el nuevo perfil en el repositorio
        const savedProfile = await this.profileRepository.save(newProfile);
        
        // Asocia el perfil guardado al usuario encontrado
        userFound.profile = savedProfile;

        // Guarda y retorna la entidad del usuario actualizada
        return this.usersRepository.save(userFound);
    }


    /**
     * Función que se encarga de actualizar el perfil según el id del usuario
     * @param id - El id del usuario asociado al perfil
     * @param profile - El perfil del profile a actualizar
     * @returns {Promise<ProfileEntity>}
     */
    public async updateProfileByUserId(userId: number, profile: UpdateProfileDTO): Promise<ProfileEntity> {
        // Se busca el usuario según el id
        const userFound = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['profile'], // Asegura que el perfil relacionado se cargue
        });

        // Si el usuario no se encuentra se retorna un error
        if (!userFound) {
            throw new HttpException('User No Encontrado', HttpStatus.NOT_FOUND);
        }

        // Si el usuario no tiene un perfil asociado se retorna un error
        if (!userFound.profile) {
            throw new HttpException('Profile No Encotrado para este usuario', HttpStatus.NOT_FOUND);
        }

        // Sino: se le asigna los valores del profile actualizado al perfil encontrado
        const profileUpdate = Object.assign(userFound.profile, profile);

        // Se retorna el profile actualizado y se guarda
        return await this.profileRepository.save(profileUpdate);
    }
}

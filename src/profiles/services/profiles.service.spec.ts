import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfilesService } from './profiles.service';
import { ProfileEntity } from '../entities/profiles.entity';
import { UsersEntity } from '../../users/entities/users.entity';
import { CreateProfileDTO } from '../dto/create-profile.dto';
import { UpdateProfileDTO } from '../dto/update-profile.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let profileRepository: Repository<ProfileEntity>;
  let usersRepository: Repository<UsersEntity>;

  //Se simula el ProfileRepository
  const mockProfileRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  //Se simula el UsersRepository
  const mockUsersRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: getRepositoryToken(ProfileEntity),
          useValue: mockProfileRepository,
        },
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    profileRepository = module.get<Repository<ProfileEntity>>(getRepositoryToken(ProfileEntity));
    usersRepository = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProfile', () => {
    it('Debería crear un profile y asociarlo con un user', async () => {
      const id = 1;
      //Se crea los datos del profile
      const profileDto: CreateProfileDTO = {
        firstName: 'Pedro',
        lastName: 'Garcia',
        age: 22,
        tel: '011 57428965',
        adrress: 'Av. Lacrozze 848',
      };
      //Se crea un user con los datos necesarios que utiliza la usersEntity
      const user = {
        id,
        profileId: null,
        profile: null,
      } as UsersEntity;

      //Se crea un profile con los datos necesarios que utiliza el profileEntity
      const newProfile = {
        ...profileDto,
        userId: id,
      } as ProfileEntity;

      //Se simula la búsqueda del user
      mockUsersRepository.findOne.mockResolvedValue(user);
      //Se simula la creación del newProfile
      mockProfileRepository.create.mockReturnValue(newProfile);
      //Se simula el guardado del newProfile
      mockProfileRepository.save.mockResolvedValue(newProfile);
      //Se simula el guardado del user con el nuevo profile
      mockUsersRepository.save.mockResolvedValue({ ...user, profile: newProfile });

      //El resultado que se espera del createProfile
      const result = await service.createProfile(id, profileDto);

      //Lo que se espera del usersRepository con la función findone según el id
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      //Lo que se espera de la creación del nuevo profile
      expect(profileRepository.create).toHaveBeenCalledWith(profileDto);
      //Lo que se espera del guardado del nuevo profile
      expect(profileRepository.save).toHaveBeenCalledWith(newProfile);
      //Lo que se espera del guardado del user con el profile asociado
      expect(usersRepository.save).toHaveBeenCalledWith({ ...user, profile: newProfile });
      //El resultado esperado tiene que ser equivalente a:
      expect(result).toEqual({ ...user, profile: newProfile });
    });

    it('Debería lanzar un error sin el user no es encontrado', async () => {
      const id = 1;
      //Se crea el profile
      const profileDto: CreateProfileDTO = {
        firstName: 'Pedro',
        lastName: 'Garcia',
        age: 22,
        tel: '011 57428965',
        adrress: 'Av. Lacrozze 848',
      };
      //Se imita la búsqueda con un valor null, simulando que no se encontro
      mockUsersRepository.findOne.mockResolvedValue(null);
      //Se espera la creación del profile con el rechazo de búsqueda y se lanza el error de user no encontrado
      await expect(service.createProfile(id, profileDto)).rejects.toThrow(
        new HttpException('User No Encontrado', HttpStatus.NOT_FOUND),
      );
    });

    it('Debería lanzar un error si el user ya tiene un profile asociado', async () => {
      const id = 1;
      //Se crea el profile
      const profileDto: CreateProfileDTO = {
        firstName: 'Pedro',
        lastName: 'Garcia',
        age: 22,
        tel: '011 57428965',
        adrress: 'Av. Lacrozze 848',
      };
      //Se crea un user con los datos que son necesarios por el UsersEntity
      const user = {
        id,
        profileId: 1,
      } as UsersEntity;
      ///Se simula la búsqueda, la cúal encuentra el valor del user
      mockUsersRepository.findOne.mockResolvedValue(user);
      //Se espera la creación del profile con el rechazo mediante un lanzamiento del error 'profile ya existe'
      await expect(service.createProfile(id, profileDto)).rejects.toThrow(
        new HttpException('Profile ya existe', HttpStatus.CONFLICT),
      );
    });
  });

  describe('updateProfileByUserId', () => {
    it('Debería actualizar un profile según el userId', async () => {
      const userId = 1;
      //Se crea el profile
      const profileDto: UpdateProfileDTO = {
        firstName: 'Pedro',
        lastName: 'Garcia',
        age: 22,
        tel: '011 57428965',
        adrress: 'Av. Lacrozze 848',
      };
      //Se crea el user con los datos del profile asociados
      const user = {
        id: userId,
        profile: {
          id: 1,
          firstName: 'Pedro Roman',
          lastName: 'Garcia',
          age: 23,
          tel: '011 57448965',
          adrress: 'Av. Lacarra 41',
        },
      } as UsersEntity;

      //Se simula búsqueda, que encuentra el valor del user
      mockUsersRepository.findOne.mockResolvedValue(user);
      //Se simula el guardado del user con los datos del profile actualizados
      mockProfileRepository.save.mockResolvedValue({
        ...user.profile,
        ...profileDto,
      });

      //Lo que se espera que haga la función si le pasamos los parametros del userId y el profileDto
      const result = await service.updateProfileByUserId(userId, profileDto);
      //lo que se espera de la búsqueda por el userId
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['profile'],
      });
      //Lo que se espera del guardado de la actualziación del profile
      expect(profileRepository.save).toHaveBeenCalledWith({ ...user.profile, ...profileDto });
      //El resultado esperado tiene que ser equivalente a:
      expect(result).toEqual({ ...user.profile, ...profileDto });
    });

    it('Debería lanzar un error si el user no es encotnrado', async () => {
      const userId = 1;
      //Se crea el profile
      const profileDto: UpdateProfileDTO = {
        firstName: 'Pedro',
        lastName: 'Garcia',
        age: 22,
        tel: '011 57428965',
        adrress: 'Av. Lacrozze 848',
      };
      //Se simula la búsqueda de un user no encontrado
      mockUsersRepository.findOne.mockResolvedValue(null);

      //Lo que se espera por el rechazo del la promesa y el lanzamiento del error 'User No encontrado'
      await expect(service.updateProfileByUserId(userId, profileDto)).rejects.toThrow(
        new HttpException('User No Encontrado', HttpStatus.NOT_FOUND),
      );
    });

    it('Debería lanzar un error si el user no tiene un profile asociado', async () => {
      const userId = 1;
      //La creación del profile
      const profileDto: UpdateProfileDTO = {
        firstName: 'Pedro',
        lastName: 'Garcia',
        age: 22,
        tel: '011 57428965',
        adrress: 'Av. Lacrozze 848',
      };
      //La creación del user con el profile: null
      const user = {
        id: userId,
        profile: null,
      } as UsersEntity;
      //Simulación de búsqueda de user
      mockUsersRepository.findOne.mockResolvedValue(user);
      //Lo que se espera de la actualización si es rechazado y el lanzamiento del 'Profile No Encotrado para este usuario'
      await expect(service.updateProfileByUserId(userId, profileDto)).rejects.toThrow(
        new HttpException('Profile No Encotrado para este usuario', HttpStatus.NOT_FOUND),
      );
    });
  });
});

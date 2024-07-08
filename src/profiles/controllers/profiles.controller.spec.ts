import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from '../../profiles/services/profiles.service';
import { CreateProfileDTO } from '../../profiles/dto/create-profile.dto';
import { UpdateProfileDTO } from '../../profiles/dto/update-profile.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let profilesService: ProfilesService;

  //Simulamos el ProfilesService 
  const mockProfilesService = {
    createProfile: jest.fn(),
    updateProfileByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        {
          provide: ProfilesService,
          useValue: mockProfilesService,
        },
      ],
    })
    .overrideGuard(AuthGuard) //Anulamos el AuthGuard y lo reemplazamos por true
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(RolesGuard) //Anulamos el RolesGuard y lo reemplazamos por true
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<ProfilesController>(ProfilesController);
    profilesService = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //'it' define una prueba individual, obtiene la descripción y una función async que determina la lógica de la prueba
  describe('createProfile', () => {
    it('Deberia crear un profile según el userId y retornar eso', async () => {
      const userId = 1;
      const profileDTO: CreateProfileDTO = {
        firstName: 'Ezequiel',
        lastName: 'Gonzales',
        age: 20,
        tel: '0 11 2890 0020',
        adrress: 'Santiago de liniers 255',
      };
      const createdProfile = { id: 1, ...profileDTO };

      //Nos simula el valor resuelto de un profile creado
      mockProfilesService.createProfile.mockResolvedValue(createdProfile);

      //Resultado esperado 
      const result = await controller.createProfile(userId, profileDTO);

      //Se espera que el resultado sea equivalente a:
      expect(result).toEqual(createdProfile);
      expect(profilesService.createProfile).toHaveBeenCalledWith(userId, profileDTO);
    });

    //'it' define una prueba individual, obtiene la descripción y una función async que determina la lógica de la prueba
    it('Debería lanzar un error si el user no es encontrado', async () => {
      const userId = 1;
      const profileDTO: CreateProfileDTO = {
        firstName: 'Ezequiel',
        lastName: 'Gonzales',
        age: 20,
        tel: '0 11 2890 0020',
        adrress: 'Santiago de liniers 255',
      };
      //Una función dulce que lanza una simulación de eror si al user no es encontrado
      mockProfilesService.createProfile.mockRejectedValue(
        new HttpException('User no encontrado', HttpStatus.NOT_FOUND),
      );
      //Se espera que el controller.createProfile lanze un error de user no encontrado
      await expect(controller.createProfile(userId, profileDTO)).rejects.toThrow(
        new HttpException('User no encontrado', HttpStatus.NOT_FOUND),
      );
    });
  });

  //'it' define una prueba individual, obtiene la descripción y una función async que determina la lógica de la prueba
  describe('updateProfileByUserId', () => {
    it('Debería actualizar un user y retornarlo', async () => {
      const userId = 1;
      const profileDTO: UpdateProfileDTO = {
        firstName: 'Ezequiel',
        lastName: 'Gonzales Martinez',
        age: 21,
        tel: '0 11 3040 1020',
        adrress: 'catamarca 11'
      };
      const updatedProfile = { id: 1, ...profileDTO };
      //Se imita la actualización de un user
      mockProfilesService.updateProfileByUserId.mockResolvedValue(updatedProfile);

      //El resultado que se espera de updateProfileByUserId
      const result = await controller.updateProfileByUserId(userId, profileDTO);

      //El resultado esperado es igual a:
      expect(result).toEqual(updatedProfile);
      expect(profilesService.updateProfileByUserId).toHaveBeenCalledWith(userId, profileDTO);
    });

    //'it' define una prueba individual, obtiene la descripción y una función async que determina la lógica de la prueba
    it('Debería lanzar un error si el profile no es encontrado', async () => {
      const userId = 1;
      const profileDTO: UpdateProfileDTO = {
        firstName: 'Ezequiel',
        lastName: 'Gonzales Martinez',
        age: 21,
        tel: '0 11 3040 1020',
        adrress: 'catamarca 11',
      };

      //Se imita la situación en la cual el profile no es encontrado para su actualización
      mockProfilesService.updateProfileByUserId.mockRejectedValue(
        new HttpException('Profile no encontrado', HttpStatus.NOT_FOUND),
      );

      await expect(controller.updateProfileByUserId(userId, profileDTO)).rejects.toThrow(
        new HttpException('Profile no encontrado', HttpStatus.NOT_FOUND),
      );
    });
  });
});

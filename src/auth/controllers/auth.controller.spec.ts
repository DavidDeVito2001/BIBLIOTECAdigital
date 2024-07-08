import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../../auth/services/auth.service';
import { AuthDTO } from '../../auth/dto/auth.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsersEntity } from '../../users/entities/users.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validaterUser: jest.fn(),
            generateJWT: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('Debería autenticar al usuario y devolver un JWT', async () => {
      //Se crea el dto
      const authDto: AuthDTO = { username: 'Eze', password: 'eze123' };
      //Se crea el user
      const user = { id: 1, username: 'Eze' } as UsersEntity;
      //Se crea la simulación del jwt
      const jwt = {accessToken:'mockJwtToken', user};

      //Se espía la función de validateUser y se simula el valor del user
      jest.spyOn(authService, 'validaterUser').mockResolvedValue(user);
      //Se espía la función generateJWT y se simula el valor jwt
      jest.spyOn(authService, 'generateJWT').mockResolvedValue(jwt);

      //Se guarda el resultado del authContorller. AccessToken y el user
      const result = await authController.login(authDto);
      
      //Se espera que result sea igual al jwt
      expect(result).toBe(jwt);
      //Se espera que authService.validaterUser sea llamado con username y el pass
      expect(authService.validaterUser).toHaveBeenCalledWith('Eze', 'eze123');
      //Se espera que authService.generateJWT se llamado con el user
      expect(authService.generateJWT).toHaveBeenCalledWith(user);
    });

    it('Debería lanzar una excepción si los datos no son válidos', async () => {
      const authDto: AuthDTO = { username: 'eze', password: 'eze12' };

      //Se espía la función validateUser y se le simula el valor null
      jest.spyOn(authService, 'validaterUser').mockResolvedValue(null);

      //Se espera que (authController.login(authDto) rechaze la promise y lanze una exepción, un msm y el status
      await expect(authController.login(authDto)).rejects.toThrow(HttpException);
      await expect(authController.login(authDto)).rejects.toThrow('Data No Valida');
      await expect(authController.login(authDto)).rejects.toHaveProperty('status', HttpStatus.CONFLICT);
    });
  });
});

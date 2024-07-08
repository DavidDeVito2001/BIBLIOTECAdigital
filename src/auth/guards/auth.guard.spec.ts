import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { UsersService } from '../../users/services/users.service';
import { useToken } from '../../../utils/use.token';
import { PUBLIC_KEY } from '../../constants/key-decorators';
import { ROLES } from '../../constants/roles';
import { UsersEntity } from 'users/entities/users.entity';

jest.mock('../../../utils/use.token');

describe('AuthGuard', () => {
  //Se mockean los constructores y el authGuard
  let authGuard: AuthGuard;
  let usersService: UsersService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: UsersService,
          useValue: {
            //Se simula la siguiente función
            getUser: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            //Se simula la siguiente función
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    usersService = module.get<UsersService>(UsersService);
    reflector = module.get<Reflector>(Reflector);
  });

  //Se limian todas las llamadas a las funciones
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });
  
  describe('canActivate', () => {
    //Te da el contexto de la solicitud http, ruta, etc
    let context: ExecutionContext;

    beforeEach(() => {
      context = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              biblioteca_token: 'valid-token',
            },
          }),
        }),
        getHandler: jest.fn(),
      } as any;
    });

    it('Debería permitir el acceso, si la ruta es pública', async () => {
      //Se espía la función get y se simula el valor true
      jest.spyOn(reflector, 'get').mockReturnValue(true);
      const result = await authGuard.canActivate(context);

      //Se espera que result sea igual true
      expect(result).toBe(true);
    });

    it('Debería lanzar una exepción de  no autorización si falta el token', async () => {
      //Se castea el contentex.switchHttp() a jest.Mock para utilizar las funciones para hacer las simulaciones
      const requestMock = context.switchToHttp().getRequest as jest.Mock;
      //Se retorna el valor del header sin valores
      requestMock.mockReturnValueOnce({ headers: {} });
      //Se espía la función get y se simula el valor false
      jest.spyOn(reflector, 'get').mockReturnValue(false);
      //Se espera que authGuard.canActivate(context) rechaze la Promise y lanze una exepción de inautorización
      await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('Debería lanzar una exepción de no autorización si el token no es valido', async () => {
      //Se caste el useToken y se simula el retorno del valor token invalido
      (useToken as jest.Mock).mockReturnValue('Token invalido');
      //Se espía la función de get del reflector y se simula el retorno del valor false
      jest.spyOn(reflector, 'get').mockReturnValue(false);
      //Se espera que authGuard.canActivate(context) rechaze la Promise y lanze una exepción de no autorización
      await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('Debería lanzar una exepción de no autorización si el token esta expirado ', async () => {
      //Se castea el useToken y se simula el retorno del valor isExpired: true
      (useToken as jest.Mock).mockReturnValue({ isExpired: true });
      //Se espía la función get y se simule el retorno del valor false
      jest.spyOn(reflector, 'get').mockReturnValue(false);
      //Se espera que authGuard.canActivate(context) rechace la Promise y lanze una expeción de no autorización
      await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('Debería lanzar una exepción de no autorización sin el user no es encontrado', async () => {
      //Se castea el useToken y se simula el retorno del valor isExpired: false, sub: '1'
      (useToken as jest.Mock).mockReturnValue({ isExpired: false, sub: '1' });
      //Se espía la función getUser y se simula el valor null 
      jest.spyOn(usersService, 'getUser').mockResolvedValue(null);
      //Se espía la función get y se simula el retorno del valor false
      jest.spyOn(reflector, 'get').mockReturnValue(false);
      //Se espera que authGuard.canActivate(context) rechace la promise y lanze un exepción de no autirzación
      await expect(authGuard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('Debería permitir el acceso si el token es valido y si el user es encontrado', async () => {
      //Se castea el use toke a jest.Mocke y se retorna el valor de que el token no esta expirado
      (useToken as jest.Mock).mockReturnValue({ isExpired: false, sub: '1' });
      //Se espía la función getUser y se simula el valor de un user
      jest.spyOn(usersService, 'getUser').mockResolvedValue({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: ROLES.BASIC,
        profile: null,
      } as UsersEntity);
      //Se espía la función de get y se simula el retorno del valor false
      jest.spyOn(reflector, 'get').mockReturnValue(false);
      
      //Se obtiene el objeto de la soli http
      const req = context.switchToHttp().getRequest();
      const result = await authGuard.canActivate(context);

      //Se espera que result sea igual true
      expect(result).toBe(true);
      //Se espera que req.idUser sea igual a 1
      expect(req.idUser).toBe('1');
      //Se espera que req.roleUser sea igual a 'BASIC'
      expect(req.roleUser).toBe(ROLES.BASIC );
    });
  });
});

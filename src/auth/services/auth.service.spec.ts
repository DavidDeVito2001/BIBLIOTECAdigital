import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { UsersEntity } from '../../users/entities/users.entity';
import { PayLoadToken } from '../../interfaces/auth.interfaces';
import { ROLES } from '../../constants/roles';
//Simulamos las impotaciones de bcrypt y jsonwebtoken
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            //Simulamos las funciones:
            findBy: jest.fn(),
            getUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  //Esto limpia las llamadas de las funciones
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validaterUser', () => {
    it('Debería retornar el usuario si el username y password son correctos', async () => {
      //Se crea un user
      const user: UsersEntity = { id: 1, username: 'Eze', password: 'eze123hash' } as UsersEntity;
      (usersService.findBy as jest.Mock)
        .mockResolvedValueOnce(user) // Mock para findBy username
        .mockResolvedValueOnce(null); // Mock para findBy email
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      //Resultado del validaterUser
      const result = await authService.validaterUser('Eze', 'password');

      //Se espera que el resultado sea igual user
      expect(result).toBe(user);
      //Se espera que usersService.findBy sea llamado con:
      expect(usersService.findBy).toHaveBeenCalledWith({ key: 'username', value: 'Eze' });
      //Se espera que usersService.findBy sea llamado con:
      expect(usersService.findBy).toHaveBeenCalledWith({ key: 'email', value: 'Eze' });
      //Se espera que bcrypt.compare sea llamado con:
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'eze123hash');
    });

    it('Debería retornar nulo si el usuario no existe o la password es incorrecta', async () => {
      (usersService.findBy as jest.Mock)
        .mockResolvedValueOnce(null) // Mock para findBy username
        .mockResolvedValueOnce(null); // Mock para findBy email
      //Se simula la comparación de password y se simula el valor false
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
      const result = await authService.validaterUser('nonexistentuser', 'password');
      //Se espera que el resultado sea igual a null
      expect(result).toBeNull();
    });
  });

  describe('signJWT', () => {
    it('Debería firmar y retornar un token JWT', () => {
      //Se crea el payload del jwt
      const payload: PayLoadToken = { rol: ROLES.BASIC, sub: '1' };
      //Se simula la función sign y se simula el retorno del valor mockJwtToken
      (jwt.sign as jest.Mock).mockReturnValue('mockJwtToken');

      //Se crea el token
      const token = authService.signJWT(payload, 'secret', '1h');

      //Se espera que el token sea igual a:
      expect(token).toBe('mockJwtToken');
      //Se espera que jwt.sign sea llamado con payload, 'secret', { expiresIn: '1h' }
      expect(jwt.sign).toHaveBeenCalledWith(payload, 'secret', { expiresIn: '1h' });
    });
  });

  describe('generateJWT', () => {
    it('Debería generar y retornar un token JWT junto con el usuario', async () => {
      //Se crea el user
      const user: UsersEntity = { id: 1, username: 'eze',role: ROLES.BASIC } as UsersEntity;
      //Se obtiene el user
      const getUser = { ...user, role: ROLES.BASIC };
      //Se crea el payload
      const payload: PayLoadToken = { rol:  ROLES.BASIC, sub: '1' };
      //Se simula el usersService.getUser y se simula el valor getUser
      (usersService.getUser as jest.Mock).mockResolvedValue(getUser);
      //Se simula el valor de jwt.sign  y se simula el retorno de mockJwtToken
      (jwt.sign as jest.Mock).mockReturnValue('mockJwtToken');

      const result = await authService.generateJWT(user);

      //Se espera que el resultado sea igual a:
      expect(result).toEqual({ accessToken: 'mockJwtToken', user: getUser });
      expect(usersService.getUser).toHaveBeenCalledWith(1);
      expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    });
  });
});

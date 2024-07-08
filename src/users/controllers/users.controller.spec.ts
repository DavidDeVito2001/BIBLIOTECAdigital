import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../../users/services/users.service';
import { CreateUserDTO } from '../../users/dto/create-user.dto';
import { ROLES } from '../../constants/roles';
import { UpdateUserDTO } from '../../users/dto/update-user.dto';
import { UsersEntity } from '../../users/entities/users.entity';
import { query, Request } from 'express';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

describe('UsersController', () => {
  let controller: UsersController;

  //Creamos un mock para el UsersService
  const mockUsersService = {
    //Creamos una función que simula getUsers del controller
    //Retorna una promesa con una lista de users
    getUsers: jest.fn().mockImplementation((query: any) => {
      return Promise.resolve([
        {
          id: 1,
          username: 'Eze',
          email: 'Eze@gmail.com',
          password: 'Eze123',
          role: ROLES.BASIC,
        } as UsersEntity,
        {
          id: 2,
          username: 'Eze2',
          email: 'Eze2@gmail.com',
          password: 'Eze1234',
          role: ROLES.ADMIN,
        } as UsersEntity,
      ]);
    }),

    //Simulamos la función getUser el cual trae una user según el id
    getUser: jest.fn().mockImplementation((id: number) => {
      //Retorna una promesa con los datos del user como UsersEntity
      return Promise.resolve({
        id,
        username: 'Eze',
        email: 'Eze@gmail.com',
        password: 'Eze123',
        role: ROLES.BASIC,
      } as UsersEntity);
    }),

    //Simula la función registerUser, la cual le pasamos el dto con los datos que utilizaremos
    registerUser: jest.fn((dto: CreateUserDTO) => ({
      //Se le agrega un id con la fecha actual, simulando la bd
      id: Date.now(),
      ...dto,
    })),

    //Simula la función deleteUser, a la cual se la pasa un id, y nos devuelve deleted:true
    deleteUser: jest.fn().mockResolvedValue({ id: 1, deleted: true }),

    //Simula función updateUser, a la cúal se la pasa coomo parametros el id y el dto del user
    updateUser: jest
      .fn()
      .mockImplementation((id: number, dto: UpdateUserDTO) => ({
        id,
        ...dto,
      })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          //Provide typeof UsersService
          provide: UsersService,
          //Y en vez de UsersService se usa el valor mockeado que creamos para las pruebas
          useValue: mockUsersService,
        },
      ],
    })
    .overrideGuard(AuthGuard) //Anulamos el AuthGuard y lo reemplazamos por true
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(RolesGuard) //Anulamos el RolesGuard y lo reemplazamos por true
    .useValue({ canActivate: jest.fn(() => true) }).compile();
    //Se obtiene el controller
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //'it' define una prueba individual, obtiene la descripción y una función async que determina la lógica de la prueba
  it('Deberia obtener una lista de users', async () => {
    //variable para pasarle un parametro de ordenar por ej.
    const mockRequest = {
      query: {},
    } as Request;

    //varible con el resultado de controller.GetUsers
    const result = await controller.getUsers(mockRequest);

    //Se espera que el resultado se equivalente a:
    expect(result).toEqual([
      {
        id: 1,
        username: 'Eze',
        email: 'Eze@gmail.com',
        password: 'Eze123',
        role: ROLES.BASIC,
      },
      {
        id: 2,
        username: 'Eze2',
        email: 'Eze2@gmail.com',
        password: 'Eze1234',
        role: ROLES.ADMIN,
      },
    ]);
    //Se prueba el getUsers del mock que se pasa con el parametro definido al principio
    expect(mockUsersService.getUsers).toHaveBeenLastCalledWith(
      mockRequest.query,
    );
  });

  //'it' define una prueba individual, obtiene la descripción y una función async que determina la lógica de la prueba
  it('Deberia obtener un user', async () => {
    //Se crea el id
    const userId: number = 1;
    //Variable con el resultado esperado de el getUser
    const result = await controller.getUser(userId);

    //Se espera que el resultado sea equivalente a:
    expect(result).toEqual({
      id: userId,
      username: 'Eze',
      email: 'Eze@gmail.com',
      password: 'Eze123',
      role: ROLES.BASIC,
    });

    //Se prueba el getUser del mock con el id definido
    expect(mockUsersService.getUser).toHaveBeenCalledWith(userId);
  });

  //'it' define una prueba individual, obtiene la descripción y una función async que determina la lógica de la prueba
  it('Deberia crear un user', async () => {
    //Se crea la variable dto de tipo CreateUserDTO
    const dto: CreateUserDTO = {
      username: 'Eze',
      email: 'Eze@gmail.com',
      password: 'Eze123',
      rol: ROLES.BASIC,
    };
    //Variable con el resultado esperado de el registerUser
    const result = await controller.registerUser(dto);

    //Se teste el valor result, que sea equivalente: a id, ...dto
    expect(result).toEqual({
      id: expect.any(Number),
      ...dto,
    });
    //Se esta probando el registerUser del mock que se este llamando con el dto
    expect(mockUsersService.registerUser).toHaveBeenCalledWith(dto);
  });

  //'it' define una prueba individual, obtiene la descripción y una función async que determina la lógica de la prueba
  it('Debería eliminar un user', async () => {
    //Se crea userId
    const userId: number = 1;
    //variable con el resultado esperado de deleteUser
    const result = await controller.deleteUser(userId);

    //Se espera que le resultado sea equivalente a:
    expect(result).toEqual({ id: userId, deleted: true });

    //Se prueba el deleteUser del mock con el id como parametro
    expect(mockUsersService.deleteUser).toHaveBeenCalledWith(userId);
  });

  //'it' define una prueba individual, obtiene la descripción y una función async que determina la lógica de la prueba
  it('Debería actualizar los datos del user', () => {
    //Se crea id
    const id: number = 1;
    //Se crea dto con la estructura del UpdateUserDTO
    const dto: UpdateUserDTO = {
      username: 'Eze',
      email: 'Eze@gmail.com',
      password: 'Eze123',
      rol: ROLES.BASIC,
    };

    //Resultado esperado del updateUser
    const result = controller.updateUser(id, dto);
    //Se espera que el resultado sea equivalente a:
    expect(result).toEqual({
      id: 1,
      ...dto,
    });

    //Se prueba el updateUser del mock con el id y el dto
    expect(mockUsersService.updateUser).toHaveBeenCalledWith(id, dto);
  });
});

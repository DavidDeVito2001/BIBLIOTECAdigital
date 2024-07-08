import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersEntity } from '../../users/entities/users.entity';
import { ROLES } from '../../constants/roles';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<UsersEntity>;

  const mockQueryBuilder = {
    //Simulamos funciones que retornan una simulación
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),

    //Simulamos un función
    getOne: jest.fn(),
  };

  const mockUsersRepository = {
    //Se busca una lista con users para getUsers. 'mockResolvedValue' es la simulación de  una valor resuelto
    find: jest.fn().mockResolvedValue([
      {
        id: 1,
        username: 'User1',
        email: 'user1@example.com',
        password: 'password1',
        rol: 'BASIC',
      },
      {
        id: 2,
        username: 'User2',
        email: 'user2@example.com',
        password: 'password2',
        rol: 'ADMIN',
      }
    ]),

    // Simulamos el método findOne
    findOne: jest.fn(),

    //Guardar. Se pasa como parámetro el user y provee una Promesa con el id y los datos del user
    save: jest.fn().mockImplementation((user) => Promise.resolve({ id: 1, ...user })),

    //Simulamos el método remove
    remove: jest.fn(),

    //Simulamos el método y retornamos el valor de mockQueryBuiler
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<UsersEntity>>(getRepositoryToken(UsersEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //'it' define una prueba individual, obtiene la descripción y una función async que determina la lógica de la prueba
  it('Debería retornar una lista con todos los users', async () =>{
    //Variable con lista de users
    const users = [{
      id: 1,
      username: 'User1',
      email: 'user1@example.com',
      password: 'password1',
      rol: 'BASIC',
    },
    {
      id: 2,
      username: 'User2',
      email: 'user2@example.com',
      password: 'password2',
      rol: 'ADMIN',
    }];

    //Varaible con el resultado esperado del getUsers
    const result = await service.getUsers({});
    //Se espera que el resultado sea equivalente a la lista de users
    expect(result).toEqual(users);
    //Se espera que usersRepository busque los valores. Se lo llama una vez
    expect(usersRepository.find).toHaveBeenCalledTimes(1);

  });
  
  
  it('Debería retornar el usuario encontrado por id', async () => {
    const userId = 2;
    const user = {
      id: userId,
      username: 'User1',
      email: 'user1@example.com',
      profile: {},
      loans: [],
    } as UsersEntity;

    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);

    const result = await service.getUser(userId);
    expect(result).toEqual(user);
    expect(usersRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId }
    });
  });

   
  it('Debería lanzar una excepción si el usuario no es encontrado', async () => {
    const userId = 1;

    // Configuramos la implementación de la función simulada para esta prueba
    mockUsersRepository.findOne.mockResolvedValue(null);

    await expect(service.getUser(userId)).rejects.toThrow(
      new HttpException('User No Existe', HttpStatus.NOT_FOUND)
    );
    expect(usersRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId }
    });
  });
  
  
  it('Debería crear un nuevo user y retornarlo', async () => {
    //Se crea una variable con la estructura del CreateUserDTO
    const newUser = {
      username: 'Eze',
      email: 'Eze@gmail.com',
      password: 'Eze123',
      rol: ROLES.BASIC,
    };
    //Se hashea la contraseña
    newUser.password = await bcrypt.hash(newUser.password, 10);
    //Variable con el resultado esperado de registerUser
    const result = await service.registerUser(newUser);
    //Se espera que el resultado sea equivalente a:
    expect(result).toEqual({
      id: 1,
      username: 'Eze',
      email: 'Eze@gmail.com',
      password: expect.any(String), // No comparamos directamente con la contraseña ya que está hasheada
      rol: ROLES.BASIC,
    });
    //Se prueba el findOne que simula la búsqueda de user que no encuentra
    mockUsersRepository.findOne.mockResolvedValue(null);
    //Se prueba el método save del mock con los datos del newUser
    expect(mockUsersRepository.save).toHaveBeenCalledWith(newUser);
  });

  
  it('Debería eliminar un user según el id', async ()=>{
    //Variable con el id del user
    const userId: number = 1;
    //Creamos el user
    const user = {
      id: userId,
      username: 'Eze',
      email: 'eze@gmail.com',
      profile: null,
    };

    //implementamos la función simulada para esta prueba
    //Si llegara a encontrar tendria que ser de tipo user
    mockUsersRepository.findOne.mockResolvedValue(user);
    //Una vez remove el user pasaria a ser undefined
    mockUsersRepository.remove.mockResolvedValue(undefined);
    //Se utilza la función del usersService deleteUser y se la pasa el userId
    await service.deleteUser(userId);
    //Busca a un user según el userId y lo busca con la relación 'profile', ya que onDelete 'cascade'
    expect(usersRepository.findOne).toHaveBeenCalledWith({
      where:{id: userId}
    });
    
    expect(usersRepository.remove).toHaveBeenCalledWith(user);

  });

  
  it('Debería manejar los errores de eliminación por datos asociados', async ()=>{
    // Variable con el id del usuario
    const userId: number = 1;
    // Creamos el usuario
    const user = {
      id: userId,
      username: 'User1',
      email: 'user1@example.com',
      profile: {},
      loans: [],
    } as UsersEntity;

    // Configuramos la implementación de la función simulada para esta prueba
    jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);

    // Creamos la variable con el error
    const error = new Error('Some foreign key constraint error');
    (error as any).code = 'ER_ROW_IS_REFERENCED_2';
    jest.spyOn(usersRepository, 'remove').mockRejectedValue(error);

    await expect(service.deleteUser(userId)).rejects.toThrow(
      new HttpException('Error al eliminar el usuario', HttpStatus.BAD_REQUEST),
    );

    expect(usersRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId },
      relations: ['profile', 'loans'],
    });
    expect(usersRepository.remove).toHaveBeenCalledWith(user);
  });

  it('Debería actualizar y retornar el user', async () => {
    const userId = 1;
    //Datos de user para actualizar
    const userUpdateDTO = {
      username: 'UpdatedUser',
      email: 'updateduser@example.com',
      password: 'updatedPassword',
      rol: ROLES.BASIC,
    };
    //User encontrado
    const userFound = {
      id: userId,
      username: 'User1',
      email: 'user1@example.com',
      password: 'password1',
      rol: ROLES.BASIC,
    };
    //Se hashea la password
    const hashedPassword = await bcrypt.hash(userUpdateDTO.password, 10);

    // Configuramos la implementación de la función simulada para esta prueba
    mockUsersRepository.findOne.mockResolvedValueOnce(userFound);
    mockUsersRepository.save.mockResolvedValueOnce({ ...userFound, ...userUpdateDTO, password: hashedPassword });

    //Variable con el resultado esperado de updateUser
    const result = await service.updateUser(userId, userUpdateDTO);

    expect(usersRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId }
    });
  
    expect(result).toEqual({
      id: userId,
      ...userUpdateDTO,
      password: hashedPassword,
    });
  });

  it('Debería retornar un user con clave y valor', async () => {
    const key = 'email';
    const value = 'test@example.com';
    const user = {
      id: 1,
      username: 'User1',
      email: 'test@example.com',
      password: 'hashedpassword',
      rol: 'BASIC',
    };

    // Configura el mock del query builder para devolver el usuario
    mockQueryBuilder.getOne.mockResolvedValue(user);

    //Variable con el resultado esperado de findBy
    const result = await service.findBy({ key, value });

    expect(usersRepository.createQueryBuilder).toHaveBeenCalledWith('user');
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.password');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith({ [key]: value });
    expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    expect(result).toEqual(user);
  });

  it('Debería retornar undefined si no se encuentra el user', async () => {
    const key = 'email';
    const value = 'nonexistent@example.com';

    // Configura el mock del query builder para devolver undefined
    mockQueryBuilder.getOne.mockResolvedValue(undefined);

    const result = await service.findBy({ key, value });

    expect(usersRepository.createQueryBuilder).toHaveBeenCalledWith('user');
    expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.password');
    expect(mockQueryBuilder.where).toHaveBeenCalledWith({ [key]: value });
    expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});

  



import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import { UsersEntity } from '../../users/entities/users.entity';
import { PayLoadToken } from '../../interfaces/auth.interfaces';
//Inicializamos las variables de entorno
require('dotenv').config();

@Injectable()
export class AuthService {
  //Importamos el UsersService para utilizar sus funciones
  constructor(private readonly usersService: UsersService) {}

  /**
   * Función que se utiliza para verificar si username|email & password esta bien ingresados y coinciden
   * con las credenciales para poder loggerse
   * @param {string} username - Este puede ser del atributo user.username | user.email
   * @param {string} password
   * @returns {Promise<UsersEntity | null>} //Si esta bien devuelve la entidad sino nulo
   */
  public async validaterUser(
    username: string,
    password: string,
  ): Promise<UsersEntity | null> {
    //Se busca el valor del username segun user.username
    const userByUsername = await this.usersService.findBy({
      key: 'username',
      value: username,
    });
    //Se busca el valor del email según user.email
    const userByEmail = await this.usersService.findBy({
      key: 'email',
      value: username,
    });
    //Se puede ingresar según el username o el email del user según el decida
    const user = userByUsername || userByEmail;
    //Si user y la password hasheadas son correctas se devuelve user
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    //Sino nulo
    return null;
  }

  /**
   *
   * @param {jwt.JwtPayload} payload - representa el contenido del token JWT(sub, name, etc)
   * @param {string} secret - esto es lo que se utiliza para firmar el token, una cadena de texto SECRETA
   * @param {string|number} expires - acá se presentara el tiempo de expiración del token de acceso
   * @returns {string} - Crea un token JWT firmado y lo devuelve como una cadena
   */
  public signJWT(
    payload: jwt.JwtPayload,
    secret: string,
    expires: string | number,
  ): string {
    return jwt.sign(payload, secret, { expiresIn: expires });
  }

  /**
   * Función que se encarga de generar el JWT
   * @param {UsersEntity} user
   * @returns { Promise<{ accessToken: string; user: User }> }
   */
  public async generateJWT(
    user: UsersEntity,
  ): Promise<{ accessToken: string; user: UsersEntity }> {
    //Se obtiene un usuario con la función getUser importada de UsersService
    const getUser = await this.usersService.getUser(user.id);
    //Se crea la carga que contiene el rol y el id del usuario
    const payload: PayLoadToken = {
      rol: getUser.role,
      sub: getUser.id.toString(),
    };
    //Se le pasa al signJWT el payload, el secret y expires
    const accessToken = this.signJWT(payload, process.env.JWT_SECRET, '1h');
    //Se retorna el accessToken y el user obtenido
    return { accessToken, user: getUser };
  }
}

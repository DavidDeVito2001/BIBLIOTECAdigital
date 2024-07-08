import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from '../../constants/key-decorators';
import { Request } from 'express';
import { IUseToken } from '../../interfaces/auth.interfaces';
import { Observable } from 'rxjs';
import { UsersService } from '../../users/services/users.service';
import { useToken } from '../../../utils/use.token';



@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    //Se importan las funciones UsersService y se inicializa
    private readonly usersService: UsersService,
    //Reflector Se utiliza para acceder a los metadato definidos
    //Los metadatos se utilizan para añadir información adicional a la clases como, control de acceso, etc
    private readonly reflector: Reflector

  ){}
  async canActivate(
    context: ExecutionContext,
  ){
    //Obtiene los metadatos del decorator para saber si es true o false
    //Se utiliza para saber si la ruta es publica o np
    const IsPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler()
    );

    //Si es pública se retorna true
    if(IsPublic){
      return true;
    }

    //Convierte el contexto en una solicitud http y obtiene el objeto solicitado 
    const req = context.switchToHttp().getRequest<Request>();
    //accede a los encabezados de la solicitud req.header 'biblioteca_token' y asume el token esta en eser resultado 
    const token = req.headers['biblioteca_token']
    //Si no existe el token o si es un array lanza un error 
    if(!token || Array.isArray(token)){
      throw new UnauthorizedException('Token Invalido');
    }
    //Se consulta si el token es válido
    const manageToken: IUseToken | string = useToken(token);
    //Si el manageToken es type string se lanza error
    if(typeof manageToken === 'string'){
      throw new UnauthorizedException(manageToken);
    }
    //Si el token expiro se lanza error
    if(manageToken.isExpired){
      throw new UnauthorizedException('Token expirado');
    }
    //Con la deestructuración de objeto se accede a la propiedad "sub" de la variable manageToken
    const {sub} = manageToken;
    //Se busca al user por su sub
    const user = await this.usersService.getUser(parseInt(sub));
    //Si el user no existe
    if(!user){
      throw new UnauthorizedException('Usuario no valido');
    }
    //idUser y roleUser que declaramos en el nameSpace de Request
    req.idUser = user.id.toString()
    req.roleUser = user.role;
    //Si todas las anteriores validaciones fueron positivas se devuelve true
    return true;
  }
}

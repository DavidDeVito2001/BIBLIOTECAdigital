import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_KEY, PUBLIC_KEY, ROLES_KEY } from 'constants/key-decorators';
import { ROLES } from 'constants/roles';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    //Reflector Se utiliza para acceder a los metadato definidos
    //Los metadatos se utilizan para añadir información adicional a la clases como, control de acceso, etc
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //Verifica que la ruta sea pública
    const IsPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    if (IsPublic) {
      return true;
    }

    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      ROLES_KEY,
      context.getHandler(),
    );

    const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler());

    const req = context.switchToHttp().getRequest<Request>();

    const { roleUser } = req;
    //Si roles no esta definido
    if (roles === undefined) {
      //si admnin no exite, significa que va a ser para algo basico
      if (!admin) {
        return true;
      } else if (admin && roleUser === admin) {
        //corroboramos si exite admin y si el rolUser es igual admin significa que soy administrador
        return true;
      } else {
        throw new UnauthorizedException(
          'No tenes permisos para esta operación',
        );
      }
    }

    //Si el rol es igual a ADMIN me tiene que dejar pasar
    if (roleUser === ROLES.ADMIN) {
      return true;
    }

    //some() es por si existe algún elemento me va a devolver un true.
    //Se compara el role que me esta llegando por el decorador es igual al que tengo como usuario
    const isAuth = roles.some((rol) => rol === roleUser);
    //si es falso devuelvo un error
    if (!isAuth) {
      throw new UnauthorizedException('No tenes permisos para esta operación');
    }

    return true;
  }
}

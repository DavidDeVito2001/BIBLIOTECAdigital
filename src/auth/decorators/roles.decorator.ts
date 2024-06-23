import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../../constants/key-decorators';
import { ROLES } from '../../constants/roles';


// Usa la constante PUBLIC_KEY en el decorador
export const Roles = (...roles: Array<keyof typeof ROLES>) =>
    SetMetadata(ROLES_KEY, roles);

import { SetMetadata } from "@nestjs/common";
import { ADMIN_KEY } from "../../constants/key-decorators";
import { ROLES } from "../../constants/roles";

//Define y exporta una función llamada AdminAccess. Esta función es un decorador que, usa SetMetadata para asignar el valor ROLES.ADMIN a la clave ADMIN_KEY. 
export const AdminAccess = () => SetMetadata(ADMIN_KEY, ROLES.ADMIN)

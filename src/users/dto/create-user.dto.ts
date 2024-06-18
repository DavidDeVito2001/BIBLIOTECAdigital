import { ROLES } from "../../constants/roles";

export class CreateUserDTO{
    username: string;
    email: string;
    password: string;
    rol: ROLES;
}
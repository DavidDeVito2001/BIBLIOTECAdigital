/**@fileoverview archivo contiene una class con atributos opcionales y se exporta
 */

import { ROLES } from "../../constants/roles";

export class UpdateUserDTO{
    readonly username?: string;
    readonly email?: string;
    readonly password?: string;
    readonly rol?: ROLES;
}
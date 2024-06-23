/**
 * @fileoverview Archivo que contiene una interfaz que define las propiedades
 * que debe tener el objeto en donde la implemente
 */

import { ROLES } from "constants/roles";


export interface PayLoadToken{
    sub: string;
    rol: ROLES;
}

export interface AuthBody{
    username: string;
    password: string;
}

export interface AuthTokenResult{
    rol: ROLES;
    sub: string;
    iat: number;
    exp: number;
}

export interface IUseToken{
    rol: ROLES;
    sub: string;
    isExpired: boolean;
}

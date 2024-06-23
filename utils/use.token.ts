
import { AuthTokenResult, IUseToken } from 'interfaces/auth.interfaces';
import * as jwt from 'jsonwebtoken';

/**
 * Función para corroborar que el token existe o es valido. Se corrobora datos y fecha de expiración
 * @param {string} token - Se pasa como parametro el jwt
 * @returns {IUseToken | string}
 */
export const useToken = (token:string):IUseToken | string =>{
    try {
        const decode = jwt.decode(token) as AuthTokenResult
        const currenDate = new Date();
        const expiresDate = new Date(decode.exp);


        return{
            sub: decode.sub,
            rol: decode.rol,
            isExpired: +expiresDate <= +currenDate / 1000 //Si esta expirado
        }
    } catch (error) {
        return 'Token Invalido'
    }
}
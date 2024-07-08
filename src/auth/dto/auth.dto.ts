/**@fileoverview Archivo exporta una class con los atributos de un objeto
 * para que se cumpla con cierta estructura
 */

//Se valida que las variables no sean void y que si sean string
import { IsNotEmpty, IsString } from "class-validator";
import { AuthBody } from "../../interfaces/auth.interfaces";
import { ApiProperty } from "@nestjs/swagger";

//La clase implementa la interface AuthBody
export class AuthDTO implements AuthBody{
    
    @ApiProperty({description: 'El user puede usar su email o su username para el ingreso.'})
    @IsNotEmpty()
    username: string;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}
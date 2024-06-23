import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthDTO } from '../../auth/dto/auth.dto';
import { AuthService } from '../../auth/services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('login')
    async login(@Body(){username, password}: AuthDTO){
        const userValidate = await this.authService.validaterUser(
            username,
            password
        );

        if(!userValidate){
            throw new HttpException('Data No Valida', HttpStatus.CONFLICT);
        }

        const jwt = await this.authService.generateJWT(userValidate);
        
        return jwt;

    }


}

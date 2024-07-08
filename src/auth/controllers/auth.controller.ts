import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthDTO } from '../../auth/dto/auth.dto';
import { AuthService } from '../../auth/services/auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

//Tag para swagger
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @ApiOperation({
        summary: 'Login user',
        description: 'Este endpoint es público.',
      })
    @ApiResponse({
        status: 200,
        description: 'User ingreso exitosamente.',
      })
    @ApiResponse({
        status: 409,
        description: 'Data no válida.',
      })
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

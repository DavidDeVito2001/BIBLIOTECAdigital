import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from '../../users/dto/create-user.dto';
import { UsersEntity } from '../../users/entities/users.entity';
import { UsersService } from '/users/services/users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Post()
    createUser(@Body() newUser: CreateUserDTO): Promise<UsersEntity> {     
        return this.usersService.registerUser(newUser);
  }
}

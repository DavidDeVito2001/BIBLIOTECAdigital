import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from 'users/users.module';
import { UsersController } from 'users/controllers/users.controller';
import { UsersService } from 'users/services/users.service';

@Module({
  imports:[UsersModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService]
})
export class AuthModule {}

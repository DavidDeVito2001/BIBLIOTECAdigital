import { Module } from '@nestjs/common';
import { ProfilesController } from './controllers/profiles.controller';
import { ProfilesService } from './services/profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profiles.entity';
import { UsersModule } from '../users/users.module'; // Ruta correcta a UsersModule

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileEntity]),
    UsersModule, // Importa el UsersModule
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}

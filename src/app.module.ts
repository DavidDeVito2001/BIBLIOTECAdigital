/**
 * @fileoverview este es el archivo ts donde se importan todos los modules de la app 
 * para luego exportar a main.ts y ejecutar todo ahí
 */

import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from './profiles/profiles.module';
import { UsersEntity } from 'users/entities/users.entity';
import { ProfileEntity } from 'profiles/entities/profiles.entity';


@Module({
  imports: [
    //Configuramos el modulo para cargar las variables de entorno
    ConfigModule.forRoot({
      envFilePath: `.env.development`,
      isGlobal: true 
    }),
    //Configuramos la conexión a la BD de forma asíncrono 
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule], //Importa el modulo de configuración para usarlo en la configuración de TypeORM 
      useFactory: (configService: ConfigService) =>({
        type: 'mysql', //Especificamos el tipo de BD 
        host: configService.get('BIBLIOTECA_HOST'), //Obtiene el host de bd
        port: configService.get('BIBLIOTECA_PORT'), //Obtiene el puerto de la bd
        username: configService.get('BIBLIOTECA_USERNAME'), //Obtiene el username para la bd
        password: configService.get('BIBLIOTECA_PASSWORD'), //obtiene la contraseña
        database: configService.get('BIBLIOTECA_DATABASE'), //Obtiene el nombre de la bd
        entities:[UsersEntity, ProfileEntity]
      }),
      inject:[ConfigService], 
    }),
    UsersModule,
    ProfilesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

/**
 * @fileoverview Este archivo configura la conexión a la base de datos usando TypeORM.
 * Carga las variables de entorno desde un archivo .env 
 * y crea una instancia de DataSource con los parámetros para la conexión a la base de datos.
 */


import { BooksEntity } from 'books/entities/books.entity';
import { CopiesEntity } from 'copies/entities/copies.entity';
import {config} from 'dotenv';
import { ProfileEntity } from 'profiles/entities/profiles.entity';
import { DataSource } from 'typeorm';
import { UsersEntity } from 'users/entities/users.entity';

//Obtiene las variables de entorno
const env = process.env.NODE_ENV || 'development';

//Carga las variables de entorno
config({
    path: `.env.${env}`,
})

// Exporta una nueva instancia de DataSource configurada con las variables de entorno
export default new DataSource({
    type: 'mysql', //Se especifica el tipo de BD
    host: process.env.BIBLIOTECA_HOST, //Se obtiene el host de la bd 
    port: parseInt(process.env.BIBLIOTECA_PORT), // Se obtiene el puerto de la bd
    username: process.env.BIBLIOTECA_USERNAME, // Se obtiene el username para la bd
    password: process.env.BIBLIOTECA_PASSWORD, // Se obtiene el password
    database: process.env.BIBLIOTECA_DATABASE, // Se obtiene el nombre la bd 

    // Especifica las entidades que TypeORM debe reconocer para esta conexión (usando archivos .ts y .js)
    entities: [UsersEntity, ProfileEntity,BooksEntity,CopiesEntity],


    // Especifica en que carpetas se guardaran las migraciones
    migrations:['src/database/migrations/*{.ts,.js}'],
    // Se configura si la bd debe sincronizarse automaticamente con el esquema definido por las entities
    synchronize: true
})


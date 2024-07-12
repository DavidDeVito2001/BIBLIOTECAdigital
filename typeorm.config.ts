/**
 * @fileoverview Este archivo configura la conexión a la base de datos usando TypeORM.
 * Carga las variables de entorno desde un archivo .env 
 * y crea una instancia de DataSource con los parámetros para la conexión a la base de datos.
 */



import {config} from 'dotenv';
import { DataSource } from 'typeorm';


//Obtiene las variables de entornos
const env = process.env.NODE_ENV || 'development';

//Carga las variables de entorno
config({
    path: `.env.${env}`,
})

// Exporta una nueva instancia de DataSource configurada con las variables de entorno
export default new DataSource({
    type: 'mysql', //Se especifica el tipo de BD
    host: process.env.BIBLIOTECA_HOST, //Se obtiene el host de la bd 
    port: parseInt(process.env.BIBLIOTECA_DB_PORT), // Se obtiene el puerto de la bd
    username: process.env.BIBLIOTECA_USERNAME, // Se obtiene el username para la bd
    password: process.env.BIBLIOTECA_PASSWORD, // Se obtiene el password
    database: process.env.BIBLIOTECA_DATABASE, // Se obtiene el nombre la bd 
    
    // Especifica las entidades que TypeORM debe reconocer para esta conexión (usando archivos .ts y .js)
    entities: [__dirname + '/**/*.entity{.ts,.js}'],


    // Especifica en que carpetas se guardaran las migraciones
    migrations:['src/database/migrations/*{.ts,.js}'],
    //Para que las migraciones se hagan de forma automatica
    migrationsRun: true,
    // Se configura si la bd debe sincronizarse automaticamente con el esquema definido por las entities
    synchronize: false,
    
})



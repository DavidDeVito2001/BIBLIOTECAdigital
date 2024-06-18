import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { CORS } from './constants/cors';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Se utiliza morgan con el formato 'dev', para producir registros de las solicitudes HTTP con al información básica
  app.use(morgan('dev'));

  //Configuramos el origin, methods y credentials de la solicitud HTTP
  app.enableCors(CORS);

  //Prefijo global: http://localhost:3000/api/v1
  app.setGlobalPrefix('api/v1');

  const reflector = app.get(Reflector); //Con esto podemos utilizar para esconder la passwords en nuestras consultas a la bd
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  //Se configura validationPipe globalmente
  app.useGlobalPipes(new ValidationPipe()); //sirve para validar los controllers de forma automática

  
  await app.listen(3000);
  console.log('Escuchando en el puerto 3000')
  
}
bootstrap();

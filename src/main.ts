import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { CORS } from './constants/cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('NODE_ENV:', process.env.NODE_ENV); 
  //Se utiliza morgan con el formato 'dev', para producir registros de las solicitudes HTTP con al información básica
  app.use(morgan('dev'));

  //Configuramos el origin, methods y credentials de la solicitud HTTP
  app.enableCors(CORS);

  //Prefijo global: http://localhost:3000/api/v1
  app.setGlobalPrefix('api/v1');

  //Para documentar con swagger
  const config = new DocumentBuilder()
  .setTitle('Library Api')
  .setDescription('loans of books, library')
  .setVersion('1.0')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const reflector = app.get(Reflector); //Con esto podemos utilizar para esconder la passwords en nuestras consultas a la bd
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  //Se configura validationPipe globalmente
  app.useGlobalPipes(new ValidationPipe({ transform: true })); //sirve para validar los controllers de forma automática
  
  
  await app.listen(process.env.BIBLIOTECA_PORT);
  console.log('Escuchando en el puerto 3000')
  
}
bootstrap();

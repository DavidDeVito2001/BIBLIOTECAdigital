import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Books controller (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api/v1'); //Para poder usar los prefijos sin problemas

    await app.init();

    //Auntenticación para obtener el token
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: 'patricio', password: 'patricio123' });

    console.log('Respuesta de autenticación:', response.body);

    jwtToken = response.body.accessToken;
  });

  //URL del controller users
  const auth_URL = '/api/v1/auth/login';

  const header = 'biblioteca_token';

  describe('Autenticación POST /api/v1/auth/login',()=>{
    it('Debería autenticar las credenciales y devolever un token de acceso', async()=>{
      const response = await request(app.getHttpServer())
      .post(auth_URL)
      .send({
         username: 'patricio',
         password: 'patricio123' 
      })
      .expect(201);
    });

    it('Debería lanzar una exepción si las crendenciales no son correctas', async()=>{
      const response = await request(app.getHttpServer())
      .post(auth_URL)
      .send({
         username: 'patricioFalse',
         password: 'patricio123' 
      })
      .expect(409);
    });

  });

  afterAll(async () => {
    await app.close();
  });
});

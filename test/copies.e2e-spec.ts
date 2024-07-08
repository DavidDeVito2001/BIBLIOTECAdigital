import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Copies controller (e2e)', () => {
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
  const copies_URL = '/api/v1/copies/';

  const header = 'biblioteca_token';
  const jwtFalso = 'falsotokenmen';

  const bookId: number = 2;
  const idFalse: number = -1;

  describe('getCopiesByBookId GET /api/v1/copies/:idBook', () => {
    it('Debería obtener todas las copies de un book según el id del book', async () => {
      const response = await request(app.getHttpServer())
        .get(copies_URL + bookId)
        .expect(200);
    });

    it('Debería lanzar una exepción si la copy no existe', async () => {
      const response = await request(app.getHttpServer())
        .get(copies_URL + idFalse)
        .expect(404);
    });
  });

  describe('createCopy POST /api/v1/copies/:bookId', () => {
    it('Debería crear una copy según el id del book al que se lo quiere asociar', async () => {
      const response = await request(app.getHttpServer())
        .post(copies_URL + bookId)
        .set(header, jwtToken)
        .send({
          copyNumber: 5,
        });
      if (response.statusCode === 201) {
        expect(response.statusCode).toBe(201);
      } else {
        expect(response.statusCode).toBe(409);
      }
    });

    it('Debería lanzar una exepción si el número de la copy ya existe', async () => {
      const response = await request(app.getHttpServer())
        .post(copies_URL + bookId)
        .set(header, jwtToken)
        .send({
          copyNumber: 3,
        })
        .expect(409);
    });

    it('Debería lanzar una exepción si el book al que se lo quiere asociar no existe', async () => {
      const response = await request(app.getHttpServer())
        .post(copies_URL + idFalse)
        .set(header, jwtToken)
        .send({
          copyNumber: 3,
        })
        .expect(404);
    });

    it('Debería lanzar una exepción de no autorización', async () => {
      const response = await request(app.getHttpServer())
        .post(copies_URL + bookId)
        .set(header, jwtFalso)
        .send({
          copyNumber: 3,
        })
        .expect(401);
    });
  });

  describe('deleteCopy DELETE /api/v1/copies/:id', () => {
    it('Debería eliminar la copy', async () => {
      const response = await request(app.getHttpServer())
        .delete(copies_URL + 7)
        .set(header, jwtToken);
      if (response.statusCode === 200) {
        expect(response.statusCode).toBe(200);
      } else {
        expect(response.statusCode).toBe(404);
      }
    });

    it('Debería lanzar una exepción si la copy no existe', async () => {
      const response = await request(app.getHttpServer())
        .delete(copies_URL + idFalse)
        .set(header, jwtToken)
        .expect(404);
    });

    it('Debería lanzar una exepción si la copy tiene loan asociados', async () => {
      const response = await request(app.getHttpServer())
        .delete(copies_URL + 4)
        .set(header, jwtToken)
        .expect(400);
    });

    it('Debería lanzar una exepción si la copy tiene loan asociados', async () => {
      const response = await request(app.getHttpServer())
        .delete(copies_URL + 6)
        .set(header, jwtFalso)
        .expect(401);
    });
  });

  describe('updateCopy PATCH /api/v1/copies/:id', () => {
    it('Debería actualizar la copy según el id', async () => {
      const response = await request(app.getHttpServer())
        .patch(copies_URL + 5)
        .set(header, jwtToken)
        .send({
          numberCopy: 4,
        })
        .expect(200);
    });

    it('Debería lanzar una exepción si la copy no existe', async () => {
      const response = await request(app.getHttpServer())
        .patch(copies_URL + idFalse)
        .set(header, jwtToken)
        .send({
          numberCopy: 4,
        })
        .expect(404);
    });

    it('Debería lanzar una exepción no autorización', async () => {
      const response = await request(app.getHttpServer())
        .patch(copies_URL + 5)
        .set(header, jwtFalso)
        .send({
          numberCopy: 4,
        })
        .expect(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

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
  const books_URL = '/api/v1/books/';

  const header = 'biblioteca_token';
  const jwtFalso = 'falsotokenmen';

  const bookId: number = 2;
  const idFalse: number = -1;

  describe('getBooks GET /api/v1/books/', () => {
    it('Debería obtener una lista del books', async () => {
      const response = await request(app.getHttpServer())
        .get(books_URL)
        .expect(200);
    });
  });

  describe('getBook GET /api/v1/books/:id', () => {
    it('Debería obtener un book según el id', async () => {
      const response = await request(app.getHttpServer())
        .get(books_URL + bookId)
        .expect(200);
    });

    it('Debería lanzar una exepción si el book no existe', async () => {
      const response = await request(app.getHttpServer())
        .get(books_URL + idFalse)
        .expect(404);
    });
  });

  describe('createBook POST /api/v1/books/', () => {
    it('Debería crear un book', async () => {
      const response = await request(app.getHttpServer())
        .post(books_URL)
        .set(header, jwtToken)
        .send({
          title: 'La senda del perdedor',
          publication_year: 1982,
          isbn: '9788422623397',
          author: 'Charles Bukowski',
          category: 'Novela',
          image_url:
            'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRp-nylnqQ58vZYgum2TY0e09HNTjttxxQLMCD11-myJHvE-crl',
        });
      if (response.statusCode === 201) {
        expect(response.statusCode).toBe(201); //Si no esta guardado en la bd lanza 201 'created'
      } else {
        expect(response.statusCode).toBe(409); //Sino 'conflict' 409
      }
    });

    it('Debería lanzar una exepción si el book ya existe', async () => {
      const response = await request(app.getHttpServer())
        .post(books_URL)
        .set(header, jwtToken)
        .send({
          title: 'La senda del perdedor',
          publication_year: 1982,
          isbn: '9788422623397',
          author: 'Charles Bukowski',
          category: 'Novela',
          image_url:
            'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRp-nylnqQ58vZYgum2TY0e09HNTjttxxQLMCD11-myJHvE-crl',
        })
        .expect(409);
    });

    it('Debería lanzar una exepción de no autoruzación', async () => {
      const response = await request(app.getHttpServer())
        .post(books_URL)
        .set(header, jwtFalso)
        .send({
          title: 'La senda del perdedor',
          publication_year: 1982,
          isbn: '9788433912688', //Cambiamos el isbn, el cual indentifica la existencia.
          author: 'Charles Bukowski',
          category: 'Novela',
          image_url:
            'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRp-nylnqQ58vZYgum2TY0e09HNTjttxxQLMCD11-myJHvE-crl',
        })
        .expect(401);
    });
  });

  describe('deleteBook DELETE /api/v1/books/:id', ()=>{
    it('Debería eliminar un book según el id', async()=>{
        const response = await request(app.getHttpServer())
        .delete(books_URL+3)
        .set(header, jwtToken);

        if((response).statusCode === 200){
            expect((response).statusCode).toBe(200) //Si no se ejecuto la prueba lo elimina
        } else{
            expect((response).statusCode).toBe(404) // Si no no lo encuentra
        }
    });

    it('Debería lanzar una exepción sino se encuentra el book', async()=>{
        const response = await request(app.getHttpServer())
        .delete(books_URL+idFalse)
        .set(header, jwtToken)
        .expect(404);
    });

    it('Debería lanzar una exepción de que no se puede eliminar books con copies asociadas', async()=>{
        const response = await request(app.getHttpServer())
        .delete(books_URL+bookId)
        .set(header, jwtToken)
        .expect(400);
    });


    it('Debería lanzar una exepción de no autorización', async()=>{
        const response = await request(app.getHttpServer())
        .delete(books_URL+bookId)
        .set(header, jwtFalso)
        .expect(401);
    });
  });

  describe('updateBook PATCH /api/v1/books/:id', ()=>{

    it('Debería actualizar un book según el id', async()=>{
        const response = await request(app.getHttpServer())
        .patch(books_URL+bookId)
        .set(header, jwtToken)
        .send({
            title:'El principito'
        })
        .expect(200);
    });

    it('Debería lanzar una exepción si el book no existe', async()=>{
        const response = await request(app.getHttpServer())
        .patch(books_URL+idFalse)
        .set(header, jwtToken)
        .send({
            title:'El principito'
        })
        .expect(404);
    });

    it('Debería lanzar una exepción de no autorización', async()=>{
        const response = await request(app.getHttpServer())
        .patch(books_URL+bookId)
        .set(header, jwtFalso)
        .send({
            title:'El principito'
        })
        .expect(401);
    });

});


  afterAll(async () => {
    await app.close();
  });
});

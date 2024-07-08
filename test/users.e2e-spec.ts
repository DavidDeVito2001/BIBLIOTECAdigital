import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { AppModule } from "../src/app.module";

describe('Users controller (e2e)',()=>{
    let app: INestApplication;
    let jwtToken: string;

    beforeAll(async ()=>{
        const moduleFixture: TestingModule = await Test.
        createTestingModule({
            imports:[AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('/api/v1') //Para poder usar los prefijos sin problemas
        
        await app.init();

        //Auntenticación para obtener el token
        const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({username:'patricio', password:'patricio123'})

        console.log('Respuesta de autenticación:', response.body);

        jwtToken = response.body.accessToken;
        

    });


    //URL del controller users
    const users_URL = '/api/v1/users/';
    
    const header = 'biblioteca_token'
    const jwtFalso = 'falsotokenmen';
    const idFalse = -1;

    describe('getUsers GET /api/v1/users/',()=>{
        it('Debería obtener uns lista de users', async()=>{
            return request(app.getHttpServer())
            .get(users_URL)
            .set(header, jwtToken)
            .expect(200);
        });

        it('Debería retornar una exepción si el token no es valido', async ()=>{
            return request(app.getHttpServer())
            .get(users_URL)
            .set(header, jwtFalso)
            .expect(401);
        });
    
    });

    describe('getUser GET /api/v1/users/:id',()=>{
        const id = 11; // Asegúrate de que este usuario exista en la base de datos
        

        it('Debería obtener un user por el id', async () => {
            const response = await request(app.getHttpServer())
              .get(users_URL+id)
              .set(header, jwtToken)
              .expect(200);
          });

        it('Debería retornar un error si el user no es encontrado',async()=>{
            const response = await request(app.getHttpServer())
              .get(users_URL+idFalse)
              .set(header, jwtToken)
              .expect(404);
        });

        it('Debería retornar una exepción si el token no es valido',async()=>{
            const response = await request(app.getHttpServer())
              .get(users_URL+id)
              .set(header, jwtFalso)
              .expect(401);
        });
    });
    

    describe('registerUser POST /api/v1/users/',()=>{
        
        it('Debería crear un nuevo user', async()=>{ 
            const response = request(app.getHttpServer())
            .post(users_URL).send({
                username:'Maria',
                email:'maria@gmail.com',
                password:'maria123'
            });
            if((await response).statusCode === 201){
                expect((await response).statusCode).toBe(201); //Para que de status === 201 hay que registrar nuevo user
            } else{
                expect((await response).statusCode).toBe(409); //Si el user ya existe es status === 409 
            }
        });

        it('Debería lanzar una exepción si el email no cumple con el formato', async()=>{
            const response = await request(app.getHttpServer())
            .post(users_URL).send({
                username:'pancho',
                email:'pancho',
                password:'pancho123'
            })
            .expect(409)
        });

        it('Debería lanzar una exepción 409 si el user ya existe', async()=>{
            const response = await request(app.getHttpServer())
            .post(users_URL).send({
                username:'Maria',
                email:'maria@gmail.com',
                password:'maria123'
            })
            .expect(409)
        });
    });

    describe('deleteUser DELETE /api/v1/users/:id', ()=>{
        
        it('Debería eliminar un user según el id:', async ()=>{
            const response = await request(app.getHttpServer())
            .delete(users_URL+1)
            .set(header, jwtToken);
            if((response).statusCode === 200){
                expect((response).statusCode).toBe(200) //Si el user es encontrado y eliminado correctamente nos da status 200
            } else{
                expect((response).statusCode).toBe(404)//Si no olvidamos cambiar el user capta y lanza el status 404
            }     
        });

        it('Debería lanzar una exepción si el user no es encontrado', async ()=>{
            const response = await request(app.getHttpServer())
            .delete(users_URL+99999)
            .set(header, jwtToken)
            .expect(404);
        });

        it('Debería lanzar una exepción si al intentar eliminar el user tiene loans asociados', async()=>{
            const response = await request(app.getHttpServer())
            .delete(users_URL+11)
            .set(header, jwtToken)
            .expect(400);
        });
        
        it('Debería lanzar una exepción si el user no tiene autorización', async ()=>{
            const response = await request(app.getHttpServer())
            .delete(users_URL+3)
            .set(header, jwtFalso)
            .expect(401);    
        });
        
    });

    
    describe('updateUser PATCH /api/v1/users/:id', ()=>{

        it('Debería actualizar el user según el id', async ()=>{
            const response = await request(app.getHttpServer())
            .patch(users_URL+10)
            .set(header, jwtToken)
            .send({
                username: 'MariaMagdalena',
            })
            .expect(200);
            
            expect(response.body.username).toBe('MariaMagdalena')
        });

        it('Debería lanzar una exepción si el user no es encontrado', async ()=>{
            const response = await request(app.getHttpServer())
            .patch(users_URL+idFalse)
            .set(header, jwtToken)
            .send({
                username: 'UserNoExiste',
                email: 'Noexiste@gmai.com'
            })
            .expect(404);
        });

        it('Debería lanzar una exepción de no autorización si el token no es valido', async ()=>{
            const response = await request(app.getHttpServer())
            .patch(users_URL+10)
            .set(header, jwtFalso)
            .send({
                username: 'MariaMagdalena',
            })
            .expect(401);
        });

    });
    



    afterAll(async () => {
        await app.close();
      });
});
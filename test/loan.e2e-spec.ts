import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from 'supertest';
import { AppModule } from "../src/app.module";



describe('Profiles controller (e2e)',()=>{
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
    const loans_URL = '/api/v1/loans/';
    
    const header = 'biblioteca_token'
    const jwtFalso:string = 'falsotokenmen';
    const idFalse:number = -1;
    const id:number = 4;
    
    describe('getLoans GET /api/v1/loans', ()=>{
        it('Debería obetener una lista de loans', async ()=>{
            const response = await request(app.getHttpServer())
            .get(loans_URL)
            .set(header, jwtToken)
            .expect(200);
        });

        it('Debería lanzar una exepción de falta de autorización', async ()=>{
            const response = await request(app.getHttpServer())
            .get(loans_URL)
            .set(header, jwtFalso)
            .expect(401);
        });
    });

    describe('getLoan GET /api/v1/loans/:id',()=>{
        
        it('Deberpia obtener un loan según el id', async ()=>{
            const response = await request(app.getHttpServer())
            .get(loans_URL+id)
            .set(header, jwtToken)
            .expect(200);
        });

        it('Debería lanzar una exepción si el loan no existe', async ()=>{
            const response = await request(app.getHttpServer())
            .get(loans_URL+idFalse)
            .set(header, jwtToken)
            .expect(404);
        });

        it('Debería lanzar una exepción de no autorización', async ()=>{
            const response = await request(app.getHttpServer())
            .get(loans_URL+id)
            .set(header, jwtFalso)
            .expect(401);
        })

    });

    describe('createLoans POST /api/v1/loans/',()=>{

        it('Debería crear un nuevo loan', async ()=>{
            const response = await request(app.getHttpServer())
            .post(loans_URL)
            .set(header, jwtToken)
            .send({
                loan_return: '2024-07-25T02:20:26.846Z',
                copyId: 3,
                userId: 10
            });
            if((response).statusCode === 201){
                expect((response).statusCode).toBe(201)
            }else{
                expect((response).statusCode).toBe(409)
            }          
        });

        it('Debería lanzar una exepción si el la copy no esta habilitada', async()=>{
            const response = await request(app.getHttpServer())
            .post(loans_URL)
            .set(header, jwtToken)
            .send({
                loan_return: '2024-07-25T02:20:26.846Z',
                copyId: 3,
                userId: 6
            })
            .expect(409);
        });

        it('Debería lanzar una exepción si la copy no existe', async ()=>{
            const response = await request(app.getHttpServer())
            .post(loans_URL)
            .set(header, jwtToken)
            .send({
                loan_return: '2024-07-25T02:20:26.846Z',
                copyId: idFalse,
                userId: 6
            })
            .expect(404);
        });

        it('Debería lanzar una exepción si el user no existe', async ()=>{
            const response = await request(app.getHttpServer())
            .post(loans_URL)
            .set(header, jwtToken)
            .send({
                loan_return: '2024-07-25T02:20:26.846Z',
                copyId: 3,
                userId: idFalse
            })
            .expect(404);
        });
        
        it('Debería lanzar una exepción de no autorización', async ()=>{
            const response = await request(app.getHttpServer())
            .post(loans_URL)
            .set(header, jwtFalso)
            .send({
                loan_return: '2024-07-25T02:20:26.846Z',
                copyId: 3,
                userId: 10
            })
            .expect(401);
        });
    });

    describe('deleteLoan DELETE /api/v1/loans/', ()=>{
        it('Debería eliminar el loan según el id',async()=>{
            const response = await request(app.getHttpServer())
            .delete(loans_URL+3)
            .set(header, jwtToken);
            if((response).statusCode === 200){
                expect((response).statusCode).toBe(200) //Como esta guardado en memoria si el loan existe da un 200
            }else{
                expect((response).statusCode).toBe(404)//Si la prueba ya se ejecuta y no el loan no existe te da 404
            }
        });

        it('Debería lanzar una exepción si el loan no es encontrado', async ()=>{
            const response = await request(app.getHttpServer())
            .delete(loans_URL+3)
            .set(header, jwtToken)
            .expect(404);
        });

        it('Debería lanzar una exepción de no autorización', async ()=>{
            const response = await request(app.getHttpServer())
            .delete(loans_URL+4)
            .set(header, jwtFalso)
            .expect(401);
        });

    });

    describe('updateLoan PATCH /api/v1/loans/:id',()=>{
        it('Debería actualizar el loan según el id', async()=>{
            const response = await request(app.getHttpServer())
            .patch(loans_URL+id)
            .set(header, jwtToken)
            .send({
                loan_return:'2024-08-25T02:20:26.846Z'
            })
            .expect(200);
        });

        it('Debería lanzar una exepción si el loan no existe', async()=>{
            const response = await request(app.getHttpServer())
            .patch(loans_URL+idFalse)
            .set(header, jwtToken)
            .send({
                loan_return:'2024-08-25T02:20:26.846Z'
            })
            .expect(404);
        });

        it('Debería lanzar una exepcion de no autorización', async()=>{
            const response = await request(app.getHttpServer())
            .patch(loans_URL+id)
            .set(header, jwtFalso)
            .send({
                loan_return:'2024-08-25T02:20:26.846Z'
            })
            .expect(401);
        })
    });











});
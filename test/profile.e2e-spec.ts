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
    //ruta de profile
    const profile_URL = `/api/v1/users/profiles/`;

    const header:string = 'biblioteca_token';

    const jwtFalso = 'falsoToken';

    const id:number = 10;
    const idFalso:number = -1;
    

    describe('createProfile POST /api/v1/users/profiles/:id', ()=>{
        it('Debería crear un profile para un user, según el id del user', async ()=>{
            const response = await request(app.getHttpServer())
            .post(profile_URL + 10)
            .set(header, jwtToken)
            .send({
                firstName: 'Maria Magdalena',
                lastName: 'Carrizo',
                age: 22,
                tel: '+54 011 54245454',
                adrress: 'San Pablo 25'
            });
            //Como guardamos en en la db los datos, hacemos una sentencia para que no nos de error cuando lancen status 409 
            //porque ya esta creado
            if((response).statusCode === 201){   
                expect((response).statusCode).toBe(201) //201 Cuando se crea correctamente
            }else{
                expect((response).statusCode).toBe(409) //409 cuando el user ya tiene un perfil asociado
            }
        });

        it('Debería lanzar una exepción si el user ya tiene un profile ya asociado', async ()=>{
            const response = await request(app.getHttpServer())
            .post(profile_URL + id)
            .set(header, jwtToken)
            .send({
                firstName: 'Maria Magdalena',
                lastName: 'Carrizo',
                age: 22,
                tel: '+54 011 54245454',
                adrress: 'San Pablo 25'
            })
            .expect(409);
        });

        it('Debería lanzar una exepción si el user al que se quiere asociar el profile no existe', async ()=>{
            const response = await request(app.getHttpServer())
            .post(profile_URL + idFalso)
            .set(header, jwtToken)
            .send({
                firstName: 'No existe',
                lastName: 'nono',
                age: 22,
                tel: '+54 011 54245454',
                adrress: 'calle falsa 123'
            })
            .expect(404);
        });

        it('Debería lanzar una exepción de user no autorizado', async ()=>{
            const response = await request(app.getHttpServer())
            .post(profile_URL + 10)
            .set(header, jwtFalso)
            .send({
                firstName: 'Maria Magdalena',
                lastName: 'Carrizo',
                age: 22,
                tel: '+54 011 54245454',
                adrress: 'San Pablo 25'
            })
            .expect(401);
        });     
    });

    describe('updateProfileByUserId PATCH /api/v1/users/profiles/:id',()=>{

        it('Debería actualizar el profile según el id del user', async ()=>{
            const response = await request(app.getHttpServer())
            .patch(profile_URL+ id)
            .set(header, jwtToken)
            .send({
                firstName:'Maria Magdalena de las Nieves'
            })
            .expect(200);
        });

        it('Debería lanzar una exepción por user no encontrado', async ()=>{
            const response = await request(app.getHttpServer())
            .patch(profile_URL+ idFalso)
            .set(header, jwtToken)
            .send({
                firstName:'UserNoEncontrado'
            })
            .expect(404);
        });

        it('Debería lanzar una exepción de user no autorizado', async ()=>{
            const response = await request(app.getHttpServer())
            .patch(profile_URL+ id)
            .set(header, jwtFalso)
            .send({
                firstName:'Maria Magdalena de las Nieves'
            })
            .expect(401);
        });
        
    });

















});
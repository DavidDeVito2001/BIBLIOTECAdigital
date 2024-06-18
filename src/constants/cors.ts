import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

//Configuración para enableCors
//@type CorsOptions
export const CORS: CorsOptions = {
    //Permite solicitudes http desde cualquier origen
    origin: true,
    //Permite que las solicitudes contengas los siguientes métodos
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    //Es necesario que la solicitud tenga credenciales, en la cookie o en el encabezado de autorización
    credentials: true
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { LoansService } from '../../loans/services/loans.service';
import { CreateLoanDTO } from '../../loans/dto/create-loan.dto';
import { Request } from 'express';
import { LoansEntity } from '../../loans/entities/loans.entity';
import { UpdateLoanDTO } from '../../loans/dto/update-loan.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AdminAccess } from '../../auth/decorators/admin.decorator';
import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

//Tag para swagger
@ApiTags('Loans')
@Controller('loans')
@UseGuards(AuthGuard, RolesGuard)
export class LoansController {
    constructor(private loansService:LoansService){}

    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
        name: 'biblioteca_token',
        description: 'Token de autenticación para la biblioteca',
        required: true
      })
      @ApiOperation({
        summary: 'Creación de loan',
        description: 'Este endpoint solo puede ser accedido por users básicos y administradores.',
      })
      @ApiResponse({
        status: 200,
        description: 'Lista de Loans obtenida exitosamente.',
      })
      @ApiResponse({
        status: 401,
        description: 'No tenes permisos para esta operación',
      })
    //Ruta para admins
    @AdminAccess()
    //Maneja la solicitud get y se usa para recuperar la lista de loans existentes
    @Get()
    getLoans(@Req() request: Request):Promise<LoansEntity[]>{
        return this.loansService.getLoans(request.query)
    }

    //indico parametros para swagger
    @ApiParam({
        name: 'id',
        description: 'ID del loan'
      })
    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
        name: 'biblioteca_token',
        description: 'Token de autenticación para la biblioteca',
        required: true
      })
      @ApiOperation({
        summary: 'Obtener loan según el id',
        description: 'Este endpoint solo puede ser accedido por administradores.',
      })
      @ApiResponse({
        status: 200,
        description: 'Loan obtenido exitosamente.',
      })
      @ApiResponse({
        status: 404,
        description: 'Loan no encontrado.',
      })
      @ApiResponse({
        status: 401,
        description: 'No tenes permisos para esta operación.',
      })
    //Ruta para logeados y admins
    @AdminAccess()
    //Maneja la solicitud get y se encarga de obtener un loan según el id
    @Get(':id')
    getLoan(@Param('id', ParseIntPipe)id: number):Promise<LoansEntity>{
        return this.loansService.getLoan(id);
    }

    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
        name: 'biblioteca_token',
        description: 'Token de autenticación para la biblioteca',
        required: true
      })
      @ApiOperation({
        summary: 'Creación de loan',
        description: 'Este endpoint solo puede ser accedido por users básicos y administradores.',
      })
      @ApiResponse({
        status: 200,
        description: 'Loan creado exitosamente.',
      })
      @ApiResponse({
        status: 404,
        description: 'User no encontrado.',
      })
      @ApiResponse({
        status: 400,
        description: 'Copy no encontrado.(404)',
      })
      @ApiResponse({
        status: 409,
        description: 'Copy no disponible.',
      })
      @ApiResponse({
        status: 401,
        description: 'No tenes permisos para esta operación',
      })
    //Ruta para logeados y admins
    @Roles('BASIC')
    //Maneje la solicitud post y se encarga de la creación de loan
    @Post()
    createLoans(@Body()loan:CreateLoanDTO):Promise<LoansEntity>{
        return this.loansService.createLoans(loan);
    }

    //indico parametros para swagger
    @ApiParam({
        name: 'id',
        description: 'ID del loan'
      })
    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
        name: 'biblioteca_token',
        description: 'Token de autenticación para la biblioteca',
        required: true
      })
      @ApiOperation({
        summary: 'Eliminar loan por ID',
        description: 'Este endpoint solo puede ser accedido por administradores.',
      })
      @ApiResponse({
        status: 200,
        description: 'Loan encontrado y eliminado exitosamente',
      })
      @ApiResponse({
        status: 404,
        description: 'loan no encontrado',
      })
      @ApiResponse({
        status: 401,
        description: 'No tenes permisos para esta operación',
      })
    //Ruta para admins
    @AdminAccess()
    //Maneja la solicitud delete y se encarga de eliminar un loan según el id
    @Delete(':id')
    deleteLoan(@Param('id',ParseIntPipe) id:number){
        return this.loansService.deleteLoan(id)
    }

    //indico parametros para swagger
    @ApiParam({
        name: 'id',
        description: 'ID del loan'
      })
    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
        name: 'biblioteca_token',
        description: 'Token de autenticación para la biblioteca',
        required: true
      })
      @ApiOperation({
        summary: 'Actualizar loan por ID',
        description: 'Este endpoint solo puede ser accedido por administradores.',
      })
      @ApiResponse({
        status: 200,
        description: 'Loan encontrado y actualizado exitosamente',
      })
      @ApiResponse({
        status: 404,
        description: 'Loan no encontrado',
      })
      @ApiResponse({
        status: 401,
        description: 'No tenes permisos para esta operación',
      })
    //Ruta para admins
    @AdminAccess()
    //Maneja la solicitud patch y se encarga de actualizar el loan según el id
    @Patch(':id')
    updateLoan(
        @Param('id', ParseIntPipe) id:number,
        @Body() loan: UpdateLoanDTO
    ):Promise<LoansEntity>{
        return this.loansService.updateLoan(id, loan);
    }

}

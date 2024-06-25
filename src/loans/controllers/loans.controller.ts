import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { LoansService } from '../../loans/services/loans.service';
import { CreateLoanDTO } from '../../loans/dto/create-loan.dto';
import { Request } from 'express';
import { LoansEntity } from '../../loans/entities/loans.entity';
import { UpdateLoanDTO } from '../../loans/dto/update-loan.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from 'auth/decorators/roles.decorator';
import { AdminAccess } from 'auth/decorators/admin.decorator';

@Controller('loans')
@UseGuards(AuthGuard, RolesGuard)
export class LoansController {
    constructor(private loansService:LoansService){}

    //Ruta para admins
    @AdminAccess()
    //Maneja la solicitud get y se usa para recuperar la lista de loans existentes
    @Get()
    getLoans(@Req() request: Request):Promise<LoansEntity[]>{
        return this.loansService.getLoans(request.query)
    }

    //Ruta para logeados y admins
    @Roles('BASIC')
    //Maneja la solicitud get y se encarga de obtener un loan según el id
    @Get('id')
    getLoan(@Param('id', ParseIntPipe)id: number):Promise<LoansEntity>{
        return this.loansService.getLoan(id);
    }

    //Ruta para logeados y admins
    @Roles('BASIC')
    //Maneje la solicitud post y se encarga de la creación de loan
    @Post()
    createLoans(@Body()loan:CreateLoanDTO):Promise<LoansEntity>{
        return this.loansService.createLoans(loan);
    }

    //Ruta para admins
    @AdminAccess()
    //Maneja la solicitud delete y se encarga de eliminar un loan según el id
    @Delete(':id')
    deleteLoan(@Param('id',ParseIntPipe) id:number){
        return this.loansService.deleteLoan(id)
    }

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

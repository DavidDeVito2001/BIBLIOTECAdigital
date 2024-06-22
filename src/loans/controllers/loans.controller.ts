import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { LoansService } from '../../loans/services/loans.service';
import { CreateLoanDTO } from '../../loans/dto/create-loan.dto';
import { Request } from 'express';
import { LoansEntity } from 'loans/entities/loans.entity';
import { UpdateLoanDTO } from 'loans/dto/update-loan.dto';

@Controller('loans')
export class LoansController {
    constructor(private loansService:LoansService){}

    //Maneja la solicitud get y se usa para recuperar la lista de loans existentes
    @Get()
    getLoans(@Req() request: Request):Promise<LoansEntity[]>{
        return this.loansService.getLoans(request.query)
    }

    //Maneja la solicitud get y se encarga de obtener un loan según el id
    @Get('id')
    getLoan(@Param('id', ParseIntPipe)id: number):Promise<LoansEntity>{
        return this.loansService.getLoan(id);
    }

    //Maneje la solicitud post y se encarga de la creación de loan
    @Post()
    createLoans(@Body()loan:CreateLoanDTO):Promise<LoansEntity>{
        return this.loansService.createLoans(loan);
    }

    //Maneja la solicitud delete y se encarga de eliminar un loan según el id
    @Delete(':id')
    deleteLoan(@Param('id',ParseIntPipe) id:number){
        return this.loansService.deleteLoan(id)
    }

    //Maneja la solicitud patch y se encarga de actualizar el loan según el id
    @Patch(':id')
    updateLoan(
        @Param('id', ParseIntPipe) id:number,
        @Body() loan: UpdateLoanDTO
    ):Promise<LoansEntity>{
        return this.loansService.updateLoan(id, loan);
    }

}

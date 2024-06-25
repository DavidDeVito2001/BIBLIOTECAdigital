import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CopiesService } from '../../copies/services/copies.service';
import { CreateCopyDTO } from '../../copies/dto/create-copies.dto';
import { BooksEntity } from '../../books/entities/books.entity';
import { CopiesEntity } from '../../copies/entities/copies.entity';
import { UpdateCopyDTO } from '../../copies/dto/update-copies.dto';
import { AuthGuard } from 'auth/guards/auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { PublicAccess } from 'auth/decorators/public.decorator';
import { AdminAccess } from 'auth/decorators/admin.decorator';


@Controller('copies')
@UseGuards(AuthGuard, RolesGuard)
export class CopiesController {
    constructor(
        private copiesService: CopiesService
    ){}

    //Público
    @PublicAccess()
    //Maneja la solitud get para la obtención de un book con su copies list asociada
    @Get(':bookId')
    getCopiesByBookId(@Param('bookId', ParseIntPipe)bookId: number):Promise<BooksEntity>{
        return this.copiesService.getCopiesByBookId(bookId);
    }

    //Solo admin
    @AdminAccess()
    //Maneja la solicitud post para la creación de una copy
    @Post(':bookId')
    createCopy(
        @Param('bookId', ParseIntPipe)bookId:number,
        @Body() copy: CreateCopyDTO    
    ):Promise<CopiesEntity>{
        return this.copiesService.createCopy(bookId, copy);
    }

    //Solo admin
    @AdminAccess()
    //Maneja la solicitud delete para la eliminación de una copy
    @Delete(':id')
    deleteCopy(@Param('id', ParseIntPipe) id:number){
        return this.copiesService.deleteCopy(id);
    }

    //Solo admin
    @AdminAccess()
    //Maneja solicitud patch para la actualización de la copy
    @Patch(':id')
    updateCopy(
        @Param('id', ParseIntPipe) id:number,
        @Body() copy: UpdateCopyDTO
    ){
        return this.copiesService.updateCopy(id, copy);
    }
}

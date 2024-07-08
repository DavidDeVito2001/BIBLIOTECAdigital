import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CopiesService } from '../../copies/services/copies.service';
import { CreateCopyDTO } from '../../copies/dto/create-copies.dto';
import { BooksEntity } from '../../books/entities/books.entity';
import { CopiesEntity } from '../../copies/entities/copies.entity';
import { UpdateCopyDTO } from '../../copies/dto/update-copies.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { PublicAccess } from '../../auth/decorators/public.decorator';
import { AdminAccess } from '../../auth/decorators/admin.decorator';
import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';


//Tag para swagger
@ApiTags('Copies')
@Controller('copies')
@UseGuards(AuthGuard, RolesGuard)
export class CopiesController {
    constructor(
        private copiesService: CopiesService
    ){}

    //indico parametros para swagger
    @ApiParam({
        name: 'bookId',
        description: 'ID del book al que estan asociados las copies',
      })
    @ApiOperation({
        summary: 'Obtener todas las copies segun id del book al que estan asociados',
        description: 'Este endpoint es público.'
      })
    @ApiResponse({
        status: 200,
        description: 'Book con copies asociadas exitosamente.',
      })
    @ApiResponse({
        status: 404,
        description: 'Book no encontrado.',
      })
    //Público
    @PublicAccess()
    //Maneja la solitud get para la obtención de un book con su copies list asociada
    @Get(':bookId')
    getCopiesByBookId(@Param('bookId', ParseIntPipe)bookId: number):Promise<BooksEntity>{
        return this.copiesService.getCopiesByBookId(bookId);
    }

    //indico parametros para swagger
    @ApiParam({
        name: 'bookId',
        description: 'ID del book al que se quiere asociar la copy que se va a crear'
      })
    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
        name: 'biblioteca_token',
        description: 'Token de autenticación para la biblioteca',
        required: true
      })
    @ApiOperation({
        summary: 'Create copy según id del book',
        description: 'Este endpoint solo puede ser accedido por administradores.',
      })
    @ApiResponse({
        status: 200,
        description: 'Copy registrado exitosamente.',
      })
    @ApiResponse({
        status: 404,
        description: 'Book no encontrado.',
      })
    @ApiResponse({
        status: 401,
        description: 'No tenes permisos para esta operación',
      })
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

    //indico parametros para swagger
    @ApiParam({
        name: 'id',
        description: 'ID de la copy'
      })
    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
        name: 'biblioteca_token',
        description: 'Token de autenticación para la biblioteca',
        required: true
      })
    @ApiOperation({
        summary: 'Eliminar copy según id',
        description: 'Este endpoint solo puede ser accedido por administradores.',
      })
    @ApiResponse({
        status: 200,
        description: 'Copy eliminado exitosamente.',
      })
    @ApiResponse({
        status: 404,
        description: 'Copy no encontrada.',
      })
    @ApiResponse({
        status: 401,
        description: 'No tenes permisos para esta operación',
      })
    //Solo admin
    @AdminAccess()
    //Maneja la solicitud delete para la eliminación de una copy
    @Delete(':id')
    deleteCopy(@Param('id', ParseIntPipe) id:number){
        return this.copiesService.deleteCopy(id);
    }

    //indico parametros para swagger
    @ApiParam({
        name: 'id',
        description: 'ID de la copy'
      })
    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
        name: 'biblioteca_token',
        description: 'Token de autenticación para la biblioteca',
        required: true
      })
      @ApiOperation({
        summary: 'Actualizar copy según id',
        description: 'Este endpoint solo puede ser accedido por administradores.',
      })
      @ApiResponse({
        status: 200,
        description: 'Copy actualizado exitosamente.',
      })
      @ApiResponse({
        status: 404,
        description: 'Copy no encontrada.',
      })
      @ApiResponse({
        status: 401,
        description: 'No tenes permisos para esta operación',
      })
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

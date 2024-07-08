import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BooksService } from '../../books/services/books.service';
import { CreateBookDTO } from '../../books/dto/create-book.dto';
import { BooksEntity } from '../../books/entities/books.entity';
import { Request } from 'express';
import { UpdateBookDTO } from '../../books/dto/update-book.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { PublicAccess } from '../../auth/decorators/public.decorator';
import { AdminAccess } from '../../auth/decorators/admin.decorator';
import { ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

//Tag para swagger
@ApiTags('Books')
@Controller('books')
@UseGuards(AuthGuard, RolesGuard)
export class BooksController {
    constructor(private booksService: BooksService){}

    @ApiOperation({
      summary: 'Obtener lista de books.',
      description: 'Este endpoint es público.',
    })
    @ApiResponse({
      status: 200,
      description: 'Lista de Books obtenido exitosamente.',
    })
    //Es público
    @PublicAccess()
    //Maneja la solicitud get - Se utiliza para traer una lista de books
    @Get()
    getBooks(@Req() request: Request):Promise<BooksEntity[]>{
        return this.booksService.getBooks(request.query)
    }

    //indico parametros para swagger
    @ApiParam({
        name: 'id',
        description:'Id del libro que queremos consultar'
      })
    @ApiOperation({
        summary: 'Obtener book según id',
        description: 'Este endpoint es público.',
      })
    @ApiResponse({
        status: 200,
        description: 'Book obtenido exitosamente.',
      })
    @ApiResponse({
        status: 404,
        description: 'Book no encontrado.',
      })
    //Es público
    @PublicAccess()
    //Maneja la solicitud get - Se utiliza para traer una lista de books
    @Get(':id')
    getBook(@Param('id', ParseIntPipe) id: number):Promise<BooksEntity>{
        return this.booksService.getBook(id);
    }

    
    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
        name: 'biblioteca_token',
        description: 'Token de autenticación para la biblioteca',
        required: true
      })
    @ApiOperation({
        summary: 'Creación de book.',
        description: 'Este endpoint solo puede ser accedido por administradores.',
      })
    @ApiResponse({
        status: 200,
        description: 'Book creado exitosamente.',
      })
    @ApiResponse({
        status: 409,
        description: 'Book Ya existe.',
      })
    @ApiResponse({
        status: 401,
        description: 'No tenes permisos para esta operación',
      })
    //Solo Admin
    @AdminAccess()
    //Maneja la solicitud post - Se utiliza para la creación de un book
    @Post()
    createBook(@Body()book: CreateBookDTO):Promise<BooksEntity>{
        return this.booksService.createBook(book);
    }

    
    //indico parametros para swagger
    @ApiParam({
        name: 'id',
        description: 'ID del book'
      })
    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
        name: 'biblioteca_token',
        description: 'Token de autenticación para la biblioteca',
        required: true
      })
    @ApiOperation({
        summary: 'Eliminar book según id',
        description: 'Este endpoint solo puede ser accedido por administradores.',
      })
    @ApiResponse({
        status: 200,
        description: 'Book eliminado exitosamente.',
      })
    @ApiResponse({
        status: 404,
        description: 'Book no encontrada.',
      })
    @ApiResponse({
        status: 401,
        description: 'No tenes permisos para esta operación',
      })
    //Solo Admin
    @AdminAccess()
    //Maneja la solicitud delete - Se utiliza para eliminar un book
    @Delete(':id')
    deleteBook(@Param('id', ParseIntPipe)id: number){
        return this.booksService.deleteBook(id);
    }

    
    //indico parametros para swagger
    @ApiParam({
        name: 'id',
        description: 'ID del book'
      })
    //Encabezado 'biblioteca_token' que se requiere para utilizar el endpoint
    @ApiHeader({
        name: 'biblioteca_token',
        description: 'Token de autenticación para la biblioteca',
        required: true
      })
    @ApiOperation({
        summary: 'Actualizar book según id',
        description: 'Este endpoint solo puede ser accedido por administradores.',
      })
    @ApiResponse({
        status: 200,
        description: 'Book actualizado exitosamente.',
      })
    @ApiResponse({
        status: 404,
        description: 'Book no encontrada.',
      })
    @ApiResponse({
        status: 401,
        description: 'No tenes permisos para esta operación',
      })
    //Solo Admin
    @AdminAccess()
    //Maneja la solicitud patch - Se utiliza para actualizar los datos del book
    @Patch(':id')
    updatebook(
        @Param('id', ParseIntPipe)id: number,
        @Body() book: UpdateBookDTO
    ){
        return this.booksService.updateBook(id, book)
    }
}

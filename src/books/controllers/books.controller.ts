import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { BooksService } from '../../books/services/books.service';
import { CreateBookDTO } from '../../books/dto/create-book.dto';
import { BooksEntity } from '../../books/entities/books.entity';
import { Request } from 'express';
import { UpdateBookDTO } from 'books/dto/update-book.dto';
import { AuthGuard } from 'auth/guards/auth.guard';
import { RolesGuard } from 'auth/guards/roles.guard';
import { PublicAccess } from 'auth/decorators/public.decorator';
import { AdminAccess } from 'auth/decorators/admin.decorator';

@Controller('books')
@UseGuards(AuthGuard, RolesGuard)
export class BooksController {
    constructor(private booksService: BooksService){}

    //Es público
    @PublicAccess()
    //Maneja la solicitud get - Se utiliza para traer una lista de books
    @Get()
    getBooks(@Req() request: Request):Promise<BooksEntity[]>{
        return this.booksService.getBooks(request.query)
    }

    //Es público
    @PublicAccess()
    //Maneja la solicitud get - Se utiliza para traer una lista de books
    @Get(':id')
    getBook(@Param('id', ParseIntPipe) id: number):Promise<BooksEntity>{
        return this.booksService.getBook(id);
    }

    //Solo Admin
    @AdminAccess()
    //Maneja la solicitud post - Se utiliza para la creación de un book
    @Post()
    createBook(@Body()book: CreateBookDTO):Promise<BooksEntity>{
        return this.booksService.createBook(book);
    }

    //Solo Admin
    @AdminAccess()
    //Maneja la solicitud delete - Se utiliza para eliminar un book
    @Delete(':id')
    deleteBook(@Param('id', ParseIntPipe)id: number){
        return this.booksService.deleteBook(id);
    }

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

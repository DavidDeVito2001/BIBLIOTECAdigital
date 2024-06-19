import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { BooksService } from '../../books/services/books.service';
import { CreateBookDTO } from '../../books/dto/create-book.dto';
import { BooksEntity } from '../../books/entities/books.entity';
import { Request } from 'express';
import { UpdateBookDTO } from 'books/dto/update-book.dto';

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService){}

    //Maneja la solicitud get - Se utiliza para traer una lista de books
    @Get()
    getBooks(@Req() request: Request):Promise<BooksEntity[]>{
        return this.booksService.getBooks(request.query)
    }

    //Maneja la solicitud get - Se utiliza para traer una lista de books
    @Get(':id')
    getBook(@Param('id', ParseIntPipe) id: number):Promise<BooksEntity>{
        return this.booksService.getBook(id);
    }

    //Maneja la solicitud post - Se utiliza para la creación de un book
    @Post()
    createBook(@Body()book: CreateBookDTO):Promise<BooksEntity>{
        return this.booksService.createBook(book);
    }

    //Maneja la solicitud delete - Se utiliza para eliminar un book
    @Delete(':id')
    deleteBook(@Param('id', ParseIntPipe)id: number){
        return this.booksService.deleteBook(id);
    }

    //Maneja la solicitud patch - Se utiliza para actualizar los datos del book
    @Patch(':id')
    updatebook(
        @Param('id', ParseIntPipe)id: number,
        @Body() book: UpdateBookDTO
    ){
        return this.booksService.updateBook(id, book)
    }
}

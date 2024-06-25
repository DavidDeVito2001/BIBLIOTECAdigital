import { Module } from '@nestjs/common';
import { BooksController } from './controllers/books.controller';
import { BooksService } from './services/books.service';
import { BooksEntity } from './entities/books.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([BooksEntity]), UsersModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService, TypeOrmModule]
})
export class BooksModule {}

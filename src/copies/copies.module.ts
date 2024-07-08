import { Module } from '@nestjs/common';
import { CopiesController } from './controllers/copies.controller';
import { CopiesService } from './services/copies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CopiesEntity } from './entities/copies.entity';
import { BooksModule } from '../books/books.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[TypeOrmModule.forFeature([CopiesEntity]),BooksModule, UsersModule],
  controllers: [CopiesController],
  providers: [CopiesService],
  exports:[CopiesService,  TypeOrmModule]
})
export class CopiesModule {}

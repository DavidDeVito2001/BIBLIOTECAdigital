import { Module } from '@nestjs/common';
import { LoansController } from './controllers/loans.controller';
import { LoansService } from './services/loans.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoansEntity } from './entities/loans.entity';
import { CopiesEntity } from 'copies/entities/copies.entity';
import { UsersModule } from 'users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([LoansEntity, CopiesEntity]), UsersModule],
  controllers: [LoansController],
  providers: [LoansService],
  exports: [LoansService, TypeOrmModule]
})
export class LoansModule {}

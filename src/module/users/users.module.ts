import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from './entity/user.entity';
import { Documents } from '../document/entity/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Documents])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

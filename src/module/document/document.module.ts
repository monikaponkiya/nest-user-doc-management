import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documents } from './entity/document.entity';
import { Users } from '../users/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Documents, Users])],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}

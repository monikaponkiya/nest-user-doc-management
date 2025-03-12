import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Documents } from './entity/document.entity';
import { Repository } from 'typeorm';
import { CustomError } from 'src/common/helpers';
import {
  DOCUMENT_RESPONSE_MESSAGES,
  USER_RESPONSE_MESSAGES,
} from 'src/common/constants/response.constant';
import { UpdateDocumentDto } from './dto/update-document.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Users } from '../users/entity/user.entity';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Documents)
    private readonly documentRepository: Repository<Documents>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async uploadDocument(
    userId: number,
    file: Express.Multer.File,
    description?: string,
  ) {
    if (!file)
      throw CustomError(
        DOCUMENT_RESPONSE_MESSAGES.DOCUMENT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    const document = this.documentRepository.create({
      name: file.originalname,
      path: file.path,
      size: file.size,
      mimeType: file.mimetype,
      description,
      user: { id: userId },
    });

    return await this.documentRepository.save(document);
  }

  async updateDocument(
    documentId: number,
    updateData: UpdateDocumentDto,
    file?: Express.Multer.File,
  ) {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });
    if (!document)
      throw CustomError(
        DOCUMENT_RESPONSE_MESSAGES.DOCUMENT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    // If a new file is uploaded, replace the existing one
    if (file) {
      const uploadDir = path.join(__dirname, '..', '..', 'document');
      const oldFilePath = path.join(uploadDir, document.path);

      // Delete the old file
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      // Update document metadata
      document.path = file.filename;
      document.mimeType = file.mimetype;
      document.size = file.size;
    }

    // Update other metadata fields
    if (updateData.description) document.description = updateData.description;
    if (updateData.userId) {
      const user = await this.userRepository.findOne({
        where: { id: updateData.userId },
      });
      if (!user)
        throw CustomError(
          USER_RESPONSE_MESSAGES.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      document.user = user;
    }

    return this.documentRepository.save(document);
  }

  async getDocumentById(id: number) {
    const document = await this.documentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!document)
      throw CustomError(
        DOCUMENT_RESPONSE_MESSAGES.DOCUMENT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    return document;
  }

  async deleteDocument(id: number) {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document)
      throw CustomError(
        DOCUMENT_RESPONSE_MESSAGES.DOCUMENT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );

    const fs = require('fs');
    fs.unlinkSync(document.path);
    return this.documentRepository.softDelete({ id });
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Documents } from './entity/document.entity';
import { Repository } from 'typeorm';
import { CustomError } from 'src/common/helpers';
import { DOCUMENT_RESPONSE_MESSAGES } from 'src/common/constants/response.constant';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Documents)
    private readonly documentRepository: Repository<Documents>,
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

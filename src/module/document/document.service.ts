import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DOCUMENT_RESPONSE_MESSAGES } from 'src/common/constants/response.constant';
import { CustomError } from 'src/common/helpers';
import { Repository } from 'typeorm';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Documents } from './entity/document.entity';
import { ListDto } from 'src/common/dto/common.dto';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Documents)
    private readonly documentRepository: Repository<Documents>,
  ) {}

  async getAllDocuments(params: ListDto) {
    try {
      const queryBuilder =
        this.documentRepository.createQueryBuilder('document');
      if (params.search) {
        queryBuilder.where(
          'document.name LIKE :search OR document.description LIKE :search',
          { search: `%${params.search}%` },
        );
      }
      const totalQuery = queryBuilder.clone();

      // Apply pagination
      if (params.offset !== undefined && params.limit) {
        queryBuilder.skip(params.offset);
        queryBuilder.take(params.limit);
      }

      // Apply sorting
      if (params.sortOrder && params.sortBy) {
        queryBuilder.orderBy(
          `document.${params.sortBy}`,
          params.sortOrder === 'asc' ? 'ASC' : 'DESC',
        );
      } else {
        queryBuilder.orderBy('document.createdAt', 'DESC');
      }
      const documents = await queryBuilder.getMany();
      const recordsTotal = await totalQuery.getCount();
      return { result: documents, recordsTotal };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

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

    return this.documentRepository.save(document);
  }

  async getDocumentById(id: number) {
    const document = await this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.user', 'user')
      .select([
        'document.id',
        'document.name',
        'document.path',
        'document.size',
        'document.mimeType',
        'document.description',
        'user.id',
        'user.name',
      ])
      .where('document.id = :id', { id })
      .getOne();

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

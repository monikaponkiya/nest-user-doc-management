import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ListDto } from 'src/common/dto/common.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import * as fs from 'fs';
import * as path from 'path';
import { Documents } from './entity/document.entity';

jest.mock('fs');
const mockDocumentRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    clone: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([
      {
        id: 1,
        name: 'Doc1',
        path: 'path/to/doc1',
        size: 123,
        mimeType: 'application/pdf',
        description: 'Test Doc',
      },
      {
        id: 2,
        name: 'Doc2',
        path: 'path/to/doc2',
        size: 456,
        mimeType: 'application/pdf',
        description: 'Another Test',
      },
    ]),
    getCount: jest.fn().mockResolvedValue(2),
  })),
  softDelete: jest.fn(),
};

describe('DocumentService', () => {
  let service: DocumentService;
  let documentRepository: Repository<Documents>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Documents),
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    documentRepository = module.get<Repository<Documents>>(
      getRepositoryToken(Documents),
    );
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test Cases for Get Document
  it('should return document if found', async () => {
    const mockDocument = {
      id: 1,
      name: 'Test Doc',
      path: '/test/path',
      size: 12345,
      mimeType: 'application/pdf',
      description: 'Test Description',
      user: { id: 1, name: 'John' },
    };

    // Mock QueryBuilder methods
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(mockDocument),
    };

    documentRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(mockQueryBuilder);

    const result = await service.getDocumentById(1);

    expect(result).toEqual(mockDocument);
    expect(documentRepository.createQueryBuilder).toHaveBeenCalledWith(
      'document',
    );
    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      'document.user',
      'user',
    );
    expect(mockQueryBuilder.where).toHaveBeenCalledWith('document.id = :id', {
      id: 1,
    });
    expect(mockQueryBuilder.getOne).toHaveBeenCalled();
  });

  it('should throw an error if document not found', async () => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(null),
    };

    documentRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(mockQueryBuilder);

    await expect(service.getDocumentById(99)).rejects.toThrow(
      'Document not found',
    );

    expect(documentRepository.createQueryBuilder).toHaveBeenCalledWith(
      'document',
    );
    expect(mockQueryBuilder.getOne).toHaveBeenCalled();
  });

  // Test Cases for Get All Documents
  it('should return a list of documents with total records', async () => {
    const params: ListDto = {
      search: 'Test',
      offset: 0,
      limit: 10,
      sortBy: 'name',
      sortOrder: 'asc',
    };

    const mockDocuments = [
      {
        id: 1,
        name: 'Doc1',
        path: 'path/to/doc1',
        size: 123,
        mimeType: 'application/pdf',
        description: 'Test Doc',
      },
      {
        id: 2,
        name: 'Doc2',
        path: 'path/to/doc2',
        size: 456,
        mimeType: 'application/pdf',
        description: 'Another Test',
      },
    ];

    // Mock QueryBuilder methods
    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      clone: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockDocuments),
      getCount: jest.fn().mockResolvedValue(2),
    };

    documentRepository.createQueryBuilder = jest
      .fn()
      .mockReturnValue(mockQueryBuilder);

    const result = await service.getAllDocuments(params);

    expect(result).toEqual({ result: mockDocuments, recordsTotal: 2 });

    // Assertions for QueryBuilder calls
    expect(documentRepository.createQueryBuilder).toHaveBeenCalledWith(
      'document',
    );
    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'document.name LIKE :search OR document.description LIKE :search',
      { search: '%Test%' },
    );
    expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
    expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
      'document.name',
      'ASC',
    );
    expect(mockQueryBuilder.getMany).toHaveBeenCalled();
    expect(mockQueryBuilder.getCount).toHaveBeenCalled();
  });

  it('should return an empty array if no documents are found', async () => {
    mockDocumentRepository.createQueryBuilder = jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      clone: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
      getCount: jest.fn().mockResolvedValue(0),
    }));

    const params: ListDto = {
      search: '',
      offset: 0,
      limit: 10,
      sortBy: '',
      sortOrder: 'asc',
    };

    const result = await service.getAllDocuments(params);

    expect(result).toEqual({ result: [], recordsTotal: 0 });
  });

  it('should throw an error when the database query fails', async () => {
    mockDocumentRepository.createQueryBuilder = jest.fn(() => {
      throw new Error('Database error');
    });

    const params: ListDto = {
      search: '',
      offset: 0,
      limit: 10,
      sortBy: '',
      sortOrder: 'asc',
    };

    await expect(service.getAllDocuments(params)).rejects.toThrow(
      'Database error',
    );
  });

  // Test Cases for Update Document
  it('should update the document metadata without file upload', async () => {
    const documentId = 1;
    const updateData: UpdateDocumentDto = {
      description: 'Updated Description',
      file: '',
    };

    const existingDocument = {
      id: documentId,
      path: 'old-file.pdf',
      mimeType: 'application/pdf',
      size: 1024,
    };

    mockDocumentRepository.findOne.mockResolvedValue(existingDocument);
    mockDocumentRepository.save.mockResolvedValue({
      ...existingDocument,
      ...updateData,
    });

    const result = await service.updateDocument(documentId, updateData);

    expect(result).toEqual({ ...existingDocument, ...updateData });
    expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({
      where: { id: documentId },
    });
    expect(mockDocumentRepository.save).toHaveBeenCalled();
  });

  it('should update the document with new file and delete the old one', async () => {
    const documentId = 2;
    const updateData: UpdateDocumentDto = {
      description: 'New file uploaded',
      file: '',
    };
    const file: Express.Multer.File = {
      filename: 'new-file.pdf',
      mimetype: 'application/pdf',
      size: 2048,
      path: 'document/new-file.pdf',
      buffer: Buffer.from(''),
      fieldname: '',
      encoding: '',
      originalname: '',
      destination: '',
      stream: null as any,
    };

    const existingDocument = {
      id: documentId,
      path: 'old-file.pdf',
      mimeType: 'application/pdf',
      size: 1024,
    };

    mockDocumentRepository.findOne.mockResolvedValue(existingDocument);
    mockDocumentRepository.save.mockResolvedValue({
      ...existingDocument,
      ...updateData,
      path: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    });

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

    const result = await service.updateDocument(documentId, updateData, file);

    expect(result).toEqual({
      ...existingDocument,
      ...updateData,
      path: file.filename,
      mimeType: file.mimetype,
      size: file.size,
    });

    expect(fs.existsSync).toHaveBeenCalledWith(
      path.join(__dirname, '..', '..', 'document', 'old-file.pdf'),
    );
    expect(fs.unlinkSync).toHaveBeenCalled();
    expect(mockDocumentRepository.save).toHaveBeenCalled();
  });

  // Test cases for Delete Document
  it('should delete the document and remove the file', async () => {
    const documentId = 1;
    const existingDocument = { id: documentId, path: 'uploads/test-file.pdf' };

    mockDocumentRepository.findOne.mockResolvedValue(existingDocument);
    mockDocumentRepository.softDelete.mockResolvedValue({ affected: 1 });

    (fs.unlinkSync as jest.Mock).mockImplementation(() => {}); // Mock file deletion

    const result = await service.deleteDocument(documentId);

    expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({
      where: { id: documentId },
    });
    expect(fs.unlinkSync).toHaveBeenCalledWith(existingDocument.path);
    expect(mockDocumentRepository.softDelete).toHaveBeenCalledWith({
      id: documentId,
    });
    expect(result).toEqual({ affected: 1 });
  });

  it('should throw an error if the document is not found', async () => {
    const documentId = 2;

    mockDocumentRepository.findOne.mockResolvedValue(null);

    await expect(service.deleteDocument(documentId)).rejects.toThrow(
      'Document not found',
    );

    expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({
      where: { id: documentId },
    });
    expect(fs.unlinkSync).not.toHaveBeenCalled();
    expect(mockDocumentRepository.softDelete).not.toHaveBeenCalled();
  });

  it('should delete a document successfully', async () => {
    const documentId = 1;
    const existingDocument = {
      id: documentId,
      path: 'uploads/test-file.pdf',
    };

    mockDocumentRepository.findOne.mockResolvedValue(existingDocument);
    mockDocumentRepository.softDelete.mockResolvedValue({ affected: 1 });

    jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});

    const result = await service.deleteDocument(documentId);

    expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({
      where: { id: documentId },
    });
    expect(fs.unlinkSync).toHaveBeenCalledWith(existingDocument.path);
    expect(mockDocumentRepository.softDelete).toHaveBeenCalledWith({
      id: documentId,
    });
    expect(result).toEqual({ affected: 1 });
  });

  it('should handle file deletion failure gracefully', async () => {
    const documentId = 3;
    const existingDocument = {
      id: documentId,
      path: 'uploads/corrupt-file.pdf',
    };

    mockDocumentRepository.findOne.mockResolvedValue(existingDocument);
    mockDocumentRepository.softDelete.mockResolvedValue({ affected: 1 });

    jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {
      throw new Error('File deletion error');
    });

    await expect(service.deleteDocument(documentId)).rejects.toThrow(
      'File deletion error',
    );

    expect(mockDocumentRepository.findOne).toHaveBeenCalledWith({
      where: { id: documentId },
    });
    expect(fs.unlinkSync).toHaveBeenCalledWith(existingDocument.path);
    expect(mockDocumentRepository.softDelete).not.toHaveBeenCalled();
  });
});

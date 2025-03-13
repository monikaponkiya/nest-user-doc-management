import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Documents } from './entity/document.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: DocumentService;
  let mockDocumentRepository: Partial<
    Record<keyof Repository<Documents>, jest.Mock>
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Documents),
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();
    service = module.get<DocumentService>(DocumentService);
    controller = module.get<DocumentController>(DocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});

import { Controller, Get, Param, Post } from '@nestjs/common';
import { MockService } from './mock.service';

@Controller('mock')
export class MockController {
  constructor(private readonly mockService: MockService) {}

  @Post('ingest/:id')
  async startIngestion(@Param('id') id: number) {
    return this.mockService.ingestDocument(Number(id));
  }

  @Get('status/:id')
  async getStatus(@Param('id') id: number) {
    return this.mockService.getIngestionStatus(Number(id));
  }

  @Get('embedding/:id')
  async getEmbedding(@Param('id') id: number) {
    return this.mockService.getDocumentEmbedding(Number(id));
  }
}

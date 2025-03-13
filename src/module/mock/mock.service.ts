import { Injectable } from '@nestjs/common';

@Injectable()
export class MockService {
  private readonly ingestionStatus = new Map<number, string>();
  private readonly mockEmbeddings = new Map<number, number[]>();

  async ingestDocument(documentId: number): Promise<{ status: string }> {
    this.ingestionStatus.set(documentId, 'Processing');
    setTimeout(() => {
      this.ingestionStatus.set(documentId, 'Completed');
      this.mockEmbeddings.set(documentId, [0.1, 0.2, 0.3, 0.4]);
    }, 5000);
    return { status: 'Processing' };
  }

  async getIngestionStatus(documentId: number): Promise<{ status: string }> {
    const status = this.ingestionStatus.get(documentId) || 'Not Found';
    return { status };
  }

  async getDocumentEmbedding(
    documentId: number,
  ): Promise<{ embedding: number[] }> {
    const embedding = this.mockEmbeddings.get(documentId) || [];
    return { embedding };
  }

  async deleteDocumentData(documentId: number) {
    this.ingestionStatus.delete(documentId);
    this.mockEmbeddings.delete(documentId);
  }
}

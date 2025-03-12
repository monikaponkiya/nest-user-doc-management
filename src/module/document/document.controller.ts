import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/constants/enum.constant';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleGuard } from 'src/security/auth/guards/role.guard';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.options';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { DOCUMENT_RESPONSE_MESSAGES } from 'src/common/constants/response.constant';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('document')
@ApiTags('Documents')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RoleGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions()))
  @ApiConsumes('multipart/form-data')
  @ResponseMessage(DOCUMENT_RESPONSE_MESSAGES.DOCUMENT_UPLOAD)
  async documentUpload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(jpeg|jpg|png|pdf)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('userId') userId: number,
    @Body('description') description?: string,
  ) {
    return await this.documentService.uploadDocument(userId, file, description);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file', multerOptions()))
  @ApiConsumes('multipart/form-data')
  @ResponseMessage(DOCUMENT_RESPONSE_MESSAGES.DOCUMENT_UPDATE)
  async updateDocument(
    @Param('id') id: number,
    @Body() updateData: UpdateDocumentDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(jpeg|jpg|png|pdf)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.documentService.updateDocument(id, updateData, file);
  }

  @Get(':id')
  async getDocument(@Param('id') id: number) {
    return this.documentService.getDocumentById(id);
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: number) {
    return this.documentService.deleteDocument(id);
  }
}

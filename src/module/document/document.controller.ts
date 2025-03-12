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
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from 'src/common/constants/enum.constant';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleGuard } from 'src/security/auth/guards/role.guard';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './multer.options';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { DOCUMENT_RESPONSE_MESSAGES } from 'src/common/constants/response.constant';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Users } from '../users/entity/user.entity';
import { DOCUMENT } from 'src/common/constants/api.description.constant';
import { ListDto } from 'src/common/dto/common.dto';

@Controller('document')
@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(RoleGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('list')
  @ApiOperation({
    summary: DOCUMENT.FIND_ALL.summary,
    description: DOCUMENT.FIND_ALL.description,
  })
  @ResponseMessage(DOCUMENT_RESPONSE_MESSAGES.DOCUMENT_LIST)
  async findAll(@Body() listDto: ListDto) {
    return await this.documentService.getAllDocuments(listDto);
  }

  @Post('upload')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: DOCUMENT.UPLOAD.summary,
    description: DOCUMENT.UPLOAD.description,
  })
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
    @Body() body: CreateDocumentDto,
    @CurrentUser() user: Users,
  ) {
    return await this.documentService.uploadDocument(
      user.id,
      file,
      body.description,
    );
  }

  @Put('update/:id')
  @ApiOperation({
    summary: DOCUMENT.UPDATE.summary,
    description: DOCUMENT.UPDATE.description,
  })
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
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

  @Get('get/:id')
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  @ApiOperation({
    summary: DOCUMENT.FIND_BY_ID.summary,
    description: DOCUMENT.FIND_BY_ID.description,
  })
  async getDocument(@Param('id') id: number) {
    return this.documentService.getDocumentById(id);
  }

  @Delete('delete/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: DOCUMENT.DELETE.summary,
    description: DOCUMENT.DELETE.description,
  })
  async deleteDocument(@Param('id') id: number) {
    return this.documentService.deleteDocument(id);
  }
}

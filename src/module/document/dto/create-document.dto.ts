import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  description: string;

  @ApiProperty({ format: 'binary', type: 'string', required: true })
  file: string;
}

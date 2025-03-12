import { IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

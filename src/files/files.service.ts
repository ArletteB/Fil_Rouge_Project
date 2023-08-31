import { Injectable, UploadedFile, UseGuards } from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/guard/jwt-passport.guard';

@Injectable()
export class FilesService {
  private supabase: any;
  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('API_SUPABASE_URL'),
      this.configService.get<string>('API_SUPABASE'),
    );
  }

  @UseGuards(JwtAuthGuard)
  async uploadFile(@UploadedFile() file: any) {
    try {
      console.log('file', file.originalname);
      const filePath = Date.now() + '-' + file.originalname;

      console.log('file', file.originalname);

      const { data, error } = await this.supabase.storage
        .from('post')
        .upload(filePath, file.buffer);

      if (error) {
        throw new Error(error.message);
      }

      return { message: 'File uploaded successfully', metadata: data };
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  create(uploadFileDto: UploadFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, UploadFileDto: UploadFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}

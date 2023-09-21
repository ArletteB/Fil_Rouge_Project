import { Injectable, UploadedFile, UseGuards } from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guard/jwt-passport.guard';

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
}

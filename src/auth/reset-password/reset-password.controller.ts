import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { ResetPasswordService } from './reset-password.service';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post()
  async create(@Body() createResetPasswordDto: CreateResetPasswordDto) {
    return await this.resetPasswordService.create(createResetPasswordDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.resetPasswordService.remove(+id);
  }
}

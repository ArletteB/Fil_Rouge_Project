import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { ResetPasswordTokenService } from './reset-password.service';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(
    private readonly resetPasswordTokenService: ResetPasswordTokenService,
  ) {}

  @Post()
  async create(@Body() createResetPasswordDto: CreateResetPasswordDto) {
    return await this.resetPasswordTokenService.create(
      createResetPasswordDto.id,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.resetPasswordTokenService.remove(+id);
  }
}

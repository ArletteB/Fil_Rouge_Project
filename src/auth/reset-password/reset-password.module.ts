import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordEntity } from './entities/token-reset.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPasswordEntity, UserEntity])],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService, UserService],
})
export class ResetPasswordModule {}

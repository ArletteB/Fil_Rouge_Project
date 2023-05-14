import { Module } from '@nestjs/common';
import { ResetPasswordTokenService } from './reset-password.service';
import { ResetPasswordController } from './reset-password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordTokenEntity } from './entities/reset-token.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPasswordTokenEntity, UserEntity])],
  controllers: [ResetPasswordController],
  providers: [ResetPasswordTokenService, UserService],
})
export class ResetPasswordModule {}

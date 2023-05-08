import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy/passport-jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ResetPasswordEntity } from './reset-password/entities/token-reset.entity';
import { ResetPasswordService } from './reset-password/reset-password.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ResetPasswordEntity]),
    ConfigModule.forRoot(),
    UserModule,
    MailModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '90s' },
    }),
    ResetPasswordModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailService, ResetPasswordService],
  exports: [AuthService],
})
export class AuthModule {}

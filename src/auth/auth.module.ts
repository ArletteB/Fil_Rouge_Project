import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy/passport-jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ResetPasswordTokenEntity } from './reset-password/entities/reset-password-token.entity';
import { ResetPasswordTokenService } from './reset-password/reset-password-token.service';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordTokenModule } from './reset-password/reset-password-token.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, ResetPasswordTokenEntity]),
    ConfigModule.forRoot(),
    UserModule,
    MailModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '90s' },
    }),
    ResetPasswordTokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailService, ResetPasswordTokenService],
  exports: [AuthService],
})
export class AuthModule {}

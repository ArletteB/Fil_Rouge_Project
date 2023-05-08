import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordService } from './reset-password/reset-password.service';

import { CreateResetPasswordDto } from './reset-password/dto/create-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private resetPasswordService: ResetPasswordService,
    private mailService: MailService,
  ) {}

  async validateUser(signinAuthDto: SigninAuthDto) {
    const user = await this.userService.findOneByEmail(signinAuthDto.email);
    const validPassword = await bcrypt.compare(
      signinAuthDto.password,
      user.password,
    );
    if (user && validPassword) {
      // TODO:  Cacher le password plutard
      const { password, ...result } = user;
      return result;
    } else {
      throw new Error('Invalid email or password');
    }
  }

  generateJwtToken(payload) {
    return this.jwtService.sign(payload);
  }

  signup(signupAuthDto: SignupAuthDto) {
    // signup => s'inscrire
    return this.userService.create(signupAuthDto);
  }

  async signin(signinAuthDto: SigninAuthDto) {
    // signin => se connecter
    const user = await this.validateUser(signinAuthDto);
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.generateJwtToken(payload),
    };
  }

  async forgotPassword(createResetPasswordDto: CreateResetPasswordDto) {
    const token = await this.resetPasswordService.create(
      createResetPasswordDto,
    );

    const url = `http://localhost:3000/auth/reset-password/${token}`;
    const message = `Click here to reset your password: <a href="${url}">${url}</a>`;
    await this.mailService.sendEmail(
      createResetPasswordDto.email,
      'Reset Password',
      message,
    );
    return {
      message: 'Reset password link sent successfully',
    };

    // this.mailService.create({
    //   to: createResetPasswordDto.email,
    //   subject: 'Reset password',
    //   // template: 'reset-password',
    //   html: `<a href="http://localhost:3000/auth/reset-password/${token}">Reset password</a>`,
    // });
    // return `Password reset link sent to ${createResetPasswordDto.email}`;
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    const resetPassword = await this.resetPasswordService.findOne(token);
    if (!resetPassword) {
      throw new BadRequestException('Invalid token');
    }
    const user = await this.userService.findOneByEmail(
      resetPassword.user.email,
    );
    if (!user) {
      throw new BadRequestException('Invalid token');
    }
    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 12);

    // await this.userService.update(user.id, { password: hashedPassword });
    // return {
    //   message: 'Password updated successfully',
    // };

    await this.resetPasswordService.remove(resetPassword.id);
    return await this.userService.update(user.id, { password: hashedPassword });
  }
}

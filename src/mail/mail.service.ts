import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  public async sendSignupMail(reciever: string) {
    await this.mailerService.sendMail({
      to: reciever,
      from: this.configService.get('MAIL_FROM'),
      subject: 'Welcome to Travel Tailor',
      text: 'welcome',
      html: `<div>
      <p>Welcome to Travel tailor your account has been successfully created</p>
      </div>`,
    });
  }

  public async sendForgotPasswordMail(reciever: string, resetLink: string) {
    await this.mailerService.sendMail({
      to: reciever,
      from: process.env.MAILER_EMAIL,
      subject: 'Reset password demand',
      text: 'welcome',
      html: `<div>
      <p>You have send demand to reset your password</p>
      <a href="${resetLink}}">Reset your password here</a>
      </div>`,
    });
  }

  public async sendConfirmResetPasswordMail(reciever: string) {
    await this.mailerService.sendMail({
      to: reciever,
      from: this.configService.get('MAILER_EMAIL'),
      subject: 'Your password has been reset',
      text: 'welcome',
      html: `<div>
      <p>Your password has been successfully reset</p>
      </div>`,
    });
  }

  public async sendInvoiceMail(
    reciever: string,
    attachement: { filename: string; content: Buffer },
  ) {
    await this.mailerService.sendMail({
      to: reciever,
      from: this.configService.get('MAILER_EMAIL'),
      subject: 'Your invoice',
      text: 'welcome',
      attachments: [attachement],
      html: `<div>
      <p>Your invoice for your trip</p>
      </div>`,
    });
  }
}

// import { MailerService } from '@nestjs-modules/mailer';
// import { Injectable } from '@nestjs/common';
// import { UserEntity } from 'src/user/entities/user.entity';
// import * as nodemailer from 'nodemailer';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class MailService {
//   // sendEmail(email: string, arg1: string, message: string) {
//   //   throw new Error('Method not implemented.');
//   // }
//   constructor(
//     private mailerService: MailerService,
//     private configService: ConfigService,
//   ) {}

//   async ForgotPasswordSendMail(reciever: string, resetLink: string) {
//     await this.mailerService.sendMail({
//       to: reciever,
//       from: this.configService.get('MAIL_FROM'),
//       subject: 'Reset Password',
//       // template: './forgot-password',
//       text: 'Reset your Password',
//       html: ` <p>You have send demand to reset your password</p>
//       <a href="${resetLink}}">Reset your password here</a>`,
//     });
//   }

//   // async sendUserConfirmation(user: UserEntity, token: string) {
//   //   const url = `example.com/auth/confirm?token=${token}`;

//   //   await this.mailerService.sendMail({
//   //     to: user.email,
//   //     // from: '"Support Team" <support@example.com>', // override default from
//   //     subject: 'Welcome to Nice App! Confirm your Email',
//   //     template: './confirmation', // `.hbs` extension is appended automatically
//   //     context: {
//   //       // ✏️ filling curly brackets with content
//   //       name: user.lastName,
//   //       url,
//   //     },
//   //   });
//   // }
//   // createTransporter() {
//   //   return nodemailer.createTransport({
//   //     service: 'localhost',
//   //     // port: process.env.MAILDEV_SMTP_PORT,
//   //     secure: false,
//   //     // host: process.env.SMTP_HOST,
//   //     // auth: {
//   //     //   user: process.env.SMTP_USER,
//   //     //   pass: process.env.SMTP_PASSWORD,
//   //     // },
//   //   });
//   // }

//   // async create() {
//   //   const transporter = this.createTransporter();
//   //   const mailOptions = {
//   //     from: 'vosin@gmail.com',
//   //     to: 'testtonvoisin',
//   //     subject: 'test',
//   //     html: '<h1>test</h1>',
//   //   };
//   //   transporter.sendMail(mailOptions, (err, info) => {
//   //     if (err) {
//   //       console.log(err);
//   //     } else {
//   //       console.log('Email sent:' + info.response);
//   //     }
//   //   });
//   // }
// }

import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  subjectVerificationEmail,
  subjectRecoveryPassword,
  textVerificationEmail,
  textRecoveryPassword,
  subjectFeedBack,
  textFeedBack,
} from '@/const/email';
import { User } from '@/modules/user/entities/user.entity';
import { Secret } from '@/modules/secret/entities/secret.entity';
import { SubmitFormDto } from '@/modules/email/dto/submit-form.dto';

@Injectable()
export class EmailService {
  private transporter;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Secret) private readonly secretRepository: Repository<Secret>,
  ) {
    this.transporter = createTransport({
      host: 'smtpout.secureserver.net',
      port: 587,
      secure: false,
      auth: {
        user: 'contact@dom.com',
        pass: 'Pass1234',
      },
    });
  }

  async generateCode() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async sendEmail(recipient: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: 'contact@dom.com',
        to: recipient,
        subject,
        html: text,
      });
      return info.messageId;
    } catch (error) {
      throw new Error(`Ошибка при отправке сообщения: ${error}`);
    }
  }

  async sendEmailSubmit(recipient: string, subject: string, text: string) {
    try {
      const info = await this.transporter.sendMail({
        from: recipient,
        to: 'contact@dom.com',
        subject,
        html: text,
      });
      return info.messageId;
    } catch (error) {
      throw new Error(`Ошибка при отправке сообщения: ${error}`);
    }
  }

  async checkUser(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async sendCodeRegistration(email: string) {
    const code = await this.generateCode();
    const subject: string = subjectVerificationEmail;
    const text = textVerificationEmail(code);

    await this.sendEmail(email, subject, text);

    return code;
  }

  async submitForm(submitFormDto: SubmitFormDto) {
    const subject: string = subjectFeedBack;
    const text = textFeedBack(submitFormDto);

    await this.sendEmailSubmit(submitFormDto.email, subject, text);

    return { message: 'Successful' };
  }

  async sendCode(email: string) {
    const user = await this.checkUser(email);
    const code = await this.generateCode();

    const subject: string = subjectVerificationEmail;
    const text = textVerificationEmail(code);

    await this.secretRepository.update(user.secret.id, {
      code: code,
    });

    await this.sendEmail(email, subject, text);

    throw new HttpException(`Код подтверждения отправлен`, HttpStatus.OK);
  }

  async sendCodeForPassword(email: string) {
    const uniq = Array(25)
      .fill(null)
      .map(() => Math.round(Math.random() * 25).toString(25))
      .join('');

    const user = await this.checkUser(email);

    const code = await this.generateCode();
    const subject: string = subjectRecoveryPassword;

    const text = textRecoveryPassword(code, uniq);

    await this.secretRepository.update(user.secret.id, {
      code: code,
    });

    await this.sendEmail(email, subject, text);

    throw new HttpException(`Код подтверждения отправлен`, HttpStatus.OK);
  }

  async verifyCodeByPassword(email: string, code: number, attempt: number) {
    const user = await this.checkUser(email);

    if (user.secret.code === code) {
      await this.secretRepository.update(user.secret.id, {
        code: null,
      });
      return 'Successful';
    } else {
      if (attempt === 3) {
        await this.secretRepository.update(user.secret.id, {
          code: null,
        });
        throw new HttpException(
          `Код подтверждения неверный, количество попыток исчерпано, попробуйте позже`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(`Код подтверждения неверный`, HttpStatus.BAD_REQUEST);
    }
  }
}

import { Controller, Post, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { EmailService } from '@/modules/email/email.service';
import { ResetPasswordDto } from '@/modules/email/dto/reset-password.dto';
import { SendCodeDto } from '@/modules/email/dto/send-code.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubmitFormDto } from '@/modules/email/dto/submit-form.dto';

@ApiTags('email')
@Controller('email')
export class EmailActionsController {
  constructor(private readonly emailService: EmailService) {}

  @ApiOperation({ summary: 'Отправка кода на почту при регистрации' })
  @Post('send-code-registration')
  async sendCodeRegistration(@Body() sendCodeDto: SendCodeDto) {
    return await this.emailService.sendCodeRegistration(sendCodeDto.email);
  }

  @ApiOperation({ summary: 'Отправка кода на почту' })
  @Post('send-code-by-email')
  async sendCode(@Body() sendCodeDto: SendCodeDto) {
    return await this.emailService.sendCode(sendCodeDto.email);
  }

  @ApiOperation({ summary: 'Отправка заявки' })
  @Post('submit-form')
  @UsePipes(new ValidationPipe())
  async submitForm(@Body() submitFormDto: SubmitFormDto) {
    return await this.emailService.submitForm(submitFormDto);
  }

  @ApiOperation({ summary: 'Отправка кода на почту при восстановлении пароля' })
  @Post('send-code-reset-pass')
  async sendCodeRecoveryPass(@Body() sendCodeDto: SendCodeDto) {
    return await this.emailService.sendCodeForPassword(sendCodeDto.email);
  }

  @ApiOperation({ summary: 'Проверка кода' })
  @Post('/verify-code-reset-pass/:attempt')
  async verifyCode(
    @Param() { attempt }: { attempt: string },
    @Body()
    resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.emailService.verifyCodeByPassword(
      resetPasswordDto.email,
      +resetPasswordDto.code,
      +attempt,
    );
  }
}

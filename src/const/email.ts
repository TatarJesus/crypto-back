import { SubmitFormDto } from '@/modules/email/dto/submit-form.dto';

export const subjectVerificationEmail = 'Подтверждение почты';
export const subjectRecoveryPassword = 'Восстановление пароля';
export const subjectFeedBack = 'Crypto - active';
export const textVerificationEmail = (code: number) => {
  return `<p>Здравствуйте,</p>
    <p>Чтобы удостовериться, что почта принадлежит Вам, введите в дальнейшей форме регистрации в поле "Инвайт-код" данный код: <b>${code}</b>.</p> 
    <p>Если у вас возникнут какие-либо проблемы при входе в свою учетную запись, свяжитесь с нами по адресу example@gmail.com.</p>`;
};

export const textRecoveryPassword = (code: number, uniq: string) => {
  return `<p>Здравствуйте,<br>
    для восстановления пароля Вам выслан код: <b>${code}</b>`;
};

export const textFeedBack = (submitFormDto: SubmitFormDto) => {
  return `<p>Контакты отправителя:</p>
    <p>Имя: ${submitFormDto.name}</p>
    <p>Почта: ${submitFormDto.email}</p>
    <br>
    <p>Сообщение:</p>
    <p>${submitFormDto.text}</p>`;
};

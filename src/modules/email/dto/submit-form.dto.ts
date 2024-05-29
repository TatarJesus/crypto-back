import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SubmitFormDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}

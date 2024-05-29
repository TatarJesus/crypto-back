import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import {
  MIN_1_UPPER_LETTER,
  ONLY_LATIN_CHARACTERS_AND_SPECIAL_SYMBOLS,
} from '@/const/regularExpressions';
import { MIN_LENGTH_PASSWORD } from '@/const/password';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_LENGTH_PASSWORD, { message: 'The password must contain more than 8 characters.' })
  @Matches(MIN_1_UPPER_LETTER, {
    message: 'The password must contain at least 1 uppercase letter',
  })
  @Matches(ONLY_LATIN_CHARACTERS_AND_SPECIAL_SYMBOLS, {
    message:
      'The password may contain only Latin characters and special symbols: !, ?, @, #, $, %, ^, &, *, (, )',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;
}

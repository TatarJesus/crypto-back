import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { MIN_LENGTH_PASSWORD } from '@/const/password';
import {
  MIN_1_UPPER_LETTER,
  ONLY_LATIN_CHARACTERS_AND_SPECIAL_SYMBOLS,
} from '@/const/regularExpressions';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  old_password: string;

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
}

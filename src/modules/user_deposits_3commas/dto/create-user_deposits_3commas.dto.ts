import { IsNotEmpty, IsString } from 'class-validator';
import { PLATFORMS_TYPE } from '@/types/deposits';

export class CreateUserDeposits3CommasDto {
  @IsNotEmpty()
  @IsString()
  platform: PLATFORMS_TYPE;

  @IsNotEmpty()
  @IsString()
  api_key: string;

  @IsNotEmpty()
  @IsString()
  secret_key: string;
}

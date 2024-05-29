import { Controller } from '@nestjs/common';
import { SecretService } from '@/modules/secret/secret.service';

@Controller('secrets')
export class SecretController {
  constructor(private readonly secretService: SecretService) {}
}

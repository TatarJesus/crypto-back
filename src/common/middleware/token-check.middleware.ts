import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as process from 'process';
import { TokenPaymentException } from '@/common/exception/token-payment.exception';

export class TokenCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['token'] !== process.env.token) {
      throw new TokenPaymentException();
    }
    next();
  }
}

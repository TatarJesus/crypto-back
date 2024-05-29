import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { checkPassword } from '@/const/password';
import { User } from '@/modules/user/entities/user.entity';
import { UserTokenInfo } from '@/types/request';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from '@/modules/user/dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Secret } from '@/modules/secret/entities/secret.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly lifeTimeRefreshToken: number;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(Secret) private readonly secretRepository: Repository<Secret>,
  ) {
    this.lifeTimeRefreshToken = this.configService.get('LIFETIME_REFRESH_TOKEN');
  }

  async registerTokens(user: User | UserTokenInfo) {
    const newData = await this.userService.findOneById(user.id);
    const payload = {
      id: user.id,
      email: newData.email,
    };

    const refreshToken = this.jwtService.sign(
      { id: user.id },
      { expiresIn: this.lifeTimeRefreshToken },
    );

    const userSecret = await this.userService.findOneById(user.id);

    await this.secretRepository.update(userSecret.secret.id, {
      refresh_token: refreshToken,
    });

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: refreshToken,
    };
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.findOne(loginUserDto.email.toLowerCase());

    if (!user) throw new BadRequestException('There is no user with this email address');

    if (!(await checkPassword(loginUserDto.password, user.secret.password)))
      throw new BadRequestException('Invalid password, try again');

    return user;
  }

  async login(user: UserTokenInfo) {
    return this.registerTokens(user);
  }

  async refreshToken(user: UserTokenInfo, token: string) {
    const userRefresh = await this.userService.findOneById(user.id);

    if (userRefresh.secret.refresh_token !== token.replace('Bearer ', '')) {
      throw new BadRequestException('Invalid refresh token');
    }

    return this.registerTokens(user);
  }
}

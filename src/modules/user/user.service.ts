import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '@/modules/user/dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Secret } from '@/modules/secret/entities/secret.entity';
import { RecoveryPasswordDto } from '@/modules/user/dto/recovery-password.dto';
import { ChangePasswordDto } from '@/modules/user/dto/change-password.dto';
import { checkPassword, hashPassword } from '@/const/password';
import { ReqUser } from '@/types/request';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, scryptSync } from 'crypto';
import { UpdateUserInfoDto } from '@/modules/user/dto/update-user-info.dto';

@Injectable()
export class UserService {
  private readonly lifeTimeRefreshToken: number;
  private readonly algorithmCrypt: string;
  private readonly key: Buffer;
  private readonly iv: Buffer;

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Secret) private readonly secretRepository: Repository<Secret>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.lifeTimeRefreshToken = this.configService.get('LIFETIME_REFRESH_TOKEN');

    this.algorithmCrypt = this.configService.get('ALGORITHM_CRYPT');
    const password = this.configService.get('PASSWORD');
    const salt = this.configService.get('SALT');
    const keyLen = +this.configService.get('KEY_LEN');
    const bufferSize = +this.configService.get('BUFFER_SIZE');

    this.key = scryptSync(password, salt, keyLen);
    this.iv = Buffer.alloc(bufferSize, 0);
  }

  async registerTokens(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const refreshToken = this.jwtService.sign(
      { id: user.id },
      { expiresIn: this.lifeTimeRefreshToken },
    );

    const cipherRefreshToken = createCipheriv(this.algorithmCrypt, this.key, this.iv);

    const encryptedRefreshToken =
      cipherRefreshToken.update(refreshToken, 'utf8', 'hex') + cipherRefreshToken.final('hex');

    const userSecret = await this.findOneById(user.id);

    await this.secretRepository.update(userSecret.secret.id, {
      refresh_token: encryptedRefreshToken,
    });

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: refreshToken,
    };
  }

  async getProfile(email: string, relations: string[]): Promise<User> {
    return await this.userRepository.findOne({
      relations: relations,
      where: {
        email: email,
      },
    });
  }

  async getProfileById(userId: number, relations: string[]): Promise<User> {
    return await this.userRepository.findOne({
      relations: relations,
      where: {
        id: userId,
      },
    });
  }

  async register(registerUserDto: RegisterUserDto) {
    const email = registerUserDto.email.toLowerCase();

    const existUserEmail = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (existUserEmail) throw new BadRequestException('This email already exist');

    const [hash, salt] = await hashPassword(registerUserDto.password);

    const secret_user = await this.secretRepository.save({
      old_password: hash,
      password: hash,
      salt: salt,
    });

    const user = await this.userRepository.save({
      ...registerUserDto,
      email: email,
      secret: secret_user,
    });

    return await this.registerTokens(user);
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      relations: ['secret'],
      where: {
        email: email,
      },
    });
  }

  async findOneById(userId: number) {
    return await this.userRepository.findOne({
      relations: ['secret'],
      where: {
        id: userId,
      },
    });
  }

  async getAccount(email: string) {
    const user = await this.getProfile(email, ['documents', 'notifications']);
    const notify = user.notifications.filter((item) => !item.check);

    return {
      ...user,
      notify: notify.length !== 0,
    };
  }

  async updateAccount(user_id: number, updateUserInfoDto: UpdateUserInfoDto) {
    const user = await this.getProfileById(user_id, []);

    const existsUserEmail = await this.userRepository.find({
      where: {
        email: user.email,
      },
    });

    const existUserEmailNotUser = existsUserEmail.filter((item) => item.id !== user.id);

    if (existUserEmailNotUser.length !== 0)
      throw new BadRequestException('This email already exist');

    await this.userRepository.update(user.id, {
      first_name: updateUserInfoDto.first_name,
      last_name: updateUserInfoDto.last_name,
      email: updateUserInfoDto.email,
    });

    return 'Successful';
  }

  async getDeposits(email: string) {
    return await this.getProfile(email, ['deposits_3commas']);
  }

  async recoveryPassword(recoveryPasswordDto: RecoveryPasswordDto) {
    const user = await this.userRepository.findOne({
      relations: ['secret'],
      where: {
        email: recoveryPasswordDto.email,
      },
    });
    if (!user) throw new BadRequestException('This email already exist');

    const [hash, salt] = await hashPassword(recoveryPasswordDto.password);

    await this.secretRepository.update(user.secret.id, {
      old_password: hash,
      password: hash,
      salt: salt,
    });

    return await this.registerTokens(user);
  }

  async changePassword(req: Request & ReqUser, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({
      relations: ['secret'],
      where: {
        email: req.user.email,
      },
    });

    if (!(await checkPassword(changePasswordDto.old_password, user.secret.password)))
      throw new BadRequestException('The old password is incorrect');

    const hash = await hashPassword(changePasswordDto.password, user.secret.salt);

    await this.secretRepository.update(user.secret.id, {
      old_password: user.secret.password,
      password: hash[0],
    });

    return await this.registerTokens(user);
  }
}

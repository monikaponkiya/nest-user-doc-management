import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto, LoginDto } from '../../common/dto/common.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Users } from 'src/module/users/entity/user.entity';
import { CreateUserDto } from 'src/module/users/dto/create-user.dto';
import { AuthExceptions, CustomError } from 'src/common/helpers';
import { UsersService } from 'src/module/users/users.service';
import { hash, compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async register(params: CreateUserDto) {
    return this.userService.create(params);
  }

  // Create initial admin user when app start
  async createInitialUser(): Promise<void> {
    const user = await this.userRepository.findOne({
      where: [
        {
          email: this.configService.get('database.initialUser.email'),
        },
      ],
    });

    if (user) {
      console.log('Initial user already loaded.');
    } else {
      const params: CreateUserDto = {
        name: this.configService.get('database.initialUser.name'),
        role: this.configService.get('database.initialUser.role'),
        email: this.configService.get('database.initialUser.email'),
        password: await hash(
          this.configService.get('database.initialUser.password'),
          10,
        ),
      };
      await this.userRepository.save(params);
      console.log('Initial user loaded successfully.');
    }
  }

  // User login api
  async login(params: LoginDto) {
    const user = await this.userRepository.findOneBy({
      email: params.email,
    });

    if (!user) {
      throw AuthExceptions.AccountNotExist();
    }
    if (!(await compareSync(params.password, user.password))) {
      throw AuthExceptions.InvalidIdPassword();
    }
    delete user.password;
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_TOKEN_SECRET,
        expiresIn: process.env.JWT_TONE_EXPIRY_TIME,
      }),
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  // user change password api
  async changePassword(body: ChangePasswordDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: body.id });
      if (!user) {
        throw AuthExceptions.AccountNotExist();
      }
      const isPasswordMatch = await compareSync(
        body.currentPassword,
        user.password,
      );
      if (!isPasswordMatch) {
        throw AuthExceptions.InvalidIdPassword();
      }
      user.password = await hash(body.newPassword, 10);
      await this.userRepository.save(user);
      return {};
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }
}

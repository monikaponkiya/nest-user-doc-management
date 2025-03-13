import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/module/users/dto/create-user.dto';
import { UserRole } from 'src/common/constants/enum.constant';
import { UsersService } from 'src/module/users/users.service';
import { Users } from '../../module/users/entity/user.entity';
import { ChangePasswordDto, LoginDto } from 'src/common/dto/common.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthExceptions } from 'src/common/helpers';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

const mockUserService = {
  getUserByEmail: jest.fn(),
  create: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let mockConfigService = { get: jest.fn().mockReturnValue('test-secret') };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UsersService, useValue: mockUserService },
        { provide: getRepositoryToken(Users), useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test cases for register user
  it('should register a new user successfully', async () => {
    const mockUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword',
      role: UserRole.EDITOR,
    };

    mockUserService.getUserByEmail.mockResolvedValue(null);
    mockUserService.create.mockResolvedValue({ id: 1, ...mockUserDto });

    const result = await service.register(mockUserDto);

    expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(
      'john@example.com',
    );
    expect(mockUserService.create).toHaveBeenCalledWith(mockUserDto);
    expect(result).toEqual({ id: 1, ...mockUserDto });
  });

  it('should throw an error if user already exists', async () => {
    const mockUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword',
      role: UserRole.EDITOR,
    };

    mockUserService.getUserByEmail.mockResolvedValue({ id: 1, ...mockUserDto });

    await expect(service.register(mockUserDto)).rejects.toThrow(
      'User already exist',
    );

    expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(
      'john@example.com',
    );
    expect(mockUserService.create).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors and throw CustomError', async () => {
    const mockUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword',
      role: UserRole.EDITOR,
    };

    mockUserService.getUserByEmail.mockRejectedValue(
      new Error('Database error'),
    );

    await expect(service.register(mockUserDto)).rejects.toThrow(
      'Database error',
    );
  });

  // Test cases for login method
  it('should throw AccountNotExist exception if user does not exist', async () => {
    const loginDto: LoginDto = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    mockUserService.findOneBy.mockResolvedValue(null);

    await expect(service.login(loginDto)).rejects.toThrow(
      AuthExceptions.AccountNotExist(),
    );
    expect(mockUserService.findOneBy).toHaveBeenCalledWith({
      email: loginDto.email,
    });
  });

  it('should throw InvalidIdPassword exception if password is incorrect', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: '$2a$10$hashedpassword',
      role: UserRole.EDITOR,
    };

    const loginDto: LoginDto = {
      email: 'john@example.com',
      password: 'wrongpassword',
    };

    mockUserService.findOneBy.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

    await expect(service.login(loginDto)).rejects.toThrow(
      AuthExceptions.InvalidIdPassword(),
    );
    expect(mockUserService.findOneBy).toHaveBeenCalledWith({
      email: loginDto.email,
    });
    expect(bcrypt.compareSync).toHaveBeenCalledWith(
      loginDto.password,
      mockUser.password,
    );
  });

  it('should handle unexpected errors and throw CustomError', async () => {
    const loginDto: LoginDto = {
      email: 'john@example.com',
      password: 'password123',
    };

    mockUserService.findOneBy.mockRejectedValue(new Error('Database error'));

    await expect(service.login(loginDto)).rejects.toThrow('Database error');
  });

  // Test cases for change password

  it('should throw AccountNotExist exception if user does not exist', async () => {
    const changePasswordDto: ChangePasswordDto = {
      id: 999,
      currentPassword: 'oldpassword',
      newPassword: 'newpassword123',
    };

    mockUserService.findOneBy.mockResolvedValue(null);

    await expect(service.changePassword(changePasswordDto)).rejects.toThrow(
      AuthExceptions.AccountNotExist(),
    );
    expect(mockUserService.findOneBy).toHaveBeenCalledWith({
      id: changePasswordDto.id,
    });
  });

  it('should throw InvalidIdPassword exception if current password is incorrect', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: '$2b$10$hashedpassword',
      role: UserRole.EDITOR,
    };

    const changePasswordDto: ChangePasswordDto = {
      id: 1,
      currentPassword: 'wrongpassword',
      newPassword: 'newpassword123',
    };

    mockUserService.findOneBy.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

    await expect(service.changePassword(changePasswordDto)).rejects.toThrow(
      AuthExceptions.InvalidIdPassword(),
    );
    expect(mockUserService.findOneBy).toHaveBeenCalledWith({
      id: changePasswordDto.id,
    });
    expect(bcrypt.compareSync).toHaveBeenCalledWith(
      changePasswordDto.currentPassword,
      mockUser.password,
    );
  });

  it('should handle unexpected errors and throw CustomError', async () => {
    const changePasswordDto: ChangePasswordDto = {
      id: 1,
      currentPassword: 'oldpassword',
      newPassword: 'newpassword123',
    };

    mockUserService.findOneBy.mockRejectedValue(new Error('Database error'));

    await expect(service.changePassword(changePasswordDto)).rejects.toThrow(
      'Database error',
    );
  });
});

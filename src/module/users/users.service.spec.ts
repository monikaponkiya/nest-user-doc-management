import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRole } from 'src/common/constants/enum.constant';
import { ListDto } from 'src/common/dto/common.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entity/user.entity';
import { UsersService } from './users.service';

const mockUserRepository = {
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'editor' },
    ]),
    getCount: jest.fn().mockResolvedValue(2),
    clone: jest.fn().mockReturnThis(),
  })),
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  softDelete: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(Users), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test Cases for find all users
  it('should return a list of users with total count', async () => {
    const params: ListDto = {
      search: '',
      offset: 0,
      limit: 10,
      sortBy: '',
      sortOrder: 'desc',
    };
    const result = await service.findAll(params);

    expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('user');
    expect(result).toEqual({
      result: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'editor' },
      ],
      recordsTotal: 2,
    });
  });

  // Test Cases for Create User

  it('should handle errors and throw CustomError', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: UserRole.ADMIN,
    };
    jest
      .spyOn(service, 'getUserByEmail')
      .mockRejectedValue(new Error('Database error'));
    await expect(service.create(createUserDto)).rejects.toThrow(
      'Database error',
    );
  });

  // Test cases for get user
  it('should return a user when found', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };

    mockUserRepository.findOneBy.mockResolvedValue(mockUser);

    const result = await service.findOne(1);

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockUser);
  });

  it('should throw an error if user is not found', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow('User not found');

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should handle unexpected errors and throw CustomError', async () => {
    mockUserRepository.findOneBy.mockRejectedValue(new Error('Database error'));

    await expect(service.findOne(1)).rejects.toThrow('Database error');
  });

  // Test cases for update user
  it('should update the user successfully', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: UserRole.ADMIN,
    };
    const updateData: UpdateUserDto = {
      name: 'John Updated',
      role: UserRole.ADMIN,
    };
    const updatedUser = { ...mockUser, ...updateData };

    mockUserRepository.findOneBy.mockResolvedValue(mockUser);
    mockUserRepository.save.mockResolvedValue(updatedUser);

    const result = await service.update(1, updateData);

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockUserRepository.save).toHaveBeenCalledWith({
      id: 1,
      ...updateData,
    });
    expect(result).toEqual(updatedUser);
  });

  it('should handle unexpected errors and throw CustomError', async () => {
    mockUserRepository.findOneBy.mockRejectedValue(new Error('Database error'));

    await expect(
      service.update(1, { name: 'Error Case', role: UserRole.ADMIN }),
    ).rejects.toThrow('Database error');
  });

  // Test cases for delete user

  it('should remove the user successfully', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };

    mockUserRepository.findOneBy.mockResolvedValue(mockUser);
    mockUserRepository.softDelete.mockResolvedValue({ affected: 1 });

    const result = await service.remove(1);

    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockUserRepository.softDelete).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual({ affected: 1 });
  });

  it('should handle unexpected errors and throw CustomError', async () => {
    mockUserRepository.findOneBy.mockRejectedValue(new Error('Database error'));

    await expect(service.remove(1)).rejects.toThrow('Database error');
  });
});

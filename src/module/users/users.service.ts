import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { USER_RESPONSE_MESSAGES } from 'src/common/constants/response.constant';
import { ListDto } from 'src/common/dto/common.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomError } from 'src/common/helpers';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async getUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const isUserExist = await this.getUserByEmail(createUserDto.email);
      if (isUserExist) {
        throw CustomError(
          USER_RESPONSE_MESSAGES.USER_ALREADY_EXIST,
          HttpStatus.NOT_FOUND,
        );
      }
      createUserDto.password = await hash(createUserDto.password, 10);
      const user = this.userRepository.create(createUserDto);
      const createdUser = await this.userRepository.save(user);
      delete createdUser.password;
      return createdUser;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findAll(params: ListDto) {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');
      if (params.search) {
        queryBuilder.where(
          'user.name LIKE :search OR user.email LIKE :search',
          { search: `%${params.search}%` },
        );
      }
      const totalQuery = queryBuilder.clone();

      // Apply pagination
      if (params.offset !== undefined && params.limit) {
        queryBuilder.skip(params.offset);
        queryBuilder.take(params.limit);
      }

      // Apply sorting
      if (params.sortOrder && params.sortBy) {
        queryBuilder.orderBy(
          `user.${params.sortBy}`,
          params.sortOrder === 'asc' ? 'ASC' : 'DESC',
        );
      } else {
        queryBuilder.orderBy('user.createdAt', 'DESC');
      }
      const users = await queryBuilder.getMany();
      const recordsTotal = await totalQuery.getCount();
      return { result: users, recordsTotal };
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async findOne(id: number) {
    try {
      const isUserExists = await this.userRepository.findOneBy({ id });
      if (!isUserExists) {
        throw CustomError(
          USER_RESPONSE_MESSAGES.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return isUserExists;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const isUserExists = await this.userRepository.findOneBy({ id });
      if (!isUserExists) {
        throw CustomError(
          USER_RESPONSE_MESSAGES.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const updatedEntity = { id, ...updateUserDto };
      const updatedUser = await this.userRepository.save(updatedEntity);
      return updatedUser;
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }

  async remove(id: number) {
    try {
      const isUserExists = await this.userRepository.findOneBy({ id });
      if (!isUserExists) {
        throw CustomError(
          USER_RESPONSE_MESSAGES.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return await this.userRepository.softDelete({ id });
    } catch (error) {
      throw CustomError(error.message, error.statusCode);
    }
  }
}

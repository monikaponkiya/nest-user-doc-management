import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { USER_RESPONSE_MESSAGES } from 'src/common/constants/response.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from 'src/common/constants/enum.constant';
import { ListDto } from 'src/common/dto/common.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { RoleGuard } from 'src/security/auth/guards/role.guard';
import { USER } from 'src/common/constants/api.description.constant';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RoleGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiOperation({
    summary: USER.CREATE.summary,
    description: USER.CREATE.description,
  })
  @ResponseMessage(USER_RESPONSE_MESSAGES.USER_INSERTED)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('list')
  @ApiOperation({
    summary: USER.FIND_ALL.summary,
    description: USER.FIND_ALL.description,
  })
  @ResponseMessage(USER_RESPONSE_MESSAGES.USER_LISTED)
  async findAll(@Body() listDto: ListDto) {
    return await this.usersService.findAll(listDto);
  }

  @Get('get/:id')
  @ApiOperation({
    summary: USER.FIND_BY_ID.summary,
    description: USER.FIND_BY_ID.description,
  })
  @ResponseMessage(USER_RESPONSE_MESSAGES.USER_FETCHED)
  async findOne(@Param('id') id: number) {
    return await this.usersService.findOne(id);
  }

  @Put('update/:id')
  @ApiOperation({
    summary: USER.UPDATE.summary,
    description: USER.UPDATE.description,
  })
  @ResponseMessage(USER_RESPONSE_MESSAGES.USER_UPDATED)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: USER.DELETE.summary,
    description: USER.DELETE.description,
  })
  @ResponseMessage(USER_RESPONSE_MESSAGES.USER_DELETED)
  async remove(@Param('id') id: number) {
    return await this.usersService.remove(id);
  }
}

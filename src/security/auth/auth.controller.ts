import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { USER_RESPONSE_MESSAGES } from '../../common/constants/response.constant';
import { ResponseMessage } from '../../common/decorators/response.decorator';
import { ChangePasswordDto, LoginDto } from '../../common/dto/common.dto';
import { Public } from './auth.decorator';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/module/users/dto/create-user.dto';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/constants/enum.constant';
import { RoleGuard } from './guards/role.guard';
import { USER } from 'src/common/constants/api.description.constant';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({
    summary: USER.REGISTER.summary,
    description: USER.REGISTER.description,
  })
  @ResponseMessage(USER_RESPONSE_MESSAGES.USER_INSERTED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Public()
  async register(@Body() params: CreateUserDto) {
    return await this.authService.register(params);
  }

  @Public()
  @ApiOperation({
    summary: USER.LOGIN.summary,
    description: USER.LOGIN.description,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ResponseMessage(USER_RESPONSE_MESSAGES.USER_LOGIN)
  @Post('/login')
  async login(@Body() params: LoginDto) {
    return await this.authService.login(params);
  }

  @Post('/change-password')
  @ApiOperation({
    summary: USER.CHANGE_PASSWORD.summary,
    description: USER.CHANGE_PASSWORD.description,
  })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER)
  @UseGuards(RoleGuard)
  @ResponseMessage(USER_RESPONSE_MESSAGES.USER_PASSWORD_CHANGE)
  async changePassword(@Body() body: ChangePasswordDto) {
    return await this.authService.changePassword(body);
  }
}

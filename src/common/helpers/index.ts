import { HttpException, HttpStatus } from '@nestjs/common';

export function CustomError(
  message?: string,
  statusCode?: number,
): HttpException {
  return new HttpException(
    {
      message: message || 'Something went wrong, please try again later!',
      error: 'CustomError',
      statusCode: statusCode || HttpStatus.BAD_GATEWAY,
    },
    HttpStatus.BAD_GATEWAY,
  );
}

export class AuthExceptions {
  static TokenExpired(): HttpException {
    return new HttpException(
      {
        message: 'Token Expired use RefreshToken',
        error: 'TokenExpiredError',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }

  static InvalidToken(): HttpException {
    return new HttpException(
      {
        message: 'Invalid Token',
        error: 'InvalidToken',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }

  static ForbiddenException(): HttpException {
    return new HttpException(
      {
        message: 'This resource is forbidden from this user',
        error: 'UnAuthorizedResourceError',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }

  static InvalidIdPassword(): HttpException {
    return new HttpException(
      {
        message: 'Invalid Username or Password',
        error: 'InvalidIdPassword',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }

  static AccountNotExist(): HttpException {
    return new HttpException(
      {
        message: 'Account does not exist!',
        error: 'AccountNotExist',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }

  static AccountNotActive(): HttpException {
    return new HttpException(
      {
        message: 'Account not active!',
        error: 'AccountNotActive',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

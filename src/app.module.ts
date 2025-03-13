import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './security/auth/auth.module';
import { JwtAuthGuard } from './security/auth/guards/jwt-auth.guard';
import { DatabaseModule } from './providers/database/postgres/database.module';
import { ThrottleModule } from './security/throttle/throttle.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import AppConfiguration from './config/app.config';
import DatabaseConfiguration from './config/database.config';
import AuthConfiguration from './config/auth.config';
import { UsersModule } from './module/users/users.module';
import { DocumentModule } from './module/document/document.module';
import { MockModule } from './module/mock/mock.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfiguration, DatabaseConfiguration, AuthConfiguration],
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    ThrottleModule,
    UsersModule,
    DocumentModule,
    MockModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}

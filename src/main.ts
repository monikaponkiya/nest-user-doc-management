import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import helmet from 'helmet';
import { AppEnvironment } from './common/constants/enum.constant';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Get app config for cors/helmet settings and starting the app.
  const configService = app.get(ConfigService);
  const appConfig = configService.get('express');

  // Configure OPEN API/Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setDescription(appConfig.description)
    .setVersion(appConfig.version)
    .addServer('/')
    .addServer('/xcode')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  if (appConfig.environment != AppEnvironment.PRODUCTION) {
    SwaggerModule.setup('/', app, document);
  }

  //Enable API Params ValidationPipe for all endpoint.
  app.useGlobalPipes(new ValidationPipe());

  // Use Helmet middleware for securing HTTP headers
  app.use(helmet());

  // Enable/Disable CORS
  if (appConfig.enableCors) {
    app.enableCors();
  }
  // Apply global validation pipe to handle DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // Apply the HttpExceptionFilter globally
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(appConfig.port);
}
bootstrap();

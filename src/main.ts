import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { buildResponse } from '@utils/response.util';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const firstError = errors[0];
        const firstMessage = firstError
          ? `${firstError.property}:${Object.values(firstError.constraints)[0]}`
          : 'Validation error';

        return new BadRequestException(
          buildResponse([], firstMessage, false, 400),
        );
      },
    }),
  );
  
  await app.listen(process.env.PORT || 8700);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { buildResponse } from '@utils/response.util';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  
  const config = new DocumentBuilder()
    .setTitle('Keji Gateman API')
    .setDescription('API documentation for the Keji Gateman system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 8700);
}
bootstrap();

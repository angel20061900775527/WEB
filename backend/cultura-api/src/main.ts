import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 3000);

  const frontendUrl = configService.get<string>(
    'FRONTEND_URL',
    'http://localhost:4200',
  );

  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  /*
   * Archivos estáticos
   *
   * Ejemplo:
   * /uploads/patrimonio/parques/imagen.png
   */
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SIGPAC API')
    .setDescription(
      'API del Sistema de Gestión del Patrimonio Cultural del GADM Zamora',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese el token JWT',
      },
      'JWT',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);

  logger.log(`API ejecutándose en http://localhost:${port}/api`);

  logger.log(`Swagger disponible en http://localhost:${port}/api/docs`);

  logger.log(`Archivos disponibles en http://localhost:${port}/uploads`);

  logger.log(`Entorno: ${nodeEnv}`);
}

void bootstrap();

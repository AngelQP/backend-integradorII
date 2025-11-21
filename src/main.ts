import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // para aplicar DTO de salida en las request
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Validaciones para lo que venga dentro de la request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Coloca el prefijo de "api" antes de las rutas
  app.setGlobalPrefix('api');


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

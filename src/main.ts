import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  });

  // Coloca el prefijo de "api" antes de las rutas
  app.setGlobalPrefix('api');

  // Configuracion de swagger
  const config = new DocumentBuilder()
    .setTitle('API Libroconecta')
    .setDescription('API V1 - LibroConecta')
    .setVersion('1.0')
    // Agrega la configuración de seguridad para el Token Bearer
    .addBearerAuth(
      {
        // Define el tipo de esquema de seguridad
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Opcional: especificar el formato del token
        description: 'Introduce tu token JWT Bearer',
      },
      'bearer', // Este es el nombre de referencia (key) que usarás en tus decoradores de ruta
    )
    .build();
  
  // IMPORTANT: include global prefix in the generated paths
  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });
  // Monta la interfaz de Swagger UI en la ruta '/api' => http://localhost:3000/api
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  // --------------------------------- //

  // para aplicar DTO de salida en las request
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Validaciones para lo que venga dentro de la request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

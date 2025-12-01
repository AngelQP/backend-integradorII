import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  
  const document = SwaggerModule.createDocument(app, config);
  // Monta la interfaz de Swagger UI en la ruta '/api'
  SwaggerModule.setup('api', app, document);
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

  // Coloca el prefijo de "api" antes de las rutas
  app.setGlobalPrefix('api');


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

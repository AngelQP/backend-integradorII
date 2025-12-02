import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TestAuthModule } from './test-auth/test-auth.module';
import { CategoryModule } from './category/category.module';
import { FavoriteModule } from './favorite/favorite.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      ssl: false,
      // logging: true, // opcional para ver más detalle
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // **Ruta ABSOLUTA a la carpeta local**
      serveRoot: '/uploads/',                     // **Prefijo de URL para acceder a los archivos**
      // Por ejemplo, un archivo en la ruta local 'uploads/imagen.jpg' 
      // será accesible en la URL: http://localhost:3000/uploads/imagen.jpg
    }),

    AuthModule,

    CommonModule,

    TestAuthModule,

    BookModule,

    CategoryModule,

    FavoriteModule,

  ],
  
})
export class AppModule {}

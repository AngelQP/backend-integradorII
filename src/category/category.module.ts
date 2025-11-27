import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { BookModule } from 'src/libro/book.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { FavoriteModule } from '../favorite/favorite.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [
    TypeOrmModule.forFeature([Category]),
    AuthModule,
  ],
  exports: [
    CategoryService
  ]
})
export class CategoryModule {}

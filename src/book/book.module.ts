import { forwardRef, Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book, BookCategory, BookImage } from './entities';
import { CategoryModule } from 'src/category/category.module';
import { FavoriteModule } from 'src/favorite/favorite.module';

@Module({
  controllers: [BookController],
  providers: [BookService],
  imports: [
    TypeOrmModule.forFeature(
      [Book, BookCategory, BookImage]),
  ]
})
export class BookModule {}

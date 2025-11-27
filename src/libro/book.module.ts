import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book, BookCategory, BookImage, Category } from './entities';
// import { Favorite } from './entities/favorite.entity';

@Module({
  controllers: [BookController],
  providers: [BookService],
  imports: [
    TypeOrmModule.forFeature(
      [Book, BookCategory, /*Category,*/ BookImage, /*Favorite*/])
  ]
})
export class BookModule {}

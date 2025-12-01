import { forwardRef, Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { BookModule } from 'src/libro/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService],
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    AuthModule,
  ],
  exports: [FavoriteService]
})
export class FavoriteModule {}

import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { AuthModule } from 'src/auth/auth.module';

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

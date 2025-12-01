import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoriteService.create(createFavoriteDto);
  }

  @Get(':term')
  findAllByUser(@Param('term', ParseUUIDPipe) term: string) {
    return this.favoriteService.findAllByUser(term);
  }

  @Get(':term')
  findOne(@Param('term', ParseUUIDPipe) term: string) {
    return this.favoriteService.findOne(term);
  }

  // No se necesita este verbo para actualizar
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFavoriteDto: UpdateFavoriteDto) {
  //   return this.favoriteService.update(+id, updateFavoriteDto);
  // }

  @Delete(':term')
  remove(@Param('term', ParseUUIDPipe) term: string) {
    return this.favoriteService.remove(term);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseInterceptors, ClassSerializerInterceptor} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

// el controlador se maneja mediante term que son UUID
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Post('categories-create')
  async seedCategories() {
    return this.categoryService.seedBookCategories();
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':term')
  findOne(@Param('term')term: string) {
    return this.categoryService.findOne(term);
  }

  @Patch(':term')
  update(@Param('term', ParseUUIDPipe) term: string, 
  @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(term, updateCategoryDto);
  }

  @Delete(':term')
  remove(@Param('term', ParseUUIDPipe) term: string) {
    return this.categoryService.remove(term);
  }
}

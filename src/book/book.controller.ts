import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, ParseUUIDPipe, BadRequestException, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { FilesInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookResponseDto } from './dto/book-response.dto';

@Controller('book')
@ApiBearerAuth('bearer')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @ApiOperation({ summary: 'Crear libro (con hasta 3 imágenes)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title','price','state','categoryIds'],
      properties: {
        title: { type: 'string', example: 'El Señor de los Anillos' },
        author: { type: 'string', example: 'J. R. R. Tolkien' },
        description: { type: 'string', example: 'Fantasía épica' },
        price: { type: 'number', example: 59.9 },
        stock: { type: 'integer', example: 3 },
        discount: { type: 'integer', example: 10 },
        yearPublication: { type: 'integer', example: 1954 },
        numberPages: { type: 'integer', example: 1216 },
        lenguage: { type: 'string', example: 'Inglés' },
        state: { type: 'string', example: 'NUEVO' },
        categoryIds: { type: 'array', items: { type: 'string' }, example: ['uuid-category-1','uuid-category-2'] },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Hasta 3 archivos de imagen'
        }
      }
    }
  })
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 3, {
      storage: diskStorage({
        destination: './uploads/books',
        filename: (req, file, cb) => {
          const ext = file.originalname.split('.').pop();
          cb(null, `${uuid()}.${ext}`);
        },
      }),
    }),
  )
  @ApiResponse({ status: 201, description: 'Libro creado', type: BookResponseDto })
  @Auth(ValidRoles.user_seller, ValidRoles.superAdmin)
  create(
    @Body() createBookDto: CreateBookDto,
    @GetUser() user: User,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.bookService.create(createBookDto, user, images);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Listado de libros',
    type: [BookResponseDto],
    schema: { example: [
      {
        id: 'uuid-book-1',
        title: 'El Señor de los Anillos',
        author: 'J. R. R. Tolkien',
        price: 59.9,
        state: 'NUEVO',
        isActive: true,
        images: [{ url: '/uploads/books/img1.jpg', isMain: true }],
        categoryIds: ['uuid-category-1']
      }
    ]}
  })
  findAll() {
    return this.bookService.findAll();
  }

  @Get('/discounts')
  findDiscounts(@Query('limit') limit?: string) {
    // console.log(limit);
    // Convertimos el string 'limit' a un número, o undefined si no existe o no es un número válido.
    const numericLimit = limit ? parseInt(limit, 10) : undefined;

    // Puedes añadir una validación simple si lo deseas
    if (numericLimit !== undefined && (isNaN(numericLimit) || numericLimit <= 0)) {
        throw new BadRequestException('El parámetro limit debe ser un número entero positivo.');
    }

    return this.bookService.findBooksWithDiscount(numericLimit);
  }

  @Get(':param')
  @ApiResponse({ status: 200, description: 'Libro', type: BookResponseDto })
  findOne(@Param('param', ParseUUIDPipe) param: string) {
    return this.bookService.findOne(param);
  }

 

  // -------------------------
  // Actualizacion BOOK
  // -------------------------
  @Auth(ValidRoles.user_seller, ValidRoles.superAdmin)
  @Patch(':param')
  @ApiOperation({ summary: 'Actualizar libro' })
  @ApiResponse({ status: 200, description: 'Libro actualizado', type: BookResponseDto })
  update(
    @Param('param', ParseUUIDPipe) param: string,
    @Body() updateDto: UpdateBookDto,
    @GetUser() user: User
  ) {
    return this.bookService.update(param, updateDto, user);
  }

  // -------------------------
  // DELETE (LOGICAL)
  // -------------------------
  @Auth(ValidRoles.user_seller, ValidRoles.superAdmin)
  @Delete(':param')
  @ApiResponse({ status: 200, description: 'Borrado lógico realizado' })
  remove(
    @Param('param', ParseUUIDPipe) param: string,
    @GetUser() user: User
  ) {
    return this.bookService.remove(param, user);
  }
}

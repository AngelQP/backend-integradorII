// src/book/dto/book-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { BookCondition } from '../entities/book.entity';

class BookImageDto {
  @ApiProperty({ example: '/uploads/books/uuid1.jpg' })
  url: string;

  @ApiProperty({ example: true })
  isMain: boolean;
}

export class BookResponseDto {
  @ApiProperty({ example: 'uuid-book-1' })
  id: string;

  @ApiProperty({ example: 'El Señor de los Anillos' })
  title: string;

  @ApiProperty({ example: 'J. R. R. Tolkien' })
  author?: string;

  @ApiProperty({ example: 59.9 })
  price: number;

  @ApiProperty({ example: BookCondition.NUEVO, enum: BookCondition })
  state: BookCondition;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ type: [BookImageDto], example: [{ url: '/uploads/books/img1.jpg', isMain: true }] })
  images?: BookImageDto[];

  @ApiProperty({ example: ['uuid-category-1', 'uuid-category-2'] })
  categoryIds: string[];
}

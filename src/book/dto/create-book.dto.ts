import { ArrayMaxSize, IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { BookCondition } from "../entities/book.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";

export class CreateBookDto {

  @ApiProperty({ example: 'El Señor de los Anillos', description: 'Título del libro' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'J. R. R. Tolkien' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ example: 'Fantasía épica en la Tierra Media' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 59.9, description: 'Precio en la moneda local' })
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 3 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  stock?: number;

  @ApiPropertyOptional({ example: 10, description: 'Descuento en porcentaje' })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  discount?: number;

  @ApiPropertyOptional({ example: 1954 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  yearPublication?: number;

  @ApiPropertyOptional({ example: 1216 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  numberPages?: number;

  @ApiPropertyOptional({ example: 'Inglés' })
  @IsOptional()
  @IsString()
  lenguage?: string;

  @ApiProperty({ example: BookCondition.NUEVO, enum: BookCondition })
  @IsEnum(BookCondition)
  state: BookCondition;

  // /* categorías (IDs) */
  // @ApiProperty({
  //   example: ['uuid-category-1', 'uuid-category-2'],
  //   description: 'Array con los ids de categorías (UUIDs).'
  // })
  // @IsArray()
  // @IsUUID('4', { each: true, message: 'Cada ID de categoría debe ser un UUID válido' })
  // @ArrayMaxSize(10)
  // categoryIds: string[];

  /* categorías (IDs) */
  // IDs de Categoría (categoryIds)
    // ------------------------------------------
  @ApiProperty({
      description: 'IDs de las categorías asociadas. **Ingresar separados por comas** (ej: uuid1,uuid2,uuid3). Máx. 10 categorías.',
      example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6, q1r2s3t4-u5v6-7w8x-9y0z-a1b2c3d4e5f6', 
      type: String, // Se renderiza como campo de TEXTO en Swagger
      isArray: false,
  })
    
  // 1. Transformación: Convierte la cadena "uuid1,uuid2" a ['uuid1', 'uuid2']
  @Transform(({ value }) => {
      if (typeof value === 'string') {
          return value.split(',').map(item => item.trim());
      }
      return value;
  })
  
  // 2. Validación del Array
  @IsArray()
  @ArrayMaxSize(10, { message: 'categoryIds must contain no more than 10 elements' })
  // Asegura que cada elemento en el array resultante sea un UUID válido
  @IsUUID('4', { each: true, message: 'Cada ID de categoría debe ser un UUID válido' }) 
  categoryIds: string[];


}

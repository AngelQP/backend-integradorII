import { ArrayMaxSize, IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { BookCondition } from "../entities/book.entity";

export class CreateBookDto {

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsInt()
  discount?: number;

  @IsOptional()
  @IsInt()
  yearPublication?: number;

  @IsOptional()
  @IsInt()
  numberPages?: number;

  @IsOptional()
  @IsString()
  lenguage?: string;

  @IsEnum(BookCondition)
  state: BookCondition;

  /* categorías (IDs) */
  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMaxSize(10)
  categoryIds: string[];
}

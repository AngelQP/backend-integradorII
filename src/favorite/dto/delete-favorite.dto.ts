// favorite/dto/remove-favorite.dto.ts
import { IsUUID } from 'class-validator';

export class RemoveFavoriteDto {
  @IsUUID()
  userId: string; // ID del usuario (UUID)

  @IsUUID()
  bookId: string; // ID del libro (UUID)
}
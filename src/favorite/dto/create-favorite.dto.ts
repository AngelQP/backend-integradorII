import { IsUUID } from "class-validator";

export class CreateFavoriteDto {

    @IsUUID()
    userId: string; // ID del usuario (UUID)

    @IsUUID()
    bookId: string; // ID del libro (UUID)
}

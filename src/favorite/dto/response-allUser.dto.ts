import { IsUUID } from "class-validator";


export class ResponseByAllUser {

    @IsUUID()
    bookID: string; // ID del libro
}
import { Exclude, Expose } from "class-transformer";
import { BookCategory } from "src/libro/entities";

export class CategoryResponse {

    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    description?: string;

    @Expose()
    state: boolean;

}
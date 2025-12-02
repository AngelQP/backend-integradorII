import { Expose } from "class-transformer";

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
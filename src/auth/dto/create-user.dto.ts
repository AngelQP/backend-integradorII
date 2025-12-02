import { IsArray, IsEmail, IsIn, IsNumberString, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";
import { ValidRoles } from "../interfaces";


export class CreateUserDto {
    
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @MinLength(1)
    lastName: string;

    @IsNumberString({}, { message: 'El teléfono debe contener solo números' })
    @Length(9, 9, { message: 'El teléfono debe tener exactamente 9 dígitos' })
    phone: string;

    @IsArray()
    @IsString({ each: true }) // Asegura que cada elemento dentro del array sea un string
    @IsIn(['user','user-seller'], { each: true }) // Asegura que cada string sea un rol válido
    @IsOptional() // Permite que el campo no se envíe
    roles: string[];

    // Si la propiedad 'roles' no es enviada en la petición, la establecemos a ['user']
    constructor() {
        this.roles = [ValidRoles.user];
    }

}
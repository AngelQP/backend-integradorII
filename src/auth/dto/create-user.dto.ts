import { IsEmail, IsNumberString, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";


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

}
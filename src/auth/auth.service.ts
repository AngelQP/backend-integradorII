import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import {bcryptAdapter} from './helper/AdapterBcrypt';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService

  ){}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create( { 
        ...userData,
        password: bcryptAdapter.hash(password)
      } );

      await this.userRepository.save(user);

      // se retira la contraseña del usuario que se retorna // aunque lo realice con otro DTO solo para respuesta
      // const {password:_ , ...userWithoutPassword} = user;

      // se retorna el usuario sin contraseña y
      // return {
      //   ...userWithoutPassword,
      //   token: this.getJwtToken({email: user.email})
      // };

      // retorno mediante DTO
      return plainToInstance(
        UserResponseDto,
        {...user, token: this.getJwtToken({id: user.id})}, 
        {excludeExtraneousValues: true}
      )

    } catch (error) {
        this.handleDBErrors(error);
    }
  }

  async login( loginUserDto: LoginUserDto) {

    const {password, email} = loginUserDto;

    // en la consulta solo retorna email y password
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true}
    });

    if ( !user ) 
      throw new UnauthorizedException('Credentials are not valid (email)');
    

    if( !bcryptAdapter.compare(password, user.password) )
      throw new UnauthorizedException('Credentials are not valid (password)');
    

    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    };

  }


  private getJwtToken( payload: JwtPayload ) {

    const token = this.jwtService.sign( payload );
    return token;

  }

  private handleDBErrors( error: any ): never {

    if( error.code === '23505' ) 
      throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Checa los server logs. Gil !!')
  }

  
}

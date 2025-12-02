import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { RawHeaders, GetUser, Auth } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

@ApiOperation({ summary: 'Crear un usuario o vendedor' })
@ApiConsumes('application/json')
@ApiBody({
  schema: {
    type: 'object',
    required: ['email','password','name','lastname','phone'],
    properties: {
      email: { type: 'string', example: 'name@example.com' },
      password: { type: 'string', example: 'Contrasena123' },
      name: { type: 'string', example: 'Pepito' },
      lastName: { type: 'string', example: 'Canales Rios' },
      phone: { type: 'number', example: 987654321 },
      roles: {
        type: 'array',
        items: { type: 'string' },
        description: 'user o user-seller'
      }
    }
  }
  })
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  create(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testgPrivateRoute( 
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[]
  ) {
     return {
       ok: true,
       message: 'Hola mundo Private',
       user,
       userEmail,
       rawHeaders
     }
  }

  //@SetMetadata('roles', ['admin','super-user'])
  
  @Get('private2')
  @RoleProtected( ValidRoles.superAdmin)
  @UseGuards( AuthGuard(), UserRoleGuard )
  testgPrivateRoute2( 
    @GetUser() user: User,
  ) {
     return {
       ok: true,
       user,
     }
  }

  @Get('private3')
  @Auth(ValidRoles.superAdmin)
  testgPrivateRoute3( 
    @GetUser() user: User,
  ) {
     return {
       ok: true,
       user,
     }
  }

  
}

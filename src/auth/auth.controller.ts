import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { RawHeaders, GetUser, Auth } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestAuthService } from './test-auth.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('test-auth')
export class TestAuthController {
  constructor(private readonly testAuthService: TestAuthService) {}


  @Get()
  @Auth(ValidRoles.superAdmin)
  findAll() {
    return this.testAuthService.findAll();
  }

}

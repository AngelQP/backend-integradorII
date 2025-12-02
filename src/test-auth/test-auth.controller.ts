import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestAuthService } from './test-auth.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('test-auth')
export class TestAuthController {
  constructor(private readonly testAuthService: TestAuthService) {}


  @Get()
  @Auth(ValidRoles.superAdmin, ValidRoles.user_seller)
  @ApiBearerAuth('bearer')
  findAll() {
    return this.testAuthService.findAll();
  }

}

import { Injectable } from '@nestjs/common';
import { CreateTestAuthDto } from './dto/create-test-auth.dto';
import { UpdateTestAuthDto } from './dto/update-test-auth.dto';

@Injectable()
export class TestAuthService {

  findAll() {
    return `This action returns Ok !!! testAuth`;
  }

}

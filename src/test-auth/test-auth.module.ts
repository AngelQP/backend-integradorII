import { Module } from '@nestjs/common';
import { TestAuthService } from './test-auth.service';
import { TestAuthController } from './test-auth.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TestAuthController],
  providers: [TestAuthService],
  imports: [AuthModule]
})
export class TestAuthModule {}

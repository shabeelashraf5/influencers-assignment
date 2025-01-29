import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './providers/auth/auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public registerAdmin(@Body() adminDto: RegisterDto) {
    return this.authService.createAdmin(adminDto);
  }

  @Post('dashboard')
  public async loginAdmin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

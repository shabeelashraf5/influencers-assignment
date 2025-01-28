import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './providers/auth/auth.service';
import { RegisterDto } from './dtos/register.dto';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public registerAdmin(@Body() adminDto: RegisterDto) {
    return this.authService.createAdmin(adminDto);
  }
}

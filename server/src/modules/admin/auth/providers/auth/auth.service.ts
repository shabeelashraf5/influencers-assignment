import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from '../../schemas/admin.schema';
import { Model } from 'mongoose';
import { RegisterDto } from '../../dtos/register.dto';
import { LoginDto } from '../../dtos/login.dto';
import { AuthJwtService } from 'src/config/jwt/auth-jwt/auth-jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private readonly jwtAuthService: AuthJwtService,
  ) {}

  async createAdmin(adminDto: RegisterDto) {
    try {
      const newAdmin = new this.adminModel(adminDto);
      const admin = await newAdmin.save();

      return { success: true, message: 'Admin Created', admin };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const loginUser = await this.adminModel.findOne({ email }).exec();

      if (!loginUser) {
        throw new HttpException(
          'Invalid email, please register your email',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (loginUser.password !== password) {
        throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
      }

      const accessToken = await this.jwtAuthService.generateAccessToken(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        loginUser.id,
        loginUser.email,
      );

      return {
        success: true,
        message: 'User logged in successfully',
        token: accessToken,
        users: loginUser,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

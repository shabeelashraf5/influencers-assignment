import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from '../../schemas/admin.schema';
import { Model } from 'mongoose';
import { RegisterDto } from '../../dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

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
}

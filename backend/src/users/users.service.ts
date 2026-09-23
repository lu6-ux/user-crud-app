import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(name: string, email: string, hashedPassword: string) {
    try {
      return await this.userModel.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      });
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException('Email is already registered');
      }
      throw err;
    }
  }

  async findByEmailWithPassword(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).select('+password');
  }

  async findAll() {
    return this.userModel.find().select('-password').sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    if (dto.email) dto.email = dto.email.toLowerCase();
    try {
      const user = await this.userModel
        .findByIdAndUpdate(id, dto, { new: true })
        .select('-password');
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException('Email is already registered');
      }
      throw err;
    }
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('User not found');
    return { message: 'Account deleted' };
  }
}

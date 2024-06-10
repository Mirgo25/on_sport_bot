import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.userModel.create(dto);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find({ isAdmin: { $ne: true } }).exec();
  }

  async findAllAdmins(): Promise<User[]> {
    return this.userModel.find({ isAdmin: true }).exec();
  }

  async findByChatId(chatId: number) {
    return this.userModel.findOne({ chatId }).exec();
  }

  async findById(userId: number) {
    return this.userModel.findOne({ userId }).exec();
  }

  async exists(chatId: number, channelChatId: number) {
    const res = await this.userModel.findOne({ chatId, channelChatId }).exec();
    return !!res;
  }

  async deleteManyById(userId: number) {
    await this.userModel.deleteMany({ userId });
  }

  async deleteManyByChatId(chatId: number) {
    await this.userModel.deleteMany({ chatId });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto)
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('roles').exec()
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).populate('roles').exec()
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`)
    }
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .populate('roles')
      .exec()
    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`)
    }
    return updatedUser
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec()
    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`)
    }
    return deletedUser
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).populate('roles').exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}

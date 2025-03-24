import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) { }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return this.permissionModel.create(createPermissionDto);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionModel.find().exec();
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionModel.findById(id).exec();
    if (!permission) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    const updated = await this.permissionModel
      .findByIdAndUpdate(id, updatePermissionDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<Permission> {
    const deleted = await this.permissionModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }
    return deleted;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Role } from './entities/role.entity'
import { Model } from 'mongoose'

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleModel.create(createRoleDto)
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().populate('permissions').exec()
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleModel
      .findById(id)
      .populate('permissions')
      .exec()
    if (!role) {
      throw new NotFoundException(`Role #${id} not found`)
    }
    return role
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const updated = await this.roleModel
      .findByIdAndUpdate(id, updateRoleDto, { new: true })
      .populate('permissions')
      .exec()
    if (!updated) {
      throw new NotFoundException(`Role #${id} not found`)
    }
    return updated
  }

  async remove(id: string): Promise<Role> {
    const deleted = await this.roleModel.findByIdAndDelete(id).exec()
    if (!deleted) {
      throw new NotFoundException(`Role #${id} not found`)
    }
    return deleted
  }
}

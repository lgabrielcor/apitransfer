import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { Item } from './entities/item.entity'

@Injectable()
export class ItemsService {
  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) { }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    return this.itemModel.create(createItemDto)
  }

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec()
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemModel.findById(id).exec()
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`)
    }
    return item
  }

  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const updatedItem = await this.itemModel
      .findByIdAndUpdate(id, updateItemDto, { new: true })
      .exec()
    if (!updatedItem) {
      throw new NotFoundException(`Item with id ${id} not found`)
    }
    return updatedItem
  }

  async remove(id: string): Promise<Item> {
    const deletedItem = await this.itemModel.findByIdAndDelete(id).exec()
    if (!deletedItem) {
      throw new NotFoundException(`Item with id ${id} not found`)
    }
    return deletedItem
  }
}

import { Test, TestingModule } from '@nestjs/testing'
import { ItemsService } from './items.service'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateItemDto } from './dto/create-item.dto'
import { UpdateItemDto } from './dto/update-item.dto'
import { NotFoundException } from '@nestjs/common'
import { Item } from './entities/item.entity'

describe('ItemsService', () => {
  let service: ItemsService
  let model: Model<Item>

  const mockItem = {
    _id: '65ff12345678901234567890',
    name: 'Test Item',
    description: 'Test Description',
    price: 100,
    quantity: 10,
  }

  const mockItemModel = {
    create: jest.fn().mockResolvedValue(mockItem),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockItem]),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockItem),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockItem),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockItem),
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getModelToken(Item.name),
          useValue: mockItemModel,
        },
      ],
    }).compile()

    service = module.get<ItemsService>(ItemsService)
    model = module.get<Model<Item>>(getModelToken(Item.name))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new item', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Test Item',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      }

      expect(await service.create(createItemDto)).toEqual(mockItem)
      expect(model.create).toHaveBeenCalledWith(createItemDto)
    })
  })

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const result = await service.findAll()
      expect(result).toEqual([mockItem])
      expect(model.find).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a single item', async () => {
      const id = '65ff12345678901234567890'
      const result = await service.findOne(id)
      expect(result).toEqual(mockItem)
      expect(model.findById).toHaveBeenCalledWith(id)
    })

    it('should throw an error if item is not found', async () => {
      const id = '65ff12345678901234567890'
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any)

      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException(`Item with id ${id} not found`),
      )
    })
  })

  describe('update', () => {
    it('should update an item', async () => {
      const id = '65ff12345678901234567890'
      const updateItemDto: UpdateItemDto = {
        price: 150,
        quantity: 20,
        name: '',
        description: '',
      }

      const result = await service.update(id, updateItemDto)
      expect(result).toEqual(mockItem)
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(id, updateItemDto, {
        new: true,
      })
    })

    it('should throw an error if item to update is not found', async () => {
      const id = '65ff12345678901234567890'
      const updateItemDto: UpdateItemDto = {
        price: 150,
        name: '',
        description: '',
      }

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any)

      await expect(service.update(id, updateItemDto)).rejects.toThrow(
        new NotFoundException(`Item with id ${id} not found`),
      )
    })
  })

  describe('remove', () => {
    it('should remove an item', async () => {
      const id = '65ff12345678901234567890'
      const result = await service.remove(id)
      expect(result).toEqual(mockItem)
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(id)
    })

    it('should throw an error if item to remove is not found', async () => {
      const id = '65ff12345678901234567890'
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any)

      await expect(service.remove(id)).rejects.toThrow(
        new NotFoundException(`Item with id ${id} not found`),
      )
    })
  })
})

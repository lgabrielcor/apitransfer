import 'reflect-metadata'
import { Test, TestingModule } from '@nestjs/testing'
import { ItemsController } from './items.controller'
import { ItemsService } from './items.service'
import { UpdateItemDto } from './dto/update-item.dto'
import { CreateItemDto } from './dto/create-item.dto'

// Mock the security decorators
jest.mock('../security/custom-decorator', () => ({
  AuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true)
  })),
  Roles: jest.fn().mockReturnValue(() => true),
  Permissions: jest.fn().mockReturnValue(() => true)
}))

describe('ItemsController', () => {
  let controller: ItemsController
  let service: ItemsService

  const mockItem = {
    _id: '65ff12345678901234567890',
    description: 'Test Description',
    price: 100,
    quantity: 10,
  }

  const mockItemsService = {
    create: jest.fn().mockResolvedValue(mockItem),
    findAll: jest.fn().mockResolvedValue([mockItem]),
    findOne: jest.fn().mockResolvedValue(mockItem),
    update: jest.fn().mockResolvedValue(mockItem),
    remove: jest.fn().mockResolvedValue(mockItem),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: mockItemsService,
        },
      ],
    }).compile()

    controller = module.get<ItemsController>(ItemsController)
    service = module.get<ItemsService>(ItemsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a new item', async () => {
      const createItemDto: CreateItemDto = {
        name: 'Test Item',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      }

      expect(await controller.create(createItemDto)).toBe(mockItem)
      expect(service.create).toHaveBeenCalledWith(createItemDto)
    })
  })

  describe('findAll', () => {
    it('should return an array of items', async () => {
      expect(await controller.findAll()).toEqual([mockItem])
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a single item', async () => {
      const id = '65ff12345678901234567890'
      expect(await controller.findOne(id)).toBe(mockItem)
      expect(service.findOne).toHaveBeenCalledWith(id)
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

      expect(await controller.update(id, updateItemDto)).toBe(mockItem)
      expect(service.update).toHaveBeenCalledWith(id, updateItemDto)
    })
  })

  describe('remove', () => {
    it('should remove an item', async () => {
      const id = '65ff12345678901234567890'
      expect(await controller.remove(id)).toBe(mockItem)
      expect(service.remove).toHaveBeenCalledWith(id)
    })
  })
})

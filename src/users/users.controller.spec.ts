import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

describe('UsersController', () => {
  let controller: UsersController
  let service: UsersService

  const mockUser = {
    _id: '65ff12345678901234567890',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    roles: ['user']
  }

  const mockUsersService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    remove: jest.fn().mockResolvedValue(mockUser)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService
        }
      ]
    }).compile()

    controller = module.get<UsersController>(UsersController)
    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        roles: ['user']
      }

      expect(await controller.create(createUserDto)).toBe(mockUser)
      expect(service.create).toHaveBeenCalledWith(createUserDto)
    })
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await controller.findAll()).toEqual([mockUser])
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a single user', async () => {
      const id = '65ff12345678901234567890'
      expect(await controller.findOne(id)).toBe(mockUser)
      expect(service.findOne).toHaveBeenCalledWith(id)
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const id = '65ff12345678901234567890'
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com'
      }

      expect(await controller.update(id, updateUserDto)).toBe(mockUser)
      expect(service.update).toHaveBeenCalledWith(id, updateUserDto)
    })
  })

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = '65ff12345678901234567890'
      expect(await controller.remove(id)).toBe(mockUser)
      expect(service.remove).toHaveBeenCalledWith(id)
    })
  })
})

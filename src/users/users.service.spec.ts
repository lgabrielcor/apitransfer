import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { NotFoundException } from '@nestjs/common'
import { User } from './entities/user.entity'

describe('UsersService', () => {
  let service: UsersService
  let model: Model<User>

  const mockUser = {
    _id: '65ff12345678901234567890',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    roles: ['user']
  }

  const mockUserModel = {
    create: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockUser])
    }),
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockUser)
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockUser)
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser)
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel
        }
      ]
    }).compile()

    service = module.get<UsersService>(UsersService)
    model = module.get<Model<User>>(getModelToken(User.name))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        roles: ['user']
      }

      expect(await service.create(createUserDto)).toEqual(mockUser)
      expect(model.create).toHaveBeenCalledWith(createUserDto)
    })
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      expect(await service.findAll()).toEqual([mockUser])
      expect(model.find).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a single user', async () => {
      const id = '65ff12345678901234567890'
      expect(await service.findOne(id)).toEqual(mockUser)
      expect(model.findById).toHaveBeenCalledWith(id)
    })

    it('should throw an error if user is not found', async () => {
      const id = '65ff12345678901234567890'
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(null)
      } as any)

      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException(`User with id ${id} not found`)
      )
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const id = '65ff12345678901234567890'
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com'
      }

      expect(await service.update(id, updateUserDto)).toEqual(mockUser)
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updateUserDto,
        { new: true }
      )
    })

    it('should throw an error if user to update is not found', async () => {
      const id = '65ff12345678901234567890'
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com'
      }

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(null)
      } as any)

      await expect(service.update(id, updateUserDto)).rejects.toThrow(
        new NotFoundException(`User with id ${id} not found`)
      )
    })
  })

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = '65ff12345678901234567890'
      expect(await service.remove(id)).toEqual(mockUser)
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(id)
    })

    it('should throw an error if user to remove is not found', async () => {
      const id = '65ff12345678901234567890'
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null)
      } as any)

      await expect(service.remove(id)).rejects.toThrow(
        new NotFoundException(`User with id ${id} not found`)
      )
    })
  })
})

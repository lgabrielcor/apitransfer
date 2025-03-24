import { Test, TestingModule } from '@nestjs/testing'
import { RolesService } from './roles.service'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Role } from './entities/role.entity'
import { NotFoundException } from '@nestjs/common'

describe('RolesService', () => {
  let service: RolesService
  let model: Model<Role>

  const mockRole = {
    _id: '65ff12345678901234567890',
    name: 'admin',
    description: 'Administrator role',
    permissions: ['read:users', 'write:users'],
    save: jest.fn().mockResolvedValue(this),
  }

  const mockRoleModel = {
    new: jest.fn().mockResolvedValue(mockRole),
    constructor: jest.fn().mockResolvedValue(mockRole),
    create: jest.fn().mockResolvedValue(mockRole),
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockRole]),
    }),
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockRole),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockRole),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockRole),
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getModelToken(Role.name),
          useValue: mockRoleModel,
        },
      ],
    }).compile()

    service = module.get<RolesService>(RolesService)
    model = module.get<Model<Role>>(getModelToken(Role.name))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new role', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'admin',
        description: 'Administrator role',
        permissions: ['read:users', 'write:users'],
      }

      jest.spyOn(model, 'create')
      const result = await service.create(createRoleDto)
      expect(result).toEqual(mockRole)
      expect(model.create).toHaveBeenCalledWith(createRoleDto)
    })

    it('should throw an error if creation fails', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'admin',
        description: 'Administrator role',
        permissions: ['read:users', 'write:users'],
      }

      jest
        .spyOn(model, 'create')
        .mockRejectedValueOnce(new Error('Creation failed'))
      await expect(service.create(createRoleDto)).rejects.toThrow(
        'Creation failed',
      )
    })
  })

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const result = await service.findAll()
      expect(result).toEqual([mockRole])
      expect(model.find).toHaveBeenCalled()
      expect(model.find().populate).toHaveBeenCalledWith('permissions')
    })

    it('should return an empty array if no roles exist', async () => {
      jest.spyOn(model, 'find').mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce([]),
      } as any)
      const result = await service.findAll()
      expect(result).toEqual([])
    })
  })

  describe('findOne', () => {
    it('should return a single role', async () => {
      const id = '65ff12345678901234567890'
      const result = await service.findOne(id)
      expect(result).toEqual(mockRole)
      expect(model.findById).toHaveBeenCalledWith(id)
    })

    it('should throw an error if role is not found', async () => {
      const id = '65ff12345678901234567890'
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any)
      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException(`Role #${id} not found`),
      )
    })
  })

  describe('update', () => {
    it('should update a role', async () => {
      const id = '65ff12345678901234567890'
      const updateRoleDto: UpdateRoleDto = {
        name: 'super-admin',
        permissions: ['read:users', 'write:users', 'delete:users'],
      }

      const result = await service.update(id, updateRoleDto)
      expect(result).toEqual(mockRole)
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(id, updateRoleDto, {
        new: true,
      })
    })

    it('should throw an error if role to update is not found', async () => {
      const id = '65ff12345678901234567890'
      const updateRoleDto: UpdateRoleDto = {
        name: 'super-admin',
      }

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any)
      await expect(service.update(id, updateRoleDto)).rejects.toThrow(
        new NotFoundException(`Role #${id} not found`),
      )
    })
  })

  describe('remove', () => {
    it('should remove a role', async () => {
      const id = '65ff12345678901234567890'
      const result = await service.remove(id)
      expect(result).toEqual(mockRole)
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(id)
    })

    it('should throw an error if role to remove is not found', async () => {
      const id = '65ff12345678901234567890'
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any)
      await expect(service.remove(id)).rejects.toThrow(
        new NotFoundException(`Role #${id} not found`),
      )
    })
  })
})

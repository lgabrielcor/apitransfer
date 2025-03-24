import { Test, TestingModule } from '@nestjs/testing'
import { PermissionsService } from './permissions.service'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { Permission } from './entities/permission.entity'

describe('PermissionsService', () => {
  let service: PermissionsService
  let model: Model<Permission>

  const mockPermission = {
    _id: '65ff12345678901234567890',
    name: 'read:users',
    description: 'Can read users',
    resource: 'users',
    action: 'read',
  }

  const mockPermissionModel = {
    create: jest.fn().mockResolvedValue(mockPermission),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockPermission]),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPermission),
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPermission),
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPermission),
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getModelToken(Permission.name),
          useValue: mockPermissionModel,
        },
      ],
    }).compile()

    service = module.get<PermissionsService>(PermissionsService)
    model = module.get<Model<Permission>>(getModelToken(Permission.name))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new permission', async () => {
      const createPermissionDto: CreatePermissionDto = {
        name: 'read:users',
        description: 'Can read users',
        resource: 'users',
        action: 'read',
      }

      const result = await service.create(createPermissionDto)
      expect(result).toEqual(mockPermission)
      expect(model.create).toHaveBeenCalledWith(createPermissionDto)
    })

    it('should throw an error if creation fails', async () => {
      const createPermissionDto: CreatePermissionDto = {
        name: 'read:users',
        description: 'Can read users',
        resource: 'users',
        action: 'read',
      }

      jest
        .spyOn(model, 'create')
        .mockRejectedValueOnce(new Error('Creation failed'))
      await expect(service.create(createPermissionDto)).rejects.toThrow(
        'Creation failed',
      )
    })
  })

  describe('findAll', () => {
    it('should return an array of permissions', async () => {
      const result = await service.findAll()
      expect(result).toEqual([mockPermission])
      expect(model.find).toHaveBeenCalled()
    })

    it('should return an empty array if no permissions exist', async () => {
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce([]),
      } as any)
      const result = await service.findAll()
      expect(result).toEqual([])
    })
  })

  describe('findOne', () => {
    it('should return a single permission', async () => {
      const id = '65ff12345678901234567890'
      const result = await service.findOne(id)
      expect(result).toEqual(mockPermission)
      expect(model.findById).toHaveBeenCalledWith(id)
    })

    it('should throw an error if permission is not found', async () => {
      const id = '65ff12345678901234567890'
      jest.spyOn(model, 'findById').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any)
      await expect(service.findOne(id)).rejects.toThrow(
        `Permission with id ${id} not found`,
      )
    })
  })

  describe('update', () => {
    it('should update a permission', async () => {
      const id = '65ff12345678901234567890'
      const updatePermissionDto: UpdatePermissionDto = {
        name: 'write:users',
        description: 'Can write users',
      }

      const result = await service.update(id, updatePermissionDto)
      expect(result).toEqual(mockPermission)
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updatePermissionDto,
        { new: true },
      )
    })

    it('should throw an error if permission to update is not found', async () => {
      const id = '65ff12345678901234567890'
      const updatePermissionDto: UpdatePermissionDto = {
        name: 'write:users',
      }

      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any)
      await expect(service.update(id, updatePermissionDto)).rejects.toThrow(
        `Permission with id ${id} not found`,
      )
    })
  })

  describe('remove', () => {
    it('should remove a permission', async () => {
      const id = '65ff12345678901234567890'
      const result = await service.remove(id)
      expect(result).toEqual(mockPermission)
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(id)
    })

    it('should throw an error if permission to remove is not found', async () => {
      const id = '65ff12345678901234567890'
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any)
      await expect(service.remove(id)).rejects.toThrow(
        `Permission with id ${id} not found`,
      )
    })
  })
})

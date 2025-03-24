import { Test, TestingModule } from '@nestjs/testing'
import { PermissionsController } from './permissions.controller'
import { PermissionsService } from './permissions.service'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'

describe('PermissionsController', () => {
  let controller: PermissionsController
  let service: PermissionsService

  const mockPermission = {
    _id: '65ff12345678901234567890',
    name: 'read:users',
    description: 'Can read users',
    resource: 'users',
    action: 'read',
  }

  const mockPermissionsService = {
    create: jest.fn().mockResolvedValue(mockPermission),
    findAll: jest.fn().mockResolvedValue([mockPermission]),
    findOne: jest.fn().mockResolvedValue(mockPermission),
    update: jest.fn().mockResolvedValue(mockPermission),
    remove: jest.fn().mockResolvedValue(mockPermission),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
      ],
    }).compile()

    controller = module.get<PermissionsController>(PermissionsController)
    service = module.get<PermissionsService>(PermissionsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a new permission', async () => {
      const createPermissionDto: CreatePermissionDto = {
        name: 'read:users',
        description: 'Can read users',
        resource: 'users',
        action: 'read',
      }

      expect(await controller.create(createPermissionDto)).toBe(mockPermission)
      expect(service.create).toHaveBeenCalledWith(createPermissionDto)
    })
  })

  describe('findAll', () => {
    it('should return an array of permissions', async () => {
      expect(await controller.findAll()).toEqual([mockPermission])
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a single permission', async () => {
      const id = '65ff12345678901234567890'
      expect(await controller.findOne(id)).toBe(mockPermission)
      expect(service.findOne).toHaveBeenCalledWith(id)
    })
  })

  describe('update', () => {
    it('should update a permission', async () => {
      const id = '65ff12345678901234567890'
      const updatePermissionDto: UpdatePermissionDto = {
        name: 'write:users',
        description: 'Can write users',
      }

      expect(await controller.update(id, updatePermissionDto)).toBe(
        mockPermission,
      )
      expect(service.update).toHaveBeenCalledWith(id, updatePermissionDto)
    })
  })

  describe('remove', () => {
    it('should remove a permission', async () => {
      const id = '65ff12345678901234567890'
      expect(await controller.remove(id)).toBe(mockPermission)
      expect(service.remove).toHaveBeenCalledWith(id)
    })
  })
})

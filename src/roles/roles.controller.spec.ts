import { Test, TestingModule } from '@nestjs/testing'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'

describe('RolesController', () => {
  let controller: RolesController
  let service: RolesService

  const mockRole = {
    _id: '65ff12345678901234567890',
    name: 'admin',
    description: 'Administrator role',
    permissions: ['read', 'write'],
  }

  const mockRolesService = {
    create: jest.fn().mockResolvedValue(mockRole),
    findAll: jest.fn().mockResolvedValue([mockRole]),
    findOne: jest.fn().mockResolvedValue(mockRole),
    update: jest.fn().mockResolvedValue(mockRole),
    remove: jest.fn().mockResolvedValue(mockRole),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile()

    controller = module.get<RolesController>(RolesController)
    service = module.get<RolesService>(RolesService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a new role', async () => {
      const createRoleDto: CreateRoleDto = {
        name: 'admin',
        description: 'Administrator role',
        permissions: ['read', 'write'],
      }

      expect(await controller.create(createRoleDto)).toBe(mockRole)
      expect(service.create).toHaveBeenCalledWith(createRoleDto)
    })
  })

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      expect(await controller.findAll()).toEqual([mockRole])
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a single role', async () => {
      const id = '65ff12345678901234567890'
      expect(await controller.findOne(id)).toBe(mockRole)
      expect(service.findOne).toHaveBeenCalledWith(id)
    })
  })

  describe('update', () => {
    it('should update a role', async () => {
      const id = '65ff12345678901234567890'
      const updateRoleDto: UpdateRoleDto = {
        name: 'updated-admin',
        description: 'Updated administrator role',
      }

      expect(await controller.update(id, updateRoleDto)).toBe(mockRole)
      expect(service.update).toHaveBeenCalledWith(id, updateRoleDto)
    })
  })

  describe('remove', () => {
    it('should remove a role', async () => {
      const id = '65ff12345678901234567890'
      expect(await controller.remove(id)).toBe(mockRole)
      expect(service.remove).toHaveBeenCalledWith(id)
    })
  })
})

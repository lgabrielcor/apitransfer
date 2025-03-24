import { Test } from '@nestjs/testing'
import { PermissionsModule } from './permissions.module'
import { PermissionsService } from './permissions.service'
import { PermissionsController } from './permissions.controller'
import { getModelToken } from '@nestjs/mongoose'
import { Permission } from './entities/permission.entity'

describe('PermissionsModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [PermissionsModule],
    })
      .overrideProvider(getModelToken(Permission.name))
      .useValue({})
      .compile()

    expect(module).toBeDefined()
    expect(module.get(PermissionsService)).toBeInstanceOf(PermissionsService)
    expect(module.get(PermissionsController)).toBeInstanceOf(
      PermissionsController,
    )
  })
})

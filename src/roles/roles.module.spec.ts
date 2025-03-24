import { Test } from '@nestjs/testing'
import { RolesModule } from './roles.module'
import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'
import { getModelToken } from '@nestjs/mongoose'
import { Role } from './entities/role.entity'

describe('RolesModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [RolesModule],
    })
      .overrideProvider(getModelToken(Role.name))
      .useValue({})
      .compile()

    expect(module).toBeDefined()
    expect(module.get(RolesService)).toBeInstanceOf(RolesService)
    expect(module.get(RolesController)).toBeInstanceOf(RolesController)
  })
})

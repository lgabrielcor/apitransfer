import { Test } from '@nestjs/testing'
import { UsersModule } from './users.module'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { getModelToken } from '@nestjs/mongoose'
import { User } from './entities/user.entity'

describe('UsersModule', () => {
    it('should compile the module', async () => {
        const module = await Test.createTestingModule({
            imports: [UsersModule]
        })
            .overrideProvider(getModelToken(User.name))
            .useValue({})
            .compile()

        expect(module).toBeDefined()
        expect(module.get(UsersService)).toBeInstanceOf(UsersService)
        expect(module.get(UsersController)).toBeInstanceOf(UsersController)
    })
})
import { Test } from '@nestjs/testing'
import { ItemsModule } from './items.module'
import { ItemsService } from './items.service'
import { ItemsController } from './items.controller'
import { getModelToken } from '@nestjs/mongoose'
import { Item } from './entities/item.entity'

describe('ItemsModule', () => {
    it('should compile the module', async () => {
        const module = await Test.createTestingModule({
            imports: [ItemsModule],
        })
            .overrideProvider(getModelToken(Item.name))
            .useValue({})
            .compile()

        expect(module).toBeDefined()
        expect(module.get(ItemsService)).toBeInstanceOf(ItemsService)
        expect(module.get(ItemsController)).toBeInstanceOf(ItemsController)
    })
})
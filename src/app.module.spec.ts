import { Test } from '@nestjs/testing'
import { AppModule } from './app.module'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { MongooseModule } from '@nestjs/mongoose'

describe('AppModule', () => {
    it('should compile the module', async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideProvider(MongooseModule)
            .useValue({})
            .compile()

        expect(module).toBeDefined()
        expect(module.get(AppService)).toBeInstanceOf(AppService)
        expect(module.get(AppController)).toBeInstanceOf(AppController)
    })
})
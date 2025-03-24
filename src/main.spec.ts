import { Test } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

describe('Bootstrap', () => {
    let app: INestApplication

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()

        // Configure app the same way as in main.ts
        const globalPrefix = 'api';
        app.setGlobalPrefix(globalPrefix)
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true
        }))

        await app.init()
    })

    afterEach(async () => {
        await app.close()
    })

    it('should bootstrap the application', async () => {
        expect(app).toBeDefined()
        expect(app.getHttpServer()).toBeDefined()
    })

})


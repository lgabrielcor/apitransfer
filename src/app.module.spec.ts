import 'reflect-metadata';
import { Test } from '@nestjs/testing'
import { AppModule } from './app.module'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt'
import { AuthService } from './auth/auth.service'
import { UsersService } from './users/users.service'

// Mock services
const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('token'),
  verifyAsync: jest.fn().mockResolvedValue({ userId: '1' })
}

const mockUsersService = {
  findByEmail: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(null)
}

const mockAuthService = {
  validateUser: jest.fn().mockResolvedValue(null),
  login: jest.fn().mockResolvedValue({ access_token: 'token' })
}

jest.mock('./config/jwt.config', () => ({
  JwtConfig: {
    module: jest.fn(),
    registerAsync: jest.fn().mockReturnValue({
      secret: 'test-secret',
      signOptions: { expiresIn: '1h' },
    }),
  },
}));

describe('AppModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MongooseModule)
      .useValue({})
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile()

    expect(module).toBeDefined()
    expect(module.get(AppService)).toBeInstanceOf(AppService)
    expect(module.get(AppController)).toBeInstanceOf(AppController)
  })
})

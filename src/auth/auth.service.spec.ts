import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

// Add interface for login credentials
interface LoginDto {
  email: string;
  password: string;
}

jest.mock('bcrypt', () => ({
  compare: jest.fn()
}))

describe('AuthService', () => {
  let service: AuthService
  let usersService: UsersService
  let jwtService: JwtService

  const mockUsersService = {
    findByEmail: jest.fn()
  }

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    usersService = module.get<UsersService>(UsersService)
    jwtService = module.get<JwtService>(JwtService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('login', () => {
    it('should generate access and refresh tokens for valid credentials', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@test.com',
        password: 'hashedPassword',
        roles: ['user']
      }

      const loginDto = {
        email: 'test@test.com',
        password: 'password'
      } as LoginDto

      // Mock bcrypt.compare to return true
      (bcrypt.compare as jest.Mock).mockResolvedValue(true)
      mockUsersService.findByEmail.mockResolvedValue(mockUser)
      mockJwtService.signAsync.mockResolvedValue('token')

      const result = await service.login(loginDto)

      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password)
      expect(result).toHaveProperty('access_token')
      expect(result).toHaveProperty('refresh_token')
    })
  })
})

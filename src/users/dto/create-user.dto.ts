import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe' })
  username: string

  @ApiProperty({ example: 'john@example.com' })
  email: string

  @ApiProperty({ example: 'changeme' })
  password: string

  @ApiProperty({
    type: [String],
    description: 'Lista de IDs de roles',
  })
  roles?: string[]
}

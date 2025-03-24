import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  name: string

  @ApiProperty({ required: false })
  description?: string

  @ApiProperty({
    type: [String],
    description: 'Lista de IDs de permisos',
  })
  permissions?: string[]
}

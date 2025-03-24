import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional } from 'class-validator'

export class CreatePermissionDto {
  @ApiProperty({ example: 'create' })
  @IsString()
  action: string

  @ApiProperty({ example: 'items' })
  @IsString()
  resource: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string
}

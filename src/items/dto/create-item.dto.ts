import { IsNotEmpty, IsString, IsNumber } from 'class-validator'

export class CreateItemDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsString()
  description: string

  @IsNumber()
  price: number

  @IsNumber()
  quantity: number
}

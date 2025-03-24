import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-item.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateItemDto extends PartialType(CreateItemDto) {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsString()
    description: string

    @IsNumber()
    price: number
}

import { Module } from '@nestjs/common'
import { ItemsService } from './items.service'
import { ItemsController } from './items.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Item, ItemSchema } from './entities/item.entity'
import { JwtConfig } from 'src/config/jwt.config'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    JwtConfig,
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}

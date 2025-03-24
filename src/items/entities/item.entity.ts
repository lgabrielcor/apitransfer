import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ItemDocument = HydratedDocument<Item>

@Schema()
export class Item {
    @Prop({ required: true })
    name: string

    @Prop()
    description: string

    @Prop()
    price: number

    @Prop({ default: Date.now })
    createdAt: Date
}

export const ItemSchema = SchemaFactory.createForClass(Item)
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Permission } from 'src/permissions/entities/permission.entity'

@Schema()
export class Role extends Document {
  @Prop({ required: true, unique: true })
  name: string // Ej: 'admin', 'editor', 'viewer', etc.

  @Prop()
  description?: string

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Permission' }],
  })
  permissions: Permission[]
}

export const RoleSchema = SchemaFactory.createForClass(Role)

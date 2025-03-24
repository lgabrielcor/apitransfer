import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Permission extends Document {
    @Prop({ required: true })
    action: string;
    // Ej: 'create', 'read', 'update', 'delete' o 'getAll', etc.

    @Prop({ required: true })
    resource: string;
    // Ej: 'items', 'users', 'roles', etc.

    @Prop()
    description?: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

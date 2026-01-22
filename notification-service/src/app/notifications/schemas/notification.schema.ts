import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt
export class Notification {
  @Prop({ required: true })
  userId: string; // Who was notified

  @Prop({ required: true })
  message: string; // What was told to them

  @Prop({ required: true })
  type: string; // Example: 'LOAN_CREATED', 'LOAN_RETURNED'

  @Prop({ default: false })
  read: boolean; // Has it been read already?
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
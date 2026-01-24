import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true })
  event: string; 

  @Prop({ type: Object })
  data: any;

  @Prop()
  source: string; 
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
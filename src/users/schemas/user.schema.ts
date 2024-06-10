import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  chatId: number;

  @Prop({ required: false })
  userId?: number;

  @Prop({ required: false })
  userName?: string;

  @Prop()
  firstName: string;

  @Prop({ required: false })
  lastName?: string;

  @Prop({ required: false })
  channelChatId?: number;

  @Prop({ default: false })
  isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

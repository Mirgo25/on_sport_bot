export class CreateUserDto {
  readonly chatId: number;
  readonly userId?: number;
  readonly userName?: string;
  readonly firstName: string;
  readonly lastName?: string;
  readonly channelChatId?: number;
}

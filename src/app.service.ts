import { Injectable, Logger } from '@nestjs/common';
@Injectable()
export class AppService {
  logger = new Logger('TelegramBot');
  constructor() {}
}

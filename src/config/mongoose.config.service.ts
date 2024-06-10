import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    const uri =
      'mongodb+srv://' +
      this.configService.getOrThrow('MONGO_LOGIN') +
      ':' +
      this.configService.getOrThrow('MONGO_PASSWORD') +
      '@' +
      this.configService.getOrThrow('MONGO_HOST') +
      '/' +
      this.configService.getOrThrow('MONGO_DB');
    return {
      uri,
    };
  }
}

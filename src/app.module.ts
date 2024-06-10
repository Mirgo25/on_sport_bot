import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getEnvPath } from './env';
import { TelegrafConfigService } from './config/telegraf.config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './config/mongoose.config.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvPath(),
    }),
    TelegrafModule.forRootAsync({
      useClass: TelegrafConfigService,
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    UsersModule,
  ],
  providers: [AppUpdate, AppService, TelegrafConfigService],
})
export class AppModule {}

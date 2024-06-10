import { Context, Markup } from 'telegraf';
import { bold } from 'telegraf/format';
import { Update, On, Ctx } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import {
  MATCH_TITLE,
  WATCH_BROADCAST,
  CS2_AD_CAPTION,
  CS2_AD_BUTTON_TITLE,
} from './consts/captions';
import { setTimeout as sleep } from 'timers/promises';
import { Logger } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { CS2_CHANNEL_LINK } from './consts/links';

@Update()
export class AppUpdate {
  logger = new Logger('TelegramBot');

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  @On('chat_join_request')
  async newMemberInChat(@Ctx() ctx: Context) {
    const broadcastChannelLink = this.configService.getOrThrow(
      'BROADCAST_CHANNEL_LINK',
    );
    const { user_chat_id } = ctx.chatJoinRequest;
    const {
      id: userId,
      username: userName,
      first_name: firstName,
      last_name: lastName,
    } = ctx.chatJoinRequest.from;
    const { id: channelChatId } = ctx.chatJoinRequest.chat;

    const isUserExist = await this.usersService.exists(
      user_chat_id,
      channelChatId,
    );
    if (!isUserExist) {
      await this.usersService.create({
        chatId: user_chat_id,
        firstName,
        lastName,
        userName,
        userId,
        channelChatId,
      });
    }
    try {
      await ctx.telegram.sendAnimation(
        user_chat_id,
        {
          source: 'static/animations/redfox9-football.mp4',
        },
        {
          caption: bold(MATCH_TITLE),
          reply_markup: Markup.inlineKeyboard([
            Markup.button.url(WATCH_BROADCAST, broadcastChannelLink),
          ]).reply_markup,
        },
      );
      await sleep(10000);
      await ctx.telegram.sendAnimation(
        user_chat_id,
        {
          source: 'static/animations/CS2_ads.gif',
        },
        {
          caption: CS2_AD_CAPTION,
          parse_mode: 'MarkdownV2',
          reply_markup: Markup.inlineKeyboard([
            Markup.button.url(CS2_AD_BUTTON_TITLE, CS2_CHANNEL_LINK),
          ]).reply_markup,
        },
      );
      await sleep(10000);
      await ctx.telegram.sendAnimation(
        user_chat_id,
        {
          source: 'static/animations/redfox9-football.mp4',
        },
        {
          caption: bold(MATCH_TITLE),
          reply_markup: Markup.inlineKeyboard([
            Markup.button.url(WATCH_BROADCAST, broadcastChannelLink),
          ]).reply_markup,
        },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}

import { Context, Markup } from 'telegraf';
import { underline, bold, italic } from 'telegraf/format';
import { Update, On, Ctx, Command, Message, Start } from 'nestjs-telegraf';
import { getRegionsInlineKeyboard } from './consts/regions';
import { ConfigService } from '@nestjs/config';
import {
  CHOOSE_REGION,
  CONFIRM,
  CONFIRM_YOU_ARE_NOT_ROBOT,
  HAVE_GIFT,
  CHOOSE_GIFT_FOR_FRIEND,
} from './consts/captions';
import { setTimeout as sleep } from 'timers/promises';
import { Logger } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { SpamType } from './consts/spamType';
import { AppService } from './app.service';
import { NO_ACCESS_FOR_COMMAND, NO_SUCH_COMMAND } from './consts/messages';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { BOT_LINK } from './consts/links';

@Update()
export class AppUpdate {
  logger = new Logger('TelegramBot');

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly appService: AppService,
  ) {}

  // @Command('spam')
  // async spamMailing(@Ctx() ctx: Context, @Message('text') msg: string) {
  //   const user = await this.usersService.findByChatId(ctx.chat.id);
  //   if (!user?.isAdmin) {
  //     await ctx.reply(NO_ACCESS_FOR_COMMAND);
  //   }

  //   const telegramApiId = Number(
  //     this.configService.getOrThrow('TELEGRAM_API_ID'),
  //   );
  //   const telegramApiHash = this.configService.getOrThrow('TELEGRAM_API_HASH');
  //   const session = new StringSession(
  //     this.configService.getOrThrow('TELEGRAM_API_SESSION'),
  //   );
  //   const client = new TelegramClient(
  //     session,
  //     telegramApiId,
  //     telegramApiHash,
  //     {},
  //   );
  //   await client.start({
  //     botAuthToken: this.configService.getOrThrow('BOT_TOKEN'),
  //   });

  //   const channel = await client.invoke(
  //     new Api.channels.GetFullChannel({
  //       channel: this.configService.getOrThrow('CHANNEL_ID_WITH_USERS'),
  //     }),
  //   );

  //   const chatIds = new Set(
  //     channel.fullChat.recentRequesters.map((value) => value.toJSNumber()),
  //   );
  //   const users = await this.usersService.findAllUsers();
  //   users.forEach(({ chatId }) => chatIds.add(chatId));

  //   const spamType = msg.substring(msg.indexOf(' ') + 1);
  //   switch (spamType) {
  //     case SpamType.GIFT_FRIEND_BOT:
  //       await this.appService.sendGiftFriendSpam(ctx, Array.from(chatIds));
  //       break;

  //     default:
  //       await ctx.reply(NO_SUCH_COMMAND);
  //       break;
  //   }
  //   return;
  // }

  @On('chat_join_request')
  async newMemberInChat(@Ctx() ctx: Context) {
    const myRegionChannelLink = this.configService.getOrThrow(
      'MY_REGION_CHANNEL_LINK',
    );
    const { reply_markup } = getRegionsInlineKeyboard(myRegionChannelLink);
    const approveChannelLink = this.configService.getOrThrow(
      'APPROVE_CHANNEL_LINK',
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
      await ctx.telegram.sendPhoto(
        user_chat_id,
        {
          source: 'static/photos/ATB_logo.jpg',
        },
        {
          caption: underline(bold(CHOOSE_REGION)),
          reply_markup,
        },
      );
      await sleep(8000);
      await ctx.telegram.sendMessage(
        user_chat_id,
        bold(CONFIRM_YOU_ARE_NOT_ROBOT),
        {
          reply_markup: Markup.inlineKeyboard([
            Markup.button.url(CONFIRM, approveChannelLink),
          ]).reply_markup,
        },
      );
      await sleep(8000);
      await ctx.telegram.sendAnimation(
        user_chat_id,
        {
          source: 'static/animations/roses-bunch-of-flowers.mp4',
        },
        {
          caption: bold(italic(HAVE_GIFT)),
          reply_markup: Markup.inlineKeyboard([
            Markup.button.url(CHOOSE_GIFT_FOR_FRIEND, BOT_LINK),
          ]).reply_markup,
        },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  // // https://vm.tiktok.com/ZIJnS8CgJ
  // // https://www.tiktok.com/@mcgregor_millionaire/video/7306885065437482273?_r=1&_t=8icn5CUJdSq
  // @Url(new RegExp('https://vm.tiktok.com/'))
  // async getTikTokLink(@Message('text') link: string, @Ctx() ctx: Context) {
  //   console.log({ link });
  //   // const headers: RawAxiosRequestHeaders = {
  //   //   'User-Agent':
  //   //     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
  //   // };
  //   const { request }: { request: { path: string } } = await axios.get(link);
  //   if (!request) {
  //     await ctx.reply('Something wrong with link you have sent');
  //     throw new NotFoundException('Request not found');
  //   }

  //   const userName = request.path.match(/^\/(@\w+)/)[1];
  //   const videoId = request.path.match(/\/video\/(\d+)/)[1];

  //   console.log({userName})
  //   console.log({videoId})

  //   await ctx.reply('Good!');
  // }
}

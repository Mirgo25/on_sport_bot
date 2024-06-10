import { Injectable, Logger } from '@nestjs/common';
import { CronJob } from 'cron';
import { Context, Markup, TelegramError } from 'telegraf';
import { UsersService } from './users/users.service';
import { bold, italic } from 'telegraf/format';
import { HAVE_GIFT, SEND_GIFT_RETURN } from './consts/captions';
import { BOT_LINK } from './consts/links';
import {
  BULK_PROCESS_MAILING,
  FINISH_MAILING,
  START_MAILING,
} from './consts/messages';

@Injectable()
export class AppService {
  logger = new Logger('TelegramBot');
  constructor(private readonly usersService: UsersService) {}

  async sendGiftFriendSpam(ctx: Context, chatIds: number[]) {
    let count = 0;
    const bulkSending = async () => {
      if (!chatIds.length) {
        job.stop();
        return;
      }
      const shortJob = CronJob.from({
        cronTime: '* * * * * *',
        onTick: async () => {
          this.logger.log(`Iteration start ${new Date()}`);
          const chatIdsSendTo = chatIds.splice(0, 20); // 20 requests per second
          count++;
          for (const chatIdSendTo of chatIdsSendTo) {
            try {
              await ctx.telegram.sendAnimation(
                chatIdSendTo,
                {
                  source: 'static/animations/roses-bunch-of-flowers.mp4',
                },
                {
                  caption: italic(bold(HAVE_GIFT)),
                  reply_markup: Markup.inlineKeyboard([
                    Markup.button.url(SEND_GIFT_RETURN, BOT_LINK),
                  ]).reply_markup,
                },
              );
            } catch (error: any) {
              if (error instanceof TelegramError && error.code === 403) {
                await this.usersService.deleteManyByChatId(chatIdSendTo);
                this.logger.log(
                  `Users with chatId (${chatIdSendTo}) were deleted.`,
                );
              } else {
                this.logger.error(error);
              }
            }
          }

          if (count === 60 || !chatIds.length) {
            count = 0;
            shortJob.stop();
            if (!chatIds.length) job.stop();
            return;
          }
        },
        onComplete: async () => {
          await ctx.reply(italic(BULK_PROCESS_MAILING));
          this.logger.log(`Iteration completed! ${new Date()}`);
        },
        start: true,
      });
    };

    await ctx.reply(bold(START_MAILING));
    this.logger.log(`Sending start! ${new Date()}`);
    const job = CronJob.from({
      cronTime: '*/3 * * * *',
      onTick: bulkSending,
      onComplete: async () => {
        await ctx.reply(bold(FINISH_MAILING));
        this.logger.log(`Sending completed! ${new Date()}`);
      },
      runOnInit: true,
      start: true,
    });
  }
}

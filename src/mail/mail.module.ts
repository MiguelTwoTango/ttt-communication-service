import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { SendGridClient } from './sendgrid-client';

@Module({
  // imports: [ConfigModule],
  controllers: [MailController],
  providers: [MailService, SendGridClient]
})
export class MailModule {}

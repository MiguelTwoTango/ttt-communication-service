
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailDataRequired } from '@sendgrid/mail';
import * as SendGrid from '@sendgrid/mail';
import { LogicException, Errors } from 'src/shared/errors';

@Injectable()
export class SendGridClient {
    constructor(private readonly configService: ConfigService) {
        SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
    }

    async sendOneMail(mail: MailDataRequired): Promise<any> {
        try {
            await SendGrid.send(mail);
            return 'Mail send succesfully'
        } catch (error) {
            throw new LogicException(`mail fail`, Errors.BAD_REQUEST)
        }
    }

    async send(mail): Promise<any>{
        return SendGrid.send(mail)
    }
}
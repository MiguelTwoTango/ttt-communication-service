import { Body, Controller, Injectable, Post, UseInterceptors } from '@nestjs/common';
import { MailService } from './mail.service';
import { ErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';



@Controller('mail')
@UseInterceptors(ErrorsInterceptor)
export class MailController {
    constructor(
        private readonly mailService: MailService,
        
    ) { }

    @Post('/sendWelcomeMail')
    async sendWelcomeMail(
        @Body() receptor: any
    ) {
        return this.mailService.sendWelcomeMail(receptor)
    }

    @Post('/sendMatchMail')
    async sendMatchMail(
        @Body() body: any,
    ) {
        const { receptor, requester } = body
        return this.mailService.sendMatchMail(receptor, requester)
    }

    @Post('/sendMeetingMail')
    async sendMeetingMail(
        @Body() body: any
    ) {
        const { receptor, requester, event } = body;

        return this.mailService.sendMeetingMail(receptor, requester, event)
    }

    @Post('/sendJoinEventMail')
    async sendJoinEventMail(
        @Body() body: any,
    ) {
        const { receptor, event } = body
        return this.mailService.sendJoinEventMail(receptor, event)
    }

    @Post('/sendUpdatePassword')
    async sendUpdatePassword(
        @Body() body: any
    ) {
        const { name, email, url } = body;
        return this.mailService.sendUpdatePassword(name, email, url)
    }

    @Post('/sendConsolidate')
    async sendConsolidate(
        @Body() body: any
    ) {
        const { name, email, date, meetings } = body
        return this.mailService.sendConsolidate(name, email, date, meetings)
    }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LogicException, Errors } from 'src/shared/errors';
import { SendGridClient } from './sendgrid-client';
import * as sgHelpers from "@sendgrid/helpers"
// const sgHelpers = require("@sendgrid/helpers");

@Injectable()
export class MailService {
    private base_URL: string
    private Personalization
    private noReplyMail: string

    constructor(
        private readonly sengridClient: SendGridClient,
        private readonly configService: ConfigService
    ) {
        this.base_URL = "https://app.twototango.co";
        this.Personalization = sgHelpers.classes.Personalization
        this.noReplyMail = this.configService.get<string>('NO_REPLAY_EMAIL')
    }

    async sendWelcomeMail(receptor) {
        const mail = this.baseEmail();
        mail.templateId = "d-0df3c8a6592b4ad2be871ebee5fdc963";
        const personalization = new this.Personalization();
        personalization.setTo(receptor.email);
        const dynamicTemplateData = { user_name: receptor.name, cta_url: this.base_URL };
        personalization.setDynamicTemplateData(dynamicTemplateData);
        mail.personalizations.push(personalization);
        return await this.sengridClient.sendOneMail(mail);
    }

    async sendMatchMail(receptor: any, requester: any) {
        const mail = this.baseEmail();
        mail.templateId = "d-229a0e70094a442db9288f512784e49a";
        const personalization = new this.Personalization();
        personalization.setTo([receptor.email]);
        const dynamicTemplateData = {
            user_name: receptor.name,
            request_name: requester.name,
            lang: "en_us",
            cta_url: this.base_URL,
        };
        personalization.setDynamicTemplateData(dynamicTemplateData);
        mail.personalizations.push(personalization);
        return await this.sengridClient.sendOneMail(mail);
    }

    async sendMeetingMail(receptor, requester, event) {


        const receptorMail = this.baseEmail();
        const requesterMail = this.baseEmail();

        receptorMail.templateId = "d-ab8db4d0122f48ffb77b7d291ea6cf39";
        requesterMail.templateId = "d-7998d20039e845928c135ce5c6f005e2";

        const personalizationReceptor = new this.Personalization();
        const personalizationRequester = new this.Personalization();

        personalizationReceptor.setTo(receptor.email);
        personalizationRequester.setTo(requester.email);


        const getFormatDate = (arrayDate) => {
            let result = "";
            for (let i = 0; i < 3; i++) { result += i === 2 ? `${arrayDate[i]}` : `${arrayDate[i]}-`; }
            return result;
        };

        const dynamicTemplateReceptorData = {
            user_name: receptor.name,
            request_name: requester.name,
            lang: "en_us",
            name: event.title,
            request_date: event.start, //cambiar el formato de la fecha
            request_place: event.location,
            cta_url: this.base_URL,
        };
        const dynamicTemplateRequesterData = {
            sender: requester.name,
            receiver: receptor.name,
            lang: "en_us",
        };

        personalizationReceptor.setDynamicTemplateData(dynamicTemplateReceptorData);
        personalizationRequester.setDynamicTemplateData(dynamicTemplateRequesterData);

        receptorMail.personalizations.push(personalizationReceptor);
        requesterMail.personalizations.push(personalizationRequester);

        Promise.all([this.sengridClient.send(receptorMail), this.sengridClient.send(requesterMail)])
            .then(_ => {
                return (`Mails successfully sent`)
            }).catch(error => {
                console.error(error);
                if (error.response) {
                    console.error(error.response.body);
                    throw new LogicException(`Oops, Mail service fail`, Errors.BAD_REQUEST);
                }
            })

    }

    async sendJoinEventMail(receptor, event) {
        const mail = this.baseEmail();
        mail.templateId = "d-08bdbb96bdf84ff0a6e59e024ce4e2ec";
        const personalization = new this.Personalization();
        personalization.setTo(receptor.email);
        const dynamicTemplateData = {
            user_name: receptor.name,
            event_name: event.name,
            cta_url: this.base_URL,
        };
        personalization.setDynamicTemplateData(dynamicTemplateData);
        mail.personalizations.push(personalization);
        return await this.sengridClient.sendOneMail(mail);
    }

    async sendUpdatePassword(name, email, url) {

        const mail = this.baseEmail();
        mail.templateId = "d-fbfc289522d149dda4bdcc049cc4a09c";
        const personalization = new this.Personalization();
        personalization.setTo(email);
        const dynamicTemplateData = { request_name: name, lang: "en_us", url: url };
        personalization.setDynamicTemplateData(dynamicTemplateData);
        mail.personalizations.push(personalization);
        return await this.sengridClient.sendOneMail(mail);
    }

    async sendConsolidate(name, email, date, meetings) {

        const mail = this.baseEmail();
        mail.templateId = "d-3f1d8dc7a22b4441b4ddf20fd3c567d6";
        const personalization = new this.Personalization();
        personalization.setTo(email);
        const dynamicTemplateData = { name: name, date: date, meetings: meetings };
        personalization.setDynamicTemplateData(dynamicTemplateData);
        mail.personalizations.push(personalization);
        return await this.sengridClient.sendOneMail(mail);
    }

    private baseEmail() {
        return {
            from: this.noReplyMail,
            personalizations: [],
            templateId: "",
            dynamicTemplateData: {}
        };
    };

}

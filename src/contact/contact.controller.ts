import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactDocument, createContactDTO, updateContactDTO} from '../documents/contact.document';
import { ErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';

@Controller('/contact')
@UseInterceptors(ErrorsInterceptor)
export class ContactController {
    constructor( private readonly contactService: ContactService) {}


    @Get('/all')
    async getAllContacts() {
        return this.contactService.getAllContacts()
    }
    @Get('/:userId')
    async getContactByUser(
        @Param() { userId }: { userId: string }
    ) {
        return this.contactService.getContactsByUser(userId)
    }

    @Post('/create')
    async createContact(
        @Body() contactDTO: createContactDTO
    ) {
        return this.contactService.createContact(contactDTO)
    }

    @Delete('/delete/:contactId')
    async deleteContact(
        @Param() { contactId }: { contactId: string }
    ) {
        return this.contactService.deleteContact(contactId)
    }
    
}
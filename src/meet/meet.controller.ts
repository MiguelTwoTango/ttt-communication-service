import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { MeetService } from './meet.service';
import { MeetDocument, createMeetDTO, updateMeetDTO } from 'src/documents/meet.document';
import { ErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';

@Controller('/meet')
@UseInterceptors(ErrorsInterceptor)
export class MeetController {
    constructor(private readonly meetService: MeetService) { }

    @Get('/filter')
    async filterMeets(
        @Body() filters: any
    ) {
        return this.meetService.filterMeets(filters)
    }

    @Get('/:userId')
    async getMeetsByUser(
        @Param() { userId }: { userId: string }
    ) {
        return this.meetService.getMeetsByUser(userId)
    }


    @Post('/create')
    async createMeet(
        @Body() meetingDTO: createMeetDTO
    ) {
        return this.meetService.createMeet(meetingDTO)
    }

    @Put('/update')
    async updateMeet(
        @Body() meetingDTO: updateMeetDTO
    ) {
        return this.meetService.updateMeet(meetingDTO)
    }

    @Put('/status/:meetId')
    async updateStatus(
        @Param() { meetId }: { meetId: string },
        @Body() { action }: { action: boolean }
    ) {
        return this.meetService.updateStatus(meetId, action)
    }

    @Delete('/delete/:meetId')
    async deleteMeet(
        @Param() { meetId }: { meetId: string }
    ) {
        return this.meetService.deleteMeet(meetId)
    }

}

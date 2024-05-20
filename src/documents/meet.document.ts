import { Timestamp } from "@google-cloud/firestore";
import { ProfileDocument } from "./profile.document";
import { OmitType, PartialType, PickType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsOptional } from "class-validator";


export class MeetDocument {
    static collectionName = 'meets'

    readonly status?: string = 'PENDING';

    readonly hasRated?: boolean = false;

    readonly type: string;

    readonly ownerProfile: ProfileDocument;

    readonly receiverProfile: ProfileDocument;

    readonly eventId: string;

    readonly title: string;

    readonly start: Date;

    readonly end: Date;

    readonly location?: string = "";

    readonly description: string;

    readonly link?: string;

    readonly rate?: string;

    readonly dealsize?: string = "";

    readonly createdAt: any;

}

export class createMeetDTO extends PartialType(
    OmitType(MeetDocument, ['ownerProfile', 'receiverProfile'] as const)
) {
    @IsNotEmpty()
    ownerId: string;

    @IsNotEmpty()
    receiverId: string;

    @IsNotEmpty()
    title: string;

    description: string;

    @IsNotEmpty()
    start: Date;

    @IsNotEmpty()
    end: Date;

    @IsNotEmpty()
    type: string;

    @IsNotEmpty()
    eventId: string;

}

export class updateMeetDTO extends PickType(createMeetDTO, ['title', 'description', 'start', 'end', 'type', 'location'] as const) {

    @IsNotEmpty()
    id: string;

    @IsOptional()
    title: string;

    @IsOptional()
    description: string;

    @IsOptional()
    start: Date;

    @IsOptional()
    end: Date

    @IsOptional()
    type: string;
} 

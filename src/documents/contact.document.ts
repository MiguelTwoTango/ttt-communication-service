import { ProfileDocument } from "./profile.document";
import { OmitType, PartialType, PickType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsOptional } from "class-validator";

export class ContactDocument {
    static collectionName = 'Contacts'

    readonly status?: string = 'ACCEPTED'

    readonly acceptedAt: any

    readonly bCardReceived: boolean

    readonly bCardSeen: boolean

    readonly bCardSend: boolean

    readonly isReceiverFavorite: boolean

    readonly isSenderFavorite: boolean

    readonly matchScore: Number

    readonly receiverProfile: ProfileDocument

    readonly senderProfile: ProfileDocument

    readonly createdAt : any

    readonly updateAt : any

}

export class createContactDTO extends PartialType(
    OmitType(ContactDocument, ['receiverProfile', 'senderProfile'] as const)
) {
    
    @IsNotEmpty()
    senderId: string;

    @IsNotEmpty()
    receiverId: string;

    status: string;

    @IsNotEmpty()
    acceptedAt: Date;

    @IsNotEmpty()
    bCardReceived: boolean;

    @IsNotEmpty()
    bCardSeen: boolean;

    @IsNotEmpty()
    bCardSend: boolean;

    @IsNotEmpty()
    isReceiverFavorite: boolean;

    @IsNotEmpty()
    isSenderFavorite: boolean;

    @IsNotEmpty()
    matchScore: Number;

    @IsNotEmpty()
    createdAt: Date;

    @IsNotEmpty()
    updateAt: any;

}

export class updateContactDTO extends PartialType(
    PickType(ContactDocument, ['status', 'acceptedAt', 'bCardReceived', 'bCardSeen', 'bCardSend', 'isReceiverFavorite', 'isSenderFavorite', 'matchScore', 'createdAt', 'updateAt'] as const)
) {
    @IsNotEmpty()
    id: string;
    
    @IsOptional()
    status: string;

    @IsOptional()
    acceptedAt: Date;

    @IsOptional()
    bCardReceived: boolean;

    @IsOptional()
    bCardSeen: boolean;

    @IsOptional()
    bCardSend: boolean;

    @IsOptional()
    isReceiverFavorite: boolean;

    @IsOptional()
    isSenderFavorite: boolean;

    @IsOptional()
    matchScore: Number;

    @IsOptional()
    createdAt: Date;

    @IsOptional()
    updateAt: Date;

}

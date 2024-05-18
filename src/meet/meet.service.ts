import { CollectionReference, Filter, Timestamp } from '@google-cloud/firestore';
import { Inject, Injectable } from '@nestjs/common';
import e from 'express';
import { MeetDocument, createMeetDTO, updateMeetDTO } from 'src/documents/meet.document';
import { ProfileDocument } from 'src/documents/profile.document';
import { LogicException, Errors } from 'src/shared/errors';

enum KeyFilters {
    status = "status",
    date = "date",
    type = "type"
}

@Injectable()
export class MeetService {
    constructor(
        @Inject(MeetDocument.collectionName)
        private meetCollection: CollectionReference<MeetDocument>,
        @Inject(ProfileDocument.collectionName)
        private profileCollection: CollectionReference<ProfileDocument>,
    ) { }

    async getMeetsByUser(userId: string) {
        let meetRef = await this.meetCollection
            .where(
                Filter.or(
                    Filter.where('ownerProfile._id', '==', userId),
                    Filter.where('receiverProfile._id', '==', userId)
                )
            );

        const meetSnap = await meetRef.get()
        if (meetSnap.empty) {
            throw new LogicException("No existen usuarios con ese id", Errors.PRECONDITION_FAILED)
        }
        const meetByUser = [];
        meetSnap.forEach(doc => {
            meetByUser.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return meetByUser;
    }

    async createMeet(meeting: createMeetDTO): Promise<any> {
        const { ownerId, receiverId, ...bodyMeeting } = meeting
        console.log(meeting)
        const ownerProfile = await this.profileCollection.doc(ownerId).get()
        const receiverProfile = await this.profileCollection.doc(receiverId).get()

        if (!ownerProfile.exists || !receiverProfile.exists) {
            throw new LogicException("No existen los usuarios", Errors.PRECONDITION_FAILED)
        }

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();
        const body = {
            ownerProfile: ownerProfile.data(),
            receiverProfile: receiverProfile.data(),
            ...bodyMeeting,
            createdAt: formattedDate
        }

        console.log(body)

        const meetRef = await this.meetCollection.add(body)

        const meetDoc = await this.meetCollection.doc(meetRef.id).get()


        return { id: meetDoc.id, ...meetDoc.data() }
    }

    async updateStatus(meetId: string, action: boolean): Promise<any> {
        const meetRef = await this.meetCollection.doc(meetId)
        const meetSnapshot = await meetRef.get();
        
        if (!meetSnapshot.exists) {
            throw new LogicException("No existe una reunion agendada", Errors.NOT_FOUND);
        }
        const response = action ? "ACCEPTED" : "REJECTED"
        await meetRef.update({
            status: response
        })
        const updatedMeet = await meetRef.get()

        return {
            id: updatedMeet.id,
            ...updatedMeet.data()
        }
    }

    async updateMeet(meetingDTO: updateMeetDTO): Promise<any> {
        const { id } = meetingDTO
        const meetRef = await this.meetCollection.doc(id)
        const meetSnapshot = await meetRef.get();
        if (!meetSnapshot.exists) {
            throw new LogicException("No existe una reunion agendada", Errors.NOT_FOUND);
        }

        await meetRef.update({
            ...meetingDTO
        })
        const updatedMeet = await meetRef.get()

        return {
            id: updatedMeet.id,
            ...updatedMeet.data()
        }
    }

    async deleteMeet(meetId: string) {
        const meetRef = this.meetCollection.doc(meetId);
        const doc = await meetRef.get();
        if (!doc.exists) {
            throw new LogicException("No existe ese meet", Errors.NOT_FOUND);
        }

        const res = await meetRef.delete();
        return res
    }

    async filterMeets(filters: any) {
        const { userId } = filters

        let meetRef = await this.meetCollection
            .where(
                Filter.or(
                    Filter.where('ownerProfile._id', '==', userId),
                    Filter.where('receiverProfile._id', '==', userId)
                )
            );

        const meetDoc = await meetRef.get()


        if (meetDoc.empty) {
            throw new LogicException("No existen usuarios con ese id", Errors.PRECONDITION_FAILED)
        }

        for (const key in filters) {
            if (key in KeyFilters) {

                // if (key == KeyFilters.date) {

                //     let startDate: Date | string = new Date(filters[key])
                //     let endDate: Date | string = new Date(startDate)

                //     startDate.setHours(0,0,0,0)
                //     endDate.setHours(23, 59, 59, 999)

                //     startDate = startDate.toISOString()
                //     endDate = endDate.toISOString()

                //     console.log(startDate) 
                //     console.log(endDate)
                //     meetRef = meetRef.where('createdAt', '>=', startDate)
                //         .where('createdAt', '<=', endDate);
                //     continue
                // }
                meetRef = meetRef.where(KeyFilters[key], '==', filters[key])
            }
        }

        const querySnapshot = await meetRef.get();
        const meetsFiltered = [];
        querySnapshot.forEach(doc => {
            meetsFiltered.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return meetsFiltered;
    }
}

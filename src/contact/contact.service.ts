import {
    Injectable,
    Inject,
    Logger,
    InternalServerErrorException,
} from '@nestjs/common';
import { CollectionReference, Filter, Timestamp } from '@google-cloud/firestore';
import { ContactDocument, createContactDTO, updateContactDTO } from '../documents/contact.document'; 

import { ProfileDocument } from 'src/documents/profile.document';
import { LogicException, Errors } from 'src/shared/errors';


@Injectable()
export class ContactService {
    private Logger: Logger = new Logger('ContactService');

    constructor(
        @Inject(ContactDocument.collectionName)
        private contactCollection: CollectionReference<ContactDocument>,
        @Inject(ProfileDocument.collectionName)
        private profileCollection: CollectionReference<ProfileDocument>,
    ) {}
    
    async getContactsByUser(userId: string) {
        let contactRef = await this.contactCollection
            .where(
                Filter.or(
                    Filter.where('senderProfile._id', '==', userId),
                    Filter.where('receiverProfile._id', '==', userId)
                )
            );

        const contactSnap = await contactRef.get()
        if (contactSnap.empty) {
            throw new LogicException("No existen usuarios con ese id", Errors.PRECONDITION_FAILED)
        }
        const contactByUser = [];
        contactSnap.forEach(doc => {
            contactByUser.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return contactByUser;
    
    }

    async getAllContacts() {
        const contactSnap = await this.contactCollection.get()
        if (contactSnap.empty) {
            throw new LogicException("No existen contactos", Errors.PRECONDITION_FAILED)
        }
        const contacts = [];
        contactSnap.forEach(doc => {
            contacts.push({
                id: doc.id,
                ...doc.data()
            });
        });
        return contacts;
    }


    async createContact(contact: createContactDTO): Promise<any> {
        const { senderId, receiverId, ...bodyContact } = contact
        console.log(contact)

        const senderProfile = await this.profileCollection.doc(senderId).get()
        const receiverProfile = await this.profileCollection.doc(receiverId).get()

        if (!senderProfile.exists || !receiverProfile.exists) {
            throw new LogicException("No existen los usuarios", Errors.PRECONDITION_FAILED)
        }
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();
        
        const body = {
            senderProfile: senderProfile.data(),
            receiverProfile: receiverProfile.data(),
            ...bodyContact,
            createdAt: formattedDate,
        }

        console.log(body)

        const contactRef = await this.contactCollection.add(body)

        const contactDoc = await this.contactCollection.doc(contactRef.id).get()

        return { id: contactDoc.id, ...contactDoc.data() };
    
    }

    async deleteContact(contactId:  string): Promise<any> {
        const contactRef = await this.contactCollection.doc(contactId)
        const contactSnapshot = await contactRef.get();
        
        if (!contactSnapshot.exists) {
            throw new LogicException("No existe el contacto", Errors.PRECONDITION_FAILED)
        }

        const res = await contactRef.delete()
        return res
        
    }

    

}
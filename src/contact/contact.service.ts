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
    ) { }

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

    async addFavoritReceiver(contactDTO: updateContactDTO): Promise<any> {
        const { id } = contactDTO
        const contactRef = await this.contactCollection.doc(id)
        const contactSnapshot = await contactRef.get()

        if (!contactSnapshot.exists) {
            throw new LogicException("No existe el contacto", Errors.PRECONDITION_FAILED)
        }

        await contactRef.update({
            isReceiverFavorite: true
        })

        const updatedContact = await contactRef.get()

        return {
            id: updatedContact.id,
            ...updatedContact.data()
        }
    }

    async addFavoritSender(contactDTO: updateContactDTO): Promise<any> {
        const { id } = contactDTO
        const contactRef = await this.contactCollection.doc(id)
        const contactSnapshot = await contactRef.get()

        if (!contactSnapshot.exists) {
            throw new LogicException("No existe el contacto", Errors.NOT_FOUND)
        }

        await contactRef.update({
            isSenderFavorite: true
        })

        const updatedContact = await contactRef.get()

        return {
            id: updatedContact.id,
            ...updatedContact.data()
        }
    }

    async deleteFavoriteReceiver(contactDTO: updateContactDTO): Promise<any> {
        const { id } = contactDTO
        const contactRef = await this.contactCollection.doc(id)
        const contactSnapshot = await contactRef.get()

        if (!contactSnapshot.exists) {
            throw new LogicException("No existe el contacto", Errors.NOT_FOUND)
        }

        await contactRef.update({
            isReceiverFavorite: false
        })

        const updatedContact = await contactRef.get()

        return {
            id: updatedContact.id,
            ...updatedContact.data()
        }
    }

    async deleteFavoriteSender(contactDTO: updateContactDTO): Promise<any> {
        const { id } = contactDTO
        const contactRef = await this.contactCollection.doc(id)
        const contactSnapshot = await contactRef.get()

        if (!contactSnapshot.exists) {
            throw new LogicException("No existe el contacto", Errors.NOT_FOUND)
        }

        await contactRef.update({
            isSenderFavorite: false
        })

        const updatedContact = await contactRef.get()

        return {
            id: updatedContact.id,
            ...updatedContact.data()
        }
    }


    async createContact(contact: createContactDTO): Promise<any> {
        const { senderId, receiverId, ...bodyContact } = contact

        const senderProfile = await this.profileCollection.doc(senderId).get()
        const receiverProfile = await this.profileCollection.doc(receiverId).get()


        if (!senderProfile.exists || !receiverProfile.exists) {
            throw new LogicException("No existen los usuarios", Errors.BAD_REQUEST)
        }
        const contact1 = await this.contactCollection
            .where(
                Filter.and(
                    Filter.where('receiverProfile._id', '==', receiverId),
                    Filter.where('senderProfile._id', '==', senderId)
                )
            )
        const contactExist1 = await contact1.get()
        if (contactExist1.empty) {
            throw new LogicException("Ya existe el contacto", Errors.BAD_REQUEST)
        }
        const contact2 = await this.contactCollection
        .where(
            Filter.and(
                Filter.where('receiverProfile._id', '==', senderId),
                Filter.where('senderProfile._id', '==', receiverId)
            )
        )
        const contactExist2 = await contact2.get()
        if (!contactExist2.empty) {
            throw new LogicException("Ya existe el contacto", Errors.BAD_REQUEST)
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

    async updateContact(contactDTO: updateContactDTO): Promise<any> {
        const { id } = contactDTO
        const contactRef = await this.contactCollection.doc(id)
        const contactSnapshot = await contactRef.get()
        if (!contactSnapshot.exists) {
            throw new LogicException("No existe el contacto", Errors.NOT_FOUND)
        }

        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();

        await contactRef.update({
            ...contactDTO,
            updateAt: formattedDate
        })

        const updatedContact = await contactRef.get()

        return {
            id: updatedContact.id,
            ...updatedContact.data()
        }
    }

    async deleteContact(contactId: string): Promise<any> {
        const contactRef = await this.contactCollection.doc(contactId)
        const contactSnapshot = await contactRef.get();

        if (!contactSnapshot.exists) {
            throw new LogicException("No existe el contacto", Errors.NOT_FOUND)
        }

        const res = await contactRef.delete()
        return res

    }



}
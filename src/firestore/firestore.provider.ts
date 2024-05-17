// import { ChatDocument } from "src/documents/chats.document";
// import { EventDocument } from "src/documents/events.document";
import { MeetDocument } from "src/documents/meet.document";
import { ProfileDocument } from "src/documents/profile.document";
// import { ProfileDocument } from "src/documents/profiles.document";
// import { RegistrationDocument } from "src/documents/registrations.document";

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions'
export const FirestoreCollectionProviders: string[] = [
    MeetDocument.collectionName,
    ProfileDocument.collectionName
];
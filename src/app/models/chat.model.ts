import {Message} from './message.model';

export interface Chat {
    id?: string;
    bookId?: string;
    usersIds: Array<string>;
    topic: string;
    updatedAt: number;
    count: number;
    read: Boolean;
    messages: Array<Message>;
}
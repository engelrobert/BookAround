export interface Copy {
    id?: string;
    title: string;
    subtitle?: string;
    imageurl?: string;
    description?: string;
    language?: string;
    isbn?: string;
    authors?: Array<string>;
    publisher?: string;
    publishDate?: Date;
    publishPlace?: string;
    pages?: number;
    state?: string;
    offer?: string;
    comment?: string;
}
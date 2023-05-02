import { WithId } from 'mongodb';

interface ErrorResponse {
    error: string;
}

export type Response<Data> = WithId<Data> | Array<WithId<Data>> | ErrorResponse;

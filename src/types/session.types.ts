export interface Session {
    data?: {
        user?: {
            id?: string;
            name?: string;
            email?: string;
            image?: string;
        };
    };
}

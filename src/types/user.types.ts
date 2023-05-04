export interface User {
    id: string;
    name: string;
    email: string;
    image: string | null;

    auth: {
        provider: string;
        provider_id: string;
    };

    login_at: Date;
    created_at: Date;
}

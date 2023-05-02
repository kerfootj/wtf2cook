export interface Recipe {
    id: string;

    name: string;
    description?: string;
    photo_url?: string;

    servings: number;

    time_prep: number; // mins
    time_cook?: number; // mins
    time_chill?: number; // mins
    time_total: number; // mins

    ingredients: Ingredients[];
    instructions: Instructions[];

    notes?: string;

    user_id: string;
}

export interface Ingredients {
    title: string | null;
    ingredients: string[];
}

export interface Instructions {
    title: string | null;
    instructions: string[];
}

'use client';

import { Recipe as RecipeDetails } from '@/components/organisms';
import { nanoid } from '@/lib/nanoid';
import { Recipe, Session } from '@/types';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function NewRecipe() {
    const session = useSession();
    const user_id = (session.data as Session['data'])?.user?.id;

    if (!user_id) {
        redirect('/login');
    }

    const recipe: Recipe = {
        id: nanoid(),
        user_id,

        name: '',
        description: '',
        ingredients: [
            {
                title: '',
                ingredients: [],
            },
        ],
        instructions: [
            {
                title: '',
                instructions: [],
            },
        ],
        servings: 0,
        time_prep: 0,
        time_cook: 0,
        time_chill: 0,
        time_total: 0,
        photo_url: '/images/placeholder.svg',
    };

    return <RecipeDetails recipe={recipe} editing />;
}

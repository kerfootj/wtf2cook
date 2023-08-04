// 'use client';
import { Content } from '@/components/atoms';
import { FeaturedRecipe, RecipeGrid } from '@/components/organisms';
import { Recipe } from '@/types';

type HomeProps = {
    recipes: Recipe[];
};

export function Home(props: HomeProps) {
    const { recipes } = props;

    return (
        <Content>
            <FeaturedRecipe />
            <RecipeGrid recipes={recipes} />
        </Content>
    );
}

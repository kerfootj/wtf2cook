'use client';
import { generateListKey } from '@/lib/key';
import { Recipe } from '@/types';
import { List, ListItem, Typography } from '@mui/material';

/**
 * Renders the ingredients header and maps the ingredient sections
 * into sub-lists with optional titles.
 */
export function Ingredients({ recipe }: { recipe: Recipe }) {
    return (
        <div>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Ingredients
            </Typography>
            {recipe.ingredients.map(({ ingredients, title }, i) => (
                <IngredientsList
                    key={`ingredients-${i}`}
                    ingredients={ingredients}
                    title={title}
                />
            ))}
        </div>
    );
}

/**
 * Renders the header for an ingredient section and the list of ingredients.
 */
function IngredientsList({
    ingredients,
    title,
}: {
    ingredients: string[];
    title: string | null;
}) {
    return (
        <div>
            {title && (
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {title}
                </Typography>
            )}
            <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
                {ingredients.map((ingredient) => (
                    <ListItem
                        key={generateListKey(ingredient)}
                        sx={{ display: 'list-item' }}
                    >
                        <Typography variant="body1">{ingredient}</Typography>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

'use client';
import { getURLFromRecipe } from '@/lib/getURLFromRecipe';
import { Recipe } from '@/types';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material';
import Link from 'next/link';
import TextTruncate from 'react-text-truncate';

interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard(props: RecipeCardProps) {
    const { recipe } = props;
    const { name, description, photo_url } = recipe;

    return (
        <Card sx={{ height: { md: 410 }, maxWidth: { md: 410 } }}>
            <Link
                passHref
                href={getURLFromRecipe(recipe)}
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <CardActionArea>
                    <CardMedia
                        image={photo_url}
                        title={name}
                        sx={{ height: 300 }}
                    />
                    <CardContent>
                        <Typography
                            variant="h6"
                            sx={{ color: 'text.primary', mb: 0.8 }}
                        >
                            {name}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                        >
                            <TextTruncate
                                line={2}
                                truncateText="…"
                                text={description}
                                element="span"
                            />
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Link>
        </Card>
    );
}

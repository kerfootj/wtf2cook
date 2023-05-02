import { Recipe } from '@/types';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material';
import TextTruncate from 'react-text-truncate';

interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard(props: RecipeCardProps) {
    const { recipe } = props;
    const { name, description, photo_url } = recipe;

    return (
        <Card sx={{ height: 410 }}>
            <CardActionArea>
                <CardMedia
                    image={photo_url}
                    title={name}
                    sx={{ height: 300 }}
                />
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {name}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: (theme) => theme.palette.text.secondary }}
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
        </Card>
    );
}

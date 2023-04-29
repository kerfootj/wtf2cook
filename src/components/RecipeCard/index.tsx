import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material';
import TextTruncate from 'react-text-truncate';

export default function RecipeCard() {
    const description = `Decadent dark chocolate cheesecake topped with cherries and whipped cream.`;

    return (
        <Card sx={{ height: 410 }}>
            <CardActionArea>
                <CardMedia
                    image="https://i.imgur.com/5VpZZN1.jpg"
                    title="cake"
                    sx={{ height: 300 }}
                />
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Black Forest Cheesecake
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

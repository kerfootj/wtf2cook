'use client';
import { Recipe } from '@/types';
import { Box, Typography, useTheme } from '@mui/material';

/**
 * Renders the servings and timings for a recipe.
 */
export function RecipeServingsAndTimings(props: { recipe: Recipe }) {
    const { servings, time_prep, time_total, time_chill, time_cook } =
        props.recipe;
    const theme = useTheme();

    const formatTime = (time: number | undefined) => {
        if (!time) {
            return null;
        }

        const hrs = Math.floor(time / 60);
        const mins = time % 60;

        const formatted_time: string[] = [];

        if (hrs) {
            formatted_time.push(`${hrs} hr${hrs > 1 ? 's' : ''}`);
        }

        if (mins) {
            formatted_time.push(`${mins} min${mins > 1 ? 's' : ''}`);
        }

        return formatted_time.join(' ');
    };

    const data = [
        { label: 'Servings', value: servings.toString() },
        { label: 'Prep Time', value: formatTime(time_prep) },
        { label: 'Cook Time', value: formatTime(time_cook) },
        { label: 'Chill Time', value: formatTime(time_chill) },
        { label: 'Total Time', value: formatTime(time_total) },
    ].filter((item) => item.value);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                columnGap: 1.6,
                rowGap: 0.4,
            }}
        >
            {data.map(({ label, value }) => (
                <Typography
                    key={label}
                    variant="body1"
                    style={{ fontSize: '0.9em' }}
                >
                    <span
                        style={{
                            color: theme.palette.text.secondary,
                        }}
                    >
                        {label}:
                    </span>
                    &nbsp; &nbsp;
                    <span>
                        <b>{value}</b>
                    </span>
                </Typography>
            ))}
        </Box>
    );
}

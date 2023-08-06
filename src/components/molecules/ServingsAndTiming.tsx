'use client';
import { Recipe } from '@/types';
import { Box, Typography } from '@mui/material';
import { EditorInput } from '../atoms';
import { useRecipe } from '../context/RecipeContext';

/**
 * Renders the servings and timings for a recipe.
 */
export function RecipeServingsAndTimings(props: { recipe: Recipe }) {
    const { servings, time_prep, time_total, time_chill, time_cook } =
        props.recipe;

    const { editing, update } = useRecipe();

    const handleServingsChange = (value: string) => {
        if (value === '') {
            return update('servings')('');
        }

        try {
            const number = parseInt(value);

            if (isNaN(number)) {
                return;
            }

            update('servings')(number);
        } finally {
            return;
        }
    };

    const timings = [
        {
            key: 'time_prep',
            label: 'Prep Time',
            value: time_prep,
        },
        {
            key: 'time_cook',
            label: 'Cook Time',
            value: time_cook,
        },
        {
            key: 'time_chill',
            label: 'Chill Time',
            value: time_chill,
        },
        {
            key: 'time_total',
            label: 'Total Time',
            value: time_total,
        },
    ].filter((item) => item.value || editing);

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 0.4,
                }}
            >
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: '0.9em', width: '84px' }}
                    noWrap
                >
                    Servings:
                </Typography>

                <EditorInput
                    value={servings}
                    onChange={handleServingsChange}
                    typography={{
                        variant: 'body1',
                        fontWeight: 600,
                        fontSize: '0.9em',
                    }}
                    editor={{
                        sx: { maxWidth: 160 },
                    }}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    columnGap: 1.6,
                    rowGap: 0.4,
                }}
            >
                {timings.map(({ key, label, value }) => (
                    <Box
                        key={key}
                        sx={{
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'nowrap',
                            alignItems: 'center',
                        }}
                    >
                        <Timing name={key} value={value} label={label} />
                    </Box>
                ))}
            </Box>
        </>
    );
}

/**
 * Renders a timing value for the recipe for example Cook Time: 1 hr 30 mins.
 * - Handles updating the hrs and mins separately.
 */
function Timing(props: {
    name: string;
    value: number | undefined;
    label: string;
}) {
    const { name: key, value, label } = props;

    const { editing, update } = useRecipe();

    /**
     * Formats a time in minutes to a string.
     * @param time The time in minutes.
     * @returns A string representing the time and the number of hours and minutes.
     */
    const formatTime = (time: number | undefined) => {
        if (!time) {
            return { result: '', hrs: 0, mins: 0 };
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

        return { result: formatted_time.join(' '), hrs, mins };
    };

    /**
     * Handles the time change by combining the hours and minutes into
     * a single result in minutes.
     */
    const handleTimeChange =
        ({ key, type }: { key: string; type: 'hrs' | 'mins' }) =>
        (input: string) => {
            let number = 0;

            try {
                number = parseInt(input);
            } finally {
                if (isNaN(number)) {
                    number = 0;
                }
            }

            const hrs = type === 'hrs' ? number : formatTime(value).hrs;
            const mins = type === 'mins' ? number : formatTime(value).mins;

            update(key)(hrs * 60 + mins);
        };

    return (
        <Box
            key={key}
            sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                alignItems: 'center',
                gap: 1,
            }}
        >
            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: '0.9em', width: '84px' }}
                noWrap
            >
                {label}:
            </Typography>

            {editing ? (
                <div>
                    <EditableTime
                        value={formatTime(value).hrs}
                        type="hrs"
                        onChange={handleTimeChange({ key, type: 'hrs' })}
                    />

                    <EditableTime
                        value={formatTime(value).mins}
                        type="mins"
                        onChange={handleTimeChange({ key, type: 'mins' })}
                    />
                </div>
            ) : (
                <Typography variant="body1" sx={{ fontSize: '0.9em' }} noWrap>
                    {formatTime(value).result}
                </Typography>
            )}
        </Box>
    );
}

/**
 * Input component used for editing the hours and minutes of a time.
 */
function EditableTime(props: {
    value: number | undefined;
    type: 'hrs' | 'mins';
    onChange: (value: string) => void;
}) {
    const { value, type, onChange } = props;

    return (
        <EditorInput
            value={value}
            onChange={onChange}
            typography={{
                variant: 'body1',
                fontWeight: 600,
                fontSize: '0.9em',
            }}
            editor={{
                endAdornment: (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mr: 1 }}
                    >
                        {type}
                    </Typography>
                ),
                sx: { maxWidth: 80 },
            }}
        />
    );
}

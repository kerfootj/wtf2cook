import { Recipe } from '@/types';
import {
    Box,
    Grid,
    List,
    ListItem,
    Paper,
    Typography,
    useTheme,
} from '@mui/material';
import Image from 'next/image';

type RecipeProps = {
    recipe: Recipe;
};

export function Recipe(props: RecipeProps) {
    const { recipe } = props;
    const { name, description, photo_url } = recipe;

    return (
        <Paper sx={{ p: 3, width: { xs: '100vw', md: 860 } }}>
            <Grid
                container
                spacing={2}
                flexDirection={{ xs: 'column-reverse', md: 'row' }}
                alignItems={{ xs: 'center', md: 'flex-start' }}
            >
                <Grid item xs={12} md={9}>
                    <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
                        {name}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {description}
                    </Typography>

                    <RecipeServingsAndTimings {...recipe} />
                </Grid>
                <Grid item xs={12} md={3}>
                    {photo_url && (
                        <Image
                            src={photo_url}
                            alt={name}
                            width={180}
                            height={180}
                            style={{
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}
                        />
                    )}
                </Grid>
            </Grid>
            <Box
                sx={{
                    background: (theme) => theme.palette.grey['700'],
                    width: '100%',
                    height: '1px',
                    mt: 2,
                }}
            />

            <Box display="flex" flexDirection="column" gap={3} mt={3}>
                <Ingredients recipe={recipe} />

                <Instructions recipe={recipe} />
            </Box>
        </Paper>
    );
}

/**
 * Renders the servings and timings for a recipe.
 */
function RecipeServingsAndTimings(
    props: Pick<
        RecipeProps['recipe'],
        'servings' | 'time_chill' | 'time_cook' | 'time_prep' | 'time_total'
    >,
) {
    const { servings, time_prep, time_total, time_chill, time_cook } = props;
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

/**
 * Renders the ingredients header and maps the ingredient sections
 * into sub-lists with optional titles.
 */
function Ingredients({ recipe }: { recipe: Recipe }) {
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
                        key={generateKey(ingredient)}
                        sx={{ display: 'list-item' }}
                    >
                        <Typography variant="body1">{ingredient}</Typography>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

/**
 * Renders the instructions header and maps the instruction sections
 * into sub-lists with optional titles.
 */
function Instructions({ recipe }: { recipe: Recipe }) {
    return (
        <div>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Instructions
            </Typography>
            {recipe.instructions.map(({ instructions, title }, i) => (
                <InstructionsList
                    key={`instructions-${i}`}
                    instructions={instructions}
                    title={title}
                />
            ))}
        </div>
    );
}

/**
 * Renders the header for an instruction section and the list of instructions.
 */
function InstructionsList({
    instructions,
    title,
}: {
    instructions: string[];
    title: string | null;
}) {
    return (
        <div>
            {title && (
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {title}
                </Typography>
            )}
            <List dense sx={{ listStyleType: 'decimal', pl: 4 }}>
                {instructions.map((instruction) => (
                    <ListItem
                        key={generateKey(instruction)}
                        sx={{ display: 'list-item' }}
                    >
                        <Typography variant="body1">{instruction}</Typography>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

/**
 * Generates a key for an item in the instructions or ingredients list.
 */
function generateKey(input: string): string {
    return input.substring(0, 32).trim().toLowerCase().replace(/ +/g, '-');
}

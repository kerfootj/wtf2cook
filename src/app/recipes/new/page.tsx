'use client';

import { Recipe } from '@/types';
import {
    Box,
    Grid,
    Paper,
    SxProps,
    TextareaAutosize,
    Theme,
    Typography,
    TypographyVariant,
    css,
    styled,
    useTheme,
} from '@mui/material';
import Image from 'next/image';
import { ReactNode, useState } from 'react';

type HandleChangeArgs = { key: string; value: string };
type HandleChange = (args: HandleChangeArgs) => void;

const StyleTextArea = styled(TextareaAutosize)(
    ({ theme }) =>
        css`
            color: white;
            background: transparent;
            border: 1px solid ${theme.palette.grey[700]};
            border-radius: 8px;

            width: 100%;
        `,
);

const DEFAULT_PROPS: Partial<Recipe> = {
    name: 'Recipe Title',
    description: 'Write a great description for your recipe.',
    ingredients: [
        {
            title: 'Ingredients For the Recipe',
            ingredients: ['Ingredient 1', 'Ingredient 2', 'Ingredient 3'],
        },
    ],
    instructions: [
        {
            title: 'Instructions For the Recipe',
            instructions: ['Instruction 1', 'Instruction 2', 'Instruction 3'],
        },
    ],
    servings: 4,
    time_prep: 10,
    time_cook: 20,
    time_chill: 0,
    time_total: 30,
    photo_url: '/images/placeholder.svg',
};

export default function NewRecipe() {
    const [recipe, setRecipe] = useState(DEFAULT_PROPS);

    const handleChange = ({ key, value }: HandleChangeArgs) => {
        setRecipe((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    return (
        <RecipeContainer>
            <Grid
                container
                spacing={2}
                flexDirection={{ xs: 'column-reverse', md: 'row' }}
                alignItems={{ xs: 'center', md: 'flex-start' }}
            >
                <Grid item xs={12} md={9}>
                    <EditableText
                        name="name"
                        value={recipe.name}
                        handleChange={handleChange}
                        variant="h3"
                        sx={{ fontWeight: 600, mb: 2 }}
                    />

                    <EditableText
                        name="description"
                        value={recipe.description}
                        handleChange={handleChange}
                        variant="body1"
                        sx={{ mb: 2 }}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Image
                        src={recipe.photo_url as string}
                        alt={recipe.name as string}
                        width={180}
                        height={180}
                        style={{
                            borderRadius: '50%',
                            objectFit: 'cover',
                        }}
                    />
                </Grid>
            </Grid>

            <Box
                sx={{
                    background: (theme) => theme.palette.grey[700],
                    width: '100%',
                    height: '1px',
                    mt: 2,
                }}
            />
        </RecipeContainer>
    );
}

function RecipeContainer(props: { children: ReactNode }) {
    const { children } = props;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                my: 2,
            }}
        >
            <Paper sx={{ p: 3, width: { xs: '100vw', md: 860 } }}>
                {children}
            </Paper>
        </Box>
    );
}

function EditableText(props: {
    name: string;
    value?: string;
    handleChange: HandleChange;
    variant: TypographyVariant;
    sx?: SxProps<Theme>;
}) {
    const { name, value, sx, variant, handleChange } = props;

    const theme = useTheme();

    const [focused, setFocused] = useState(false);

    return focused ? (
        <StyleTextArea
            autoFocus
            value={value}
            onBlur={() => setFocused(false)}
            onChange={(event) =>
                handleChange({ key: name, value: event.target.value })
            }
            style={theme.typography[variant]}
        />
    ) : (
        <Typography sx={sx} variant={variant} onClick={() => setFocused(true)}>
            {value}
        </Typography>
    );
}

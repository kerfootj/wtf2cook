'use client';
import { Recipe } from '@/types';
import { Clear, Edit, Save, Visibility } from '@mui/icons-material';
import { Box, Button, Grid, Paper } from '@mui/material';
import Image from 'next/image';
import { EditorTextArea } from '../atoms';
import { RecipeProvider, useRecipe } from '../context/RecipeContext';
import { NestedList, RecipeServingsAndTimings } from '../molecules';

type RecipeProps = {
    recipe: Recipe;
};

export function Recipe(props: RecipeProps) {
    const { recipe } = props;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                my: 2,
            }}
        >
            <RecipeProvider recipe={recipe}>
                <RecipeContent />
            </RecipeProvider>
        </Box>
    );
}

function RecipeContent() {
    const {
        recipe,
        editable,
        editing,
        edit,
        update,
        cancel,
        preview,
        previewing,
        save,
    } = useRecipe();

    return (
        <Paper
            sx={{
                p: 3,
                width: { xs: '100vw', md: 860 },
                position: 'relative',
            }}
        >
            <Box sx={{ mb: 2 }}>
                {editable && !editing && !previewing && (
                    <Button
                        variant="outlined"
                        endIcon={<Edit />}
                        onClick={edit}
                    >
                        Edit
                    </Button>
                )}

                {editable && editing && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            endIcon={<Visibility />}
                            onClick={preview}
                        >
                            Preview
                        </Button>

                        <Button
                            variant="outlined"
                            color="secondary"
                            endIcon={<Clear />}
                            onClick={cancel}
                        >
                            Cancel
                        </Button>
                    </Box>
                )}

                {editable && previewing && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            endIcon={<Edit />}
                            onClick={edit}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="outlined"
                            endIcon={<Save />}
                            onClick={save}
                        >
                            Save
                        </Button>

                        <Button
                            variant="outlined"
                            color="secondary"
                            endIcon={<Clear />}
                            onClick={cancel}
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
            </Box>

            <Grid
                container
                spacing={2}
                flexDirection={{ xs: 'column-reverse', md: 'row' }}
                alignItems={{ xs: 'center', md: 'flex-start' }}
            >
                <Grid item xs={12} md={9}>
                    <EditorTextArea
                        value={recipe.name}
                        onChange={update('name')}
                        typography={{
                            variant: 'h3',
                            fontWeight: 600,
                            sx: { mb: 2 },
                        }}
                    />

                    <EditorTextArea
                        value={recipe.description}
                        onChange={update('description')}
                        typography={{ variant: 'body1', sx: { mb: 2 } }}
                    />

                    <RecipeServingsAndTimings recipe={recipe} />
                </Grid>
                <Grid item xs={12} md={3}>
                    {recipe.photo_url && (
                        <Image
                            src={recipe.photo_url}
                            alt={recipe.name}
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
                    background: (theme) => theme.palette.grey[700],
                    width: '100%',
                    height: '1px',
                    mt: 2,
                }}
            />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    mt: 3,
                }}
            >
                <NestedList recipe={recipe} type="ingredients" />

                <NestedList recipe={recipe} type="instructions" />
            </Box>
        </Paper>
    );
}

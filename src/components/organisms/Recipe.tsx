'use client';

import type { Recipe } from '@/types';
import { Clear, Edit, Save, Visibility } from '@mui/icons-material';
import { Box, Button, CircularProgress, Grid, Paper } from '@mui/material';
import Image from 'next/image';
import { EditorTextArea } from '../atoms';
import { RecipeProvider, useRecipe } from '../context/RecipeContext';
import { NestedList, RecipeServingsAndTimings } from '../molecules';
import { ImageUpload } from '../molecules/ImageUpload/ImageUpload';

export type RecipeProps = {
    recipe: Recipe;
    editing?: boolean;
};

export function Recipe(props: RecipeProps) {
    const { recipe, editing } = props;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                my: 2,
            }}
        >
            <RecipeProvider recipe={recipe} editing={editing}>
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
        saving,
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
                            disabled={saving}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="outlined"
                            endIcon={
                                saving ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    <Save />
                                )
                            }
                            onClick={save}
                            disabled={saving}
                        >
                            Save
                        </Button>

                        <Button
                            variant="outlined"
                            color="secondary"
                            endIcon={<Clear />}
                            onClick={cancel}
                            disabled={saving}
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
                        editor={{
                            placeholder: 'Recipe Name',
                        }}
                    />

                    <EditorTextArea
                        value={recipe.description}
                        onChange={update('description')}
                        typography={{ variant: 'body1', sx: { mb: 2 } }}
                        editor={{
                            placeholder: 'Recipe Description',
                            minRows: 3,
                        }}
                    />

                    <RecipeServingsAndTimings recipe={recipe} />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Box sx={{ position: 'relative' }}>
                        <Image
                            src={recipe.photo_url || '/images/placeholder.svg'}
                            alt={recipe.name}
                            width={192}
                            height={192}
                            priority
                            style={{
                                borderRadius: '2%',
                                objectFit: 'cover',
                            }}
                        />

                        {editing && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    width: 192,
                                    height: 192,
                                    top: 0,
                                    background: 'rgba(0, 0, 0, 0.69)',
                                }}
                            >
                                <ImageUpload
                                    onDrop={(image) => {
                                        update('photo_url')(image.url);
                                    }}
                                />
                            </Box>
                        )}
                    </Box>
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

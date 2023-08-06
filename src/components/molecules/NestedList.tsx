'use client';
import { Ingredients, Instructions, Recipe } from '@/types';
import { Clear, ControlPoint, Delete } from '@mui/icons-material';
import {
    Box,
    IconButton,
    List,
    ListItem,
    Typography,
    useTheme,
} from '@mui/material';
import { EditorTextArea } from '../atoms';
import { useRecipe } from '../context/RecipeContext';

type NestedListProps = {
    recipe: Recipe;
    type: 'ingredients' | 'instructions';
};

/**
 * Renders the nested ingredients and instruction lists.
 * - handles updating the nested lists when editing a recipe.
 * - ingredients renders an unordered list of ingredients.
 * - instructions renders an ordered list of instructions.
 *
 * @param props.recipe The recipe to render.
 * @param props.type The type of list to render.
 */
export function NestedList(props: NestedListProps) {
    const { recipe, type } = props;
    const { editing, update } = useRecipe();
    const theme = useTheme();

    const values = recipe[type];
    const title = type === 'ingredients' ? 'Ingredients' : 'Instructions';

    return (
        <div>
            <Typography variant="h4" sx={{ mb: 2 }}>
                {title}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {values.map((value, index) => (
                    <ParentList
                        key={`${type}[${index}]`}
                        type={type}
                        name={`${type}[${index}]`}
                        values={value}
                        index={index}
                        total={recipe[type].length}
                    />
                ))}

                {editing && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            pr: '40px',
                        }}
                    >
                        <Box
                            sx={{
                                background: (theme) => theme.palette.grey[700],
                                width: '100%',
                                height: '1px',
                            }}
                        />

                        <IconButton
                            onClick={() => {
                                update(`${type}[${recipe[type].length}]`)({
                                    title: '',
                                    [type]: [],
                                });
                            }}
                        >
                            <ControlPoint
                                sx={{ color: theme.palette.grey[700] }}
                            />
                        </IconButton>

                        <Box
                            sx={{
                                background: (theme) => theme.palette.grey[700],
                                width: '100%',
                                height: '1px',
                            }}
                        />
                    </Box>
                )}
            </Box>
        </div>
    );
}

/**
 * Renders the header for an ingredient or instruction section and the list values.
 */
function ParentList(props: {
    type: 'ingredients' | 'instructions';
    name: string;
    values: Ingredients | Instructions | null;
    index: number;
    total: number;
}) {
    const { type, name: key, values, index, total } = props;
    const { editing, update } = useRecipe();
    const theme = useTheme();

    if (values === null) {
        return null;
    }

    // @ts-expect-error - type will always be ingredients or instructions.
    const { title, [type]: nest_values } = values;

    return (
        <div>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EditorTextArea
                    value={title}
                    onChange={update(`${key}.title`)}
                    typography={{
                        variant: 'h6',
                        color: 'text.secondary',
                        sx: { color: 'text.secondary' },
                    }}
                    editor={{
                        placeholder: 'Add a subtitle, e.g. "For the dough"',
                    }}
                />

                {editing && (
                    <IconButton
                        onClick={() => update(`${type}[${index}]`)(null)}
                        sx={{
                            visibility:
                                index === 0 || index === total
                                    ? 'hidden'
                                    : 'visible',
                        }}
                    >
                        <Delete sx={{ color: theme.palette.grey[700] }} />
                    </IconButton>
                )}
            </Box>

            <List
                dense
                sx={{
                    listStyleType: type === 'ingredients' ? 'disc' : 'decimal',
                    pl: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {(nest_values as string[])
                    // keep an empty line at the end if editing
                    .concat(editing ? [''] : [])
                    .map(
                        (value, i) =>
                            value !== null && (
                                <Item
                                    key={`${key}.${type}[${i}]`}
                                    type={type}
                                    name={key}
                                    index={i}
                                    total={nest_values.length}
                                    value={value}
                                />
                            ),
                    )}
            </List>
        </div>
    );
}

function Item(props: {
    type: 'ingredients' | 'instructions';
    name: string;
    index: number;
    total: number;
    value: string;
}) {
    const { type, name: key, index, total, value } = props;
    const { editing, update } = useRecipe();
    const theme = useTheme();

    return (
        <ListItem
            sx={{
                display: 'list-item',
                p: editing ? 0 : undefined,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EditorTextArea
                    value={value}
                    onChange={update(`${key}.${type}[${index}]`)}
                    typography={{
                        variant: 'body1',
                    }}
                    editor={{
                        placeholder:
                            type === 'ingredients'
                                ? 'Add an ingredient, e.g. "1 cup of flour"'
                                : 'Add an instruction, e.g. "Preheat the oven to 350 degrees"',
                    }}
                />

                {editing && (
                    <IconButton
                        onClick={() => update(`${key}.${type}[${index}]`)(null)}
                        sx={{
                            visibility: index !== total ? 'visible' : 'hidden',
                        }}
                    >
                        <Clear sx={{ color: theme.palette.grey[700] }} />
                    </IconButton>
                )}
            </Box>
        </ListItem>
    );
}

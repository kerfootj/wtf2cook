import { generateListKey } from '@/lib/key';
import { Recipe } from '@/types';
import { List, ListItem, Typography } from '@mui/material';

/**
 * Renders the instructions header and maps the instruction sections
 * into sub-lists with optional titles.
 */
export function Instructions({ recipe }: { recipe: Recipe }) {
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
                        key={generateListKey(instruction)}
                        sx={{ display: 'list-item' }}
                    >
                        <Typography variant="body1">{instruction}</Typography>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}
